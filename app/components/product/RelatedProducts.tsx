import clsx from 'clsx';

import ProductCard from '~/components/product/Card';
import { GRID_GAP } from '~/lib/constants';
import {useColorTheme} from '~/lib/theme';
import type {ProductWithNodes} from '~/types/shopify';

type Props = {
  relatedProducts: ProductWithNodes[];
};

export default function RelatedProducts({relatedProducts}: Props) {
  const colorTheme = useColorTheme();
  const products = relatedProducts && relatedProducts?.slice(0, 4);

  return (
    <div
    className={clsx('mt-28 flex flex-col md:grid grid-cols-8', GRID_GAP)}
      style={{background: colorTheme?.background || 'white'}}
    >
      <div className='col-span-2'><h3
        
        >
          Related
        </h3></div>
      
      <div
        className={clsx('col-span-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6', GRID_GAP)}
      >
        {products.map((product) => (
          <ProductCard key={product.id} storefrontProduct={product} />
        ))}
      </div>
    </div>
  );
}
