import clsx from 'clsx';
import {inView, stagger, useAnimate, useInView} from 'framer-motion';
import {useEffect} from 'react';

import ProductCard from '~/components/product/Card';
import {COLLECTION_GRID, GRID_GAP, STAGGER_SPEED} from '~/lib/constants';
import {useColorTheme} from '~/lib/theme';
import type {ProductWithNodes} from '~/types/shopify';

type Props = {
  relatedProducts: ProductWithNodes[];
};

export default function RelatedProducts({relatedProducts}: Props) {
  const colorTheme = useColorTheme();
  const products = relatedProducts && relatedProducts?.slice(0, 12);
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (!isInView) return;
    animate(
      'li',
      {opacity: 1},
      {delay: stagger(STAGGER_SPEED), duration: 0.01},
    );
  }, [isInView]);

  return (
    <div
      className={clsx(
        'mt-[11em] flex flex-col md:grid',
        COLLECTION_GRID,
        GRID_GAP,
      )}
      style={{background: colorTheme?.background || 'white'}}
    >
      <div className="hidden md:block md:col-span-2"></div>

      <div className="col-span-5 md:col-span-6 2xl:col-span-8">
        <h3>Related</h3>
        <ul
          ref={scope}
          className={clsx('col-span-6 mt-4 grid', COLLECTION_GRID, GRID_GAP)}
        >
          {products.map((product) => (
            <li className="opacity-0" key={product.id}>
              <ProductCard storefrontProduct={product} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
