import {ShopifyAnalyticsPayload} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import ProductGallery from '~/components/product/Gallery';
import ProductWidget from '~/components/product/Widget';
import {GRID_GAP} from '~/lib/constants';
import type {SanityProductPage} from '~/lib/sanity';

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  storefrontVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
  zoom: boolean;
  setZoom: (zoom: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};

export default function ProductDetails({
  sanityProduct,
  storefrontProduct,
  storefrontVariants,
  selectedVariant,
  analytics,
  zoom,
  setZoom,
  selectedIndex,
  setSelectedIndex,
}: Props) {
  return (
    <div
      className={clsx('flex grid-cols-8 flex-col-reverse md:grid', GRID_GAP)}
    >
      {/* Widget (desktop) */}
      <div className="md:col-span-2 self-start md:sticky md:top-4">
        <ProductWidget
          sanityProduct={sanityProduct}
          storefrontProduct={storefrontProduct}
          storefrontVariants={storefrontVariants}
          selectedVariant={selectedVariant}
          analytics={analytics}
        />
      </div>

      {/* Gallery */}
      <div className="md:col-span-6">
        <ProductGallery
          storefrontProduct={storefrontProduct}
          selectedVariant={selectedVariant}
          zoom={zoom}
          setZoom={setZoom}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
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
