import clsx from 'clsx';

import Module from '~/components/modules/Module';
import ProductCard from '~/components/product/Card';
import {COLLECTION_GRID, GRID_GAP} from '~/lib/constants';
import type {SanityModule} from '~/lib/sanity';
import type {ProductWithNodes} from '~/types/shopify';
import CollectionSlideshow from './CollectionSlideshow';
import {useState} from 'react';
import {Theme} from '../context/ThemeProvider';
import {Typography} from '../global/Typography';

// Sanity modules to render in full width (across all grid columns)
// const FULL_WIDTH_MODULE_TYPES: SanityModule['_type'][] = [
//   'module.callout',
//   'module.callToAction',
// ];

// Tailwind class map
const CLASSES = {
  flexAlign: {
    center: 'items-center',
    end: 'items-end',
    start: 'items-start',
  },
  flexJustify: {
    center: 'justify-center',
    end: 'justify-end',
    start: 'justify-start',
  },
  imageAspect: {
    landscape: 'aspect-square md:aspect-[16/9]',
    square: 'aspect-square',
  },
  width: {
    sm: 'w-full md:w-[55%]',
    md: 'w-full md:w-[65%]',
    lg: 'w-full md:w-full',
  },
};

// Layout rules for grid children.
// Each child iterates (and loops) through this array of rules.
// These layout rules only apply to both product modules and non-module products.
const PRODUCT_LAYOUT = [
  {
    aspect: 'square',
    flex: {align: 'start', justify: 'start'},
    offsetY: false,
    width: 'md',
  },
  {
    aspect: 'square',
    flex: {align: 'start', justify: 'end'},
    offsetY: false,
    width: 'lg',
  },
  {
    aspect: 'square',
    flex: {align: 'start', justify: 'start'},
    offsetY: false,
    width: 'lg',
  },
  {
    aspect: 'square',
    flex: {align: 'center', justify: 'start'},
    offsetY: false,
    width: 'sm',
  },
  {
    aspect: 'square',
    flex: {align: 'start', justify: 'end'},
    offsetY: false,
    width: 'md',
  },
  {
    aspect: 'square',
    flex: {align: 'start', justify: 'end'},
    offsetY: true,
    width: 'md',
  },
  {
    aspect: 'square',
    flex: {align: 'start', justify: 'start'},
    offsetY: false,
    width: 'lg',
  },
  {
    aspect: 'landscape',
    flex: {align: 'center', justify: 'end'},
    offsetY: false,
    width: 'lg',
  },
] as const;

type Props = {
  items: (SanityModule | ProductWithNodes)[];
  showCount?: boolean;
  stagger?: boolean;
  className?: string;
  showIndex?: boolean;
  title?: string;
  outboundLink?: string;
  outboundLinkText?: string;
  theme?: Theme.DARK | Theme.LIGHT;
  children?: React.ReactNode;
};

export default function CollectionGrid({
  items,
  showCount,
  stagger,
  className = `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`,
  showIndex = 'false',
  title = '',
  outboundLink = '',
  outboundLinkText = '',
  theme = Theme.LIGHT,
  children,
}: Props) {
  const [zoom, setZoom] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onClick = () => {
    setZoom(true);
  };
  return (
    <>
      <ul className={clsx(className, GRID_GAP)}>
        {items.map((item, index) => {
          const productLayout = PRODUCT_LAYOUT[index % PRODUCT_LAYOUT.length];
          const productImageAspect = CLASSES.imageAspect[productLayout.aspect];
          // const productWidth = CLASSES.width[productLayout.width];
          // const productLayoutClasses = clsx([
          //   CLASSES.flexAlign[productLayout.flex.align],
          //   CLASSES.flexJustify[productLayout.flex.justify],
          //   productLayout.offsetY ? 'md:mt-[5vw]' : 'mt-0',
          // ]);

          if (isModule(item)) {
            const isProductModule = item._type === 'module.product';

            // Render modules
            return (
              <li
                key={item._key}
                className={clsx(stagger && 'opacity-0', ' cursor-pointer collection-grid-item group')}
                onClick={() => {
                  setSelectedIndex(index);
                  onClick();
                }}
              >
                <div className='h-full flex flex-col'>
                  <Module
                    imageAspectClassName={productImageAspect}
                    module={item}
                  />
                  {showCount && (
                    <div className='mt-auto'>
                    <Typography type="body" size="sm">
                      <div className="mb-2 mt-1 text-center group-hover:opacity-50  ">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </Typography>
                    </div>
                  )}
                </div>
              </li>
            );
          } else {
            // Render product cards
            return (
              <li key={item.id} className={clsx(stagger && 'opacity-0')}>
                <div>
                  <ProductCard
                    imageAspectClassName={productImageAspect}
                    storefrontProduct={item}
                  />
                </div>
              </li>
            );
          }
        })}
      </ul>

        <CollectionSlideshow
          modules={items}
          zoom={zoom}
          setZoom={setZoom}
          index={selectedIndex}
          setIndex={setSelectedIndex}
          detached
          showIndex={showIndex}
          title={title}
          outboundLink={outboundLink}
          outboundLinkText={outboundLinkText}
          mode={theme}
        />

    </>
  );
}

const isModule = (
  item: SanityModule | ProductWithNodes,
): item is SanityModule => {
  return (item as SanityModule)._type?.startsWith('module');
};
