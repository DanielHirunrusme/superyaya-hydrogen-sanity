import { Link, useSearchParams } from '@remix-run/react';
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import MinusIcon from '../icons/Minus';
import PlusIcon from '../icons/Plus';
import { UI_FORM_ELEMENT_HEIGHT } from '~/lib/constants';

export default function ProductCustomColorOptions({ product }) {
  // grab existing query params (?Size=…&Color=… etc)
  const [searchParams] = useSearchParams();

  // 1. Find the current color value (e.g. "Black")
  const currentColor = product.selectedVariant.selectedOptions
    .find(o => o.name === 'Color')?.value;

  // 2. Pull out the active swatch image + name from product.swatch
  const swatchMeta = product.swatch?.reference;
  const activeImageRef = swatchMeta?.fields.find(f => f.key === 'image')?.reference?.image;
  const activeName = swatchMeta?.fields.find(f => f.key === 'name')?.value;
  const activeSwatch = {
    handle: product.handle,
    name: activeName,
    url: activeImageRef?.url,
  };

  // 3. Build the other swatches from product_colors
  const additionalSwatches = (product.product_colors?.references?.nodes || []).map(node => {
    const fields = node.swatch.reference.fields;
    const img = fields.find(f => f.key === 'image')?.reference?.image;
    const name = fields.find(f => f.key === 'name')?.value;
    return {
      handle: node.handle,
      name,
      url: img?.url,
    };
  });

  // 4. Combine & sort alphabetically
  const swatches = [activeSwatch, ...additionalSwatches]
    .filter(s => s.name && s.url)
    .sort((a, b) => a.name.localeCompare(b.name));

  // if(swatches.length <= 1) {
  //   return <></>
  // }

  return (
    <Listbox value={currentColor}>
      {({ open }) => (
        <div className={clsx('relative border border-black', !open && 'hover:opacity-50')}>
          <Listbox.Button className={clsx('group relative block w-full', UI_FORM_ELEMENT_HEIGHT)}>
            {open ? (
              <span className="flex items-center px-[1em]">Select Color</span>
            ) : (
              <span className="flex items-center gap-2 relative h-full overflow-hidden ">
                {/* show active swatch */}
                {activeSwatch.url && (
                  <img
                    src={activeSwatch.url}
                    alt={activeSwatch.name}
                    className="h-full object-cover"
                  />
                )}
                <span>{currentColor}</span>
              </span>
            )}

            <span className="pointer-events-none absolute inset-y-0 right-0 top-0 flex items-center px-[1em]">
              {open ? <MinusIcon /> : <PlusIcon />}
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-10 w-full bg-white shadow-lg">
              {swatches.map(s => {
                // clone/update the query params
                const params = new URLSearchParams(searchParams.toString());
                params.set('Color', s.name);
                const href = `/products/${s.handle}?${params.toString()}`;

                return (
                  <Listbox.Option
                    key={s.name}
                    as={Link}
                    to={href}
                    className={({ active }) =>
                      clsx(
                        UI_FORM_ELEMENT_HEIGHT,
                        'flex items-center gap-2 relative overflow-hidden hover:opacity-50',
                        active ? 'bg-gray-100' : 'text-black hover:text-opacity-75',
                        s.name === currentColor && 'underline decoration-1 underline-offset-4'
                      )
                    }
                    prefetch="intent"
                  >
                    <img
                      src={s.url}
                      alt={`${s.name} swatch`}
                      className="h-full aspect-square object-cover flex-0"
                    />
                    <span>{s.name}</span>
                    <hr className="h-px bg-black w-full absolute top-0" />
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
