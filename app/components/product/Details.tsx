import {ShopifyAnalyticsPayload} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import ProductGallery from '~/components/product/Gallery';
import ProductWidget from '~/components/product/Widget';
import {COLLECTION_GRID, GRID_GAP, HEADER_TOP} from '~/lib/constants';
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
  sizeGuide: any;
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
  sizeGuide,
  setSelectedIndex,
  sizeChartVisible,
  setSizeChartVisible,
}: Props) {
  return (
    <>
      <div
        className={clsx(
          'flex flex-col-reverse md:grid',
          COLLECTION_GRID,
          GRID_GAP,
        )}
      >
        {/* Widget (desktop) */}
        <div
          className={clsx(
            'self-start md:sticky md:col-span-2 md:pr-[2em]',
            HEADER_TOP,
          )}
        >
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
        <div className="relative md:col-span-6 2xl:col-span-8">
          {sizeChartVisible && (
            <SizeChart
              setSizeChartVisible={setSizeChartVisible}
              frenchCm={sizeGuide.frenchCm}
              frenchIn={sizeGuide.frenchIn}
              international={sizeGuide.international}
            />
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

        
      </div>
    </>
  );
}
