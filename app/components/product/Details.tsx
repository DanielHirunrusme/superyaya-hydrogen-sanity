import { ShopifyAnalyticsPayload } from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import ProductGallery from '~/components/product/Gallery';
import ProductWidget from '~/components/product/Widget';
import { GRID_GAP } from '~/lib/constants';
import type { SanityProductPage } from '~/lib/sanity';

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  storefrontVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
};

export default function ProductDetails({
  sanityProduct,
  storefrontProduct,
  storefrontVariants,
  selectedVariant,
  analytics,
}: Props) {
  return (
    <div className={clsx('grid grid-cols-8', GRID_GAP)}>

       {/* Widget (desktop) */}
       <div className='col-span-2'>
          <div>
            <ProductWidget
              sanityProduct={sanityProduct}
              storefrontProduct={storefrontProduct}
              storefrontVariants={storefrontVariants}
              selectedVariant={selectedVariant}
              analytics={analytics}
            />
          </div>
      </div>

      {/* Gallery */}
      <div className='col-span-6'>
      <ProductGallery
        storefrontProduct={storefrontProduct}
        selectedVariant={selectedVariant}
      />
      </div>

      {/* Widget (mobile) */}
      {/* <div className="mb-8 lg:hidden">
        <ProductWidget
          sanityProduct={sanityProduct}
          storefrontProduct={storefrontProduct}
          storefrontVariants={storefrontVariants}
          selectedVariant={selectedVariant}
          analytics={analytics}
        />
      </div> */}

     
    </div>
  );
}
