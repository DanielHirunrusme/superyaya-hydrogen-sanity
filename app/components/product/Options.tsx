import {Link} from '@remix-run/react';
import {Image, VariantSelector} from '@shopify/hydrogen';
import {
  Product,
  ProductOption,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import {useEffect} from 'react';

import Tooltip from '~/components/elements/Tooltip';
import type {SanityCustomProductOption} from '~/lib/sanity';
import {Fragment, useState} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import MinusIcon from '../icons/Minus';
import PlusIcon from '../icons/Plus';
import clsx from 'clsx';
import {UI_FORM_ELEMENT_HEIGHT} from '~/lib/constants';

const getSwatch = (variants, selectOption) => {
  let swatch;
  variants.forEach((variant) => {
    variant.selectedOptions?.forEach((option) => {
      if (option.name === 'Color' && option.value === selectOption) {
        if (variant.swatch) {
          swatch = variant.swatch;
        }
      }
    });
  });

  if (swatch?.reference?.image?.originalSrc) {
    return (
      <div className={clsx('relative aspect-square h-full')}>
        <Image
          className="absolute h-full w-full object-cover"
          alt="color"
          src={swatch.reference?.image?.originalSrc}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx('aspect-square bg-gray', UI_FORM_ELEMENT_HEIGHT)}
    ></div>
  );
};

export default function ProductOptions({
  product,
  variants,
  options,
  selectedVariant,
  customProductOptions,
}: {
  product: Product;
  variants: ProductVariant[];
  options: ProductOption[];
  selectedVariant: ProductVariant;
  customProductOptions?: SanityCustomProductOption[];
}) {
  const [selected, setSelected] = useState(selectedVariant.selectedOptions);

  const [optionsSelected, setOptionsSelected] = useState([
    {name: 'Size', value: ''},
    {name: 'Color', value: ''},
  ]);

  useEffect(() => {
    if (
      selectedVariant.selectedOptions[0].value &&
      selectedVariant.selectedOptions[1].value
    ) {
      setOptionsSelected([
        {name: 'Size', value: selectedVariant.selectedOptions[0].value},
        {name: 'Color', value: selectedVariant.selectedOptions[1].value},
      ]);
    }
  }, [selectedVariant]);

  const onListboxOptionClick = (optionName, value) => {
    if (optionName === 'Size') {
      setOptionsSelected([
        {name: 'Size', value: value},
        {name: 'Color', value: optionsSelected[1].value},
      ]);
    } else {
      setOptionsSelected([
        {name: 'Size', value: optionsSelected[0].value},
        {name: 'Color', value: value},
      ]);
    }
  };

  return (
    <>
      <VariantSelector
        handle={product.handle}
        options={options}
        variants={variants}
      >
        {({option}) => {
          const optionName = option.name;
          // Check if current product has a valid custom option type.
          // If so, render a custom option component.
          const customProductOption = customProductOptions?.find(
            (customOption) => customOption.title === option.name,
          );

          const match = optionsSelected?.filter(
            (selectedOption) => selectedOption.name === option.name,
          );


          const swatch = match?.[0]?.value ? (
            getSwatch(variants, match[0].value)
          ) : (
            <></>
          );
          const label = () => {
            switch (option.name) {
              case 'Color':
                return <>{swatch}</>;
              case 'Size':
                return <span className="pl-[1em]">Size:&nbsp;</span>;
              default:
                return <></>;
            }
          };

          return (
            <div>
              <Listbox value={selected} onChange={setSelected}>
                {({open}) => (
                  <div
                    className={`${
                      !open && 'hover:opacity-50'
                    } relative border border-black`}
                  >
                    <Listbox.Button
                      className={clsx(
                        'group relative block w-full',
                        UI_FORM_ELEMENT_HEIGHT,
                      )}
                    >
                      {!open ? (
                        <span
                          className={clsx(
                            'block flex items-center text-left',
                            option.name === 'Color' && 'gap-[1em] h-full relative',
                          )}
                        >
                          {label()}
                          <span className="">{match?.[0]?.value}</span>
                        </span>
                      ) : (
                        <span className="pointer-events-none block px-[1em] text-left ">
                          Select {option.name}
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
                      <Listbox.Options className="flex flex-col divide-y border-t">
                        {/* Default option */}
                        {/* <Listbox.Option
                        className={({active}) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-gray-900'
                          }`
                        }
                        value={option}
                      >
                        <span>Select {option.name}</span>
                      </Listbox.Option> */}

                        {/* Options liked: S, M, L, XL */}
                        {option.values.map(
                          ({value, to, isActive, isAvailable}) => {
                            const id = `option-${option.name}-${value}`;
                            const swatch =
                              optionName === 'Color'
                                ? getSwatch(variants, value)
                                : null;
                            switch (customProductOption?._type) {
                              // case 'customProductOption.color': {
                              //   const foundCustomOptionValue =
                              //     customProductOption.colors.find(
                              //       (color) => color.title === value,
                              //     );

                              //   return (
                              //     <Listbox.Option
                              //       as={Link}
                              //       to={to}
                              //       value={value}
                              //       key={id}
                              //     >
                              //       <ColorButton
                              //         to={to}
                              //         isSelected={isActive}
                              //         isAvailable={isAvailable}
                              //         hex={
                              //           foundCustomOptionValue?.hex || '#fff'
                              //         }
                              //       />
                              //     </Listbox.Option>
                              //   );
                              // }
                              // case 'customProductOption.size': {
                              //   const foundCustomOptionValue =
                              //     customProductOption.sizes.find(
                              //       (size) => size.title === value,
                              //     );

                              //   return (
                              //     <Listbox.Option value={value} key={id}>
                              //       <div
                              //         data-on-click
                              //         onClick={() =>
                              //           onListboxOptionClick(option.name, value)
                              //         }
                              //       >
                              //         <OptionButton
                              //           to={to}
                              //           isSelected={isActive}
                              //           isAvailable={isAvailable}
                              //         >
                              //           {value}
                              //         </OptionButton>
                              //       </div>
                              //     </Listbox.Option>
                              //   );
                              // }
                              default:
                                return (
                                  <Listbox.Option
                                    as={Link}
                                    to={to}
                                    value={value}
                                    preventScrollReset
                                    replace
                                    // data-isactive={isActive}
                                    prefetch="intent"
                                    className={clsx(
                                      UI_FORM_ELEMENT_HEIGHT,
                                      isActive
                                        ? 'underline'
                                        : 'text-black hover:text-opacity-50',
                                      'flex  overflow-hidden items-center decoration-1 underline-offset-4',
                                    )}
                                    key={id}
                                    onClick={() =>
                                      onListboxOptionClick(option.name, value)
                                    }
                                  >
                                    {swatch}
                                    <span className="px-[1em]">
                                      {value}
                                    </span>
                                  </Listbox.Option>
                                );
                            }
                          },
                        )}

                        {/* {options.map((option, optionIdx) => (
                        <Listbox.Option
                          key={optionIdx}
                          className={({active}) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-900'
                            }`
                          }
                          value={option}
                        >
                          {({selected}) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {option.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  Check
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))} */}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>
          );
        }}
      </VariantSelector>
    </>
  );

  // return (
  //   <div className="grid gap-4 py-8">
  //     {/* Each option will show a label and option value <Links> */}
  //     <VariantSelector
  //       handle={product.handle}
  //       options={options}
  //       variants={variants}
  //     >
  //       {({option}) => {
  //         // Check if current product has a valid custom option type.
  //         // If so, render a custom option component.
  //         const customProductOption = customProductOptions?.find(
  //           (customOption) => customOption.title === option.name,
  //         );

  //         return (
  //           <div>
  //             <legend className="mb-2  ">{option.name}</legend>
  //             <div className="flex flex-wrap items-center gap-1">
  //               {option.values.map(({value, to, isActive, isAvailable}) => {
  //                 const id = `option-${option.name}-${value}`;

  //                 switch (customProductOption?._type) {
  //                   case 'customProductOption.color': {
  //                     const foundCustomOptionValue =
  //                       customProductOption.colors.find(
  //                         (color) => color.title === value,
  //                       );

  //                     return (
  //                       <Tippy
  //                         placement="top"
  //                         render={() => {
  //                           if (!foundCustomOptionValue) {
  //                             return null;
  //                           }
  //                           return (
  //                             <Tooltip label={foundCustomOptionValue.title} />
  //                           );
  //                         }}
  //                         key={id}
  //                       >
  //                         <ColorButton
  //                           to={to}
  //                           isSelected={isActive}
  //                           isAvailable={isAvailable}
  //                           hex={foundCustomOptionValue?.hex || '#fff'}
  //                         />
  //                       </Tippy>
  //                     );
  //                   }
  //                   case 'customProductOption.size': {
  //                     const foundCustomOptionValue =
  //                       customProductOption.sizes.find(
  //                         (size) => size.title === value,
  //                       );

  //                     return (
  //                       <Tippy
  //                         placement="top"
  //                         render={() => {
  //                           if (!foundCustomOptionValue) {
  //                             return null;
  //                           }
  //                           return (
  //                             <Tooltip
  //                               label={`${foundCustomOptionValue.width}cm x ${foundCustomOptionValue.height}cm`}
  //                             />
  //                           );
  //                         }}
  //                         key={id}
  //                       >
  //                         <OptionButton
  //                           to={to}
  //                           isSelected={isActive}
  //                           isAvailable={isAvailable}
  //                         >
  //                           {value}
  //                         </OptionButton>
  //                       </Tippy>
  //                     );
  //                   }
  //                   default:
  //                     return (
  //                       <OptionButton
  //                         to={to}
  //                         isSelected={isActive}
  //                         key={id}
  //                         isAvailable={isAvailable}
  //                       >
  //                         {value}
  //                       </OptionButton>
  //                     );
  //                 }
  //               })}
  //             </div>
  //           </div>
  //         );
  //       }}
  //     </VariantSelector>
  //   </div>
  // );
}

// const OptionButton = forwardRef<
//   HTMLAnchorElement,
//   {
//     to: string;
//     isSelected: boolean;
//     isAvailable: boolean;
//     children: React.ReactNode;
//   }
// >((props, ref) => {
//   const {to, isSelected, children, isAvailable} = props;

//   const onOptionClick = (event: React.MouseEvent) => {};

//   return (
//     <div
//       ref={ref}
//       // to={to}
//       // preventScrollReset
//       // replace
//       onClick={onOptionClick}
//       // prefetch="intent"
//       className={clsx([
//         'block cursor-pointer py-2 leading-none  hover:underline hover:decoration-1 hover:underline-offset-1',
//         isSelected ? 'border-black text-black' : 'border-lightGray ',
//         !isAvailable && 'opacity-80',
//       ])}
//     >
//       {children}
//     </div>
//   );
// });

// const ColorButton = forwardRef<
//   HTMLAnchorElement,
//   {to: string; hex: string; isSelected: boolean; isAvailable: boolean}
// >((props, ref) => {
//   const {to, hex, isSelected, isAvailable} = props;

//   return (
//     <Link
//       ref={ref}
//       to={to}
//       preventScrollReset
//       replace
//       prefetch="intent"
//       className={clsx([
//         'flex h-8 w-8 items-center justify-center ',
//         isSelected
//           ? 'border-offBlack'
//           : 'cursor-pointer border-transparent hover:border-black hover:border-opacity-30',
//         !isAvailable && 'opacity-80',
//       ])}
//     >
//       <div
//         className="rounded-full"
//         style={{
//           background: hex,
//           height: 'calc(100% - 4px)',
//           width: 'calc(100% - 4px)',
//         }}
//       ></div>
//     </Link>
//   );
// });
