import clsx from 'clsx';

import Module from '~/components/modules/Module';
import ProductCard from '~/components/product/Card';
import {COLLECTION_GRID, COLLECTION_GRID_GAP, GRID_GAP} from '~/lib/constants';
import type {SanityModule} from '~/lib/sanity';
import type {ProductWithNodes} from '~/types/shopify';
import ModuleSlideshow from './ModuleSlideshow';
import {useState} from 'react';
import {Theme} from '../context/ThemeProvider';
import {Typography} from '../global/Typography';

// Sanity modules to render in full width (across all grid columns)
const FULL_WIDTH_MODULE_TYPES: SanityModule['_type'][] = [
  'module.callout',
  'module.callToAction',
];

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
};

export default function ModuleGrid({
  items,
  showCount,
  stagger,
  className = `grid ${COLLECTION_GRID}`,
}: Props) {
  const [zoom, setZoom] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onClick = () => {
    setZoom(true);
  };
  return (
    <>
      <ul className={clsx(className, COLLECTION_GRID_GAP)}>
        {items.map((item, index) => {
          const productLayout = PRODUCT_LAYOUT[index % PRODUCT_LAYOUT.length];
          const productImageAspect = CLASSES.imageAspect[productLayout.aspect];

          // Render product cards
          return (
            <li key={item.id} className={clsx(stagger && 'opacity-0', 'col-span-1 md:col-span-2')}>
              <div>
                <ProductCard
                  imageAspectClassName={productImageAspect}
                  storefrontProduct={item}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

const isModule = (
  item: SanityModule | ProductWithNodes,
): item is SanityModule => {
  return (item as SanityModule)._type?.startsWith('module');
};
