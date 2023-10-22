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
import SizeChart from './SizeChart';

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
  sizeChartVisible: boolean;
  setSizeChartVisible: (visible: boolean) => void;
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
  sizeChartVisible,
  setSizeChartVisible,
}: Props) {
  return (
    <>
      <div
        className={clsx('flex grid-cols-8 flex-col-reverse md:grid', GRID_GAP)}
      >
        {/* Widget (desktop) */}
        <div className="self-start md:sticky md:top-2 md:col-span-2">
          <ProductWidget
            sanityProduct={sanityProduct}
            storefrontProduct={storefrontProduct}
            storefrontVariants={storefrontVariants}
            selectedVariant={selectedVariant}
            analytics={analytics}
            sizeChartVisible={sizeChartVisible}
            setSizeChartVisible={setSizeChartVisible}
          />
        </div>

        {/* Gallery */}
        <div className="relative md:col-span-6">
          {sizeChartVisible && (
            <SizeChart setSizeChartVisible={setSizeChartVisible} sizeChart={sanityProduct.sizeChart} />
          )}
          <ProductGallery
            storefrontProduct={storefrontProduct}
            selectedVariant={selectedVariant}
            zoom={zoom}
            setZoom={setZoom}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            sizeChartVisible={sizeChartVisible}
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
    </>
  );
}
