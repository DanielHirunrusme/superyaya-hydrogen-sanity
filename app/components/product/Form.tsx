import {
  type ShopifyAnalyticsPayload,
  type ShopifyAnalyticsProduct,
} from '@shopify/hydrogen';
import type {
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import invariant from 'tiny-invariant';

import AddToCartButton from '~/components/product/buttons/AddToCartButton';
import BuyNowButton from '~/components/product/buttons/BuyNowButton';
import ProductOptions from '~/components/product/Options';
import type {SanityCustomProductOption} from '~/lib/sanity';
import {hasMultipleProductOptions} from '~/lib/utils';
import Button from '../elements/Button';
import ContactFormModal from '../contact/ContactForm';
import {Container} from '../global/Container';
import clsx from 'clsx';
import {GRID_GAP} from '~/lib/constants';
import ProductCustomColorOptions from './CustomColorOptions';

export default function ProductForm({
  product,
  variants,
  selectedVariant,
  analytics,
  customProductOptions,
}: {
  product: Product;
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
  customProductOptions?: SanityCustomProductOption[];
}) {
  const isOutOfStock = !selectedVariant?.availableForSale;

  const multipleProductOptions = hasMultipleProductOptions(product.options);
  // @ts-expect-error this is not typed out
  const isCustomPricing = product.inquire;
  // @ts-expect-error this is not typed out
  const isPreorder = product.pre_order;

  invariant(
    analytics?.products?.[0],
    'Missing product analytics data for product page',
  );

  const productAnalytics: ShopifyAnalyticsProduct = {
    ...analytics.products[0],
    quantity: 1,
  };




  return (
    <Container type="pdpForm">
      <div
        className={clsx(
          'mt-mobile flex flex-col md:mt-tablet xl:mt-laptop 2xl:mt-desktop',
          'gap-mobile md:gap-tablet xl:gap-laptop 2xl:gap-desktop',
        )}
      >
        {multipleProductOptions && (
          
            <ProductOptions
              product={product}
              variants={variants}
              options={product.options}
              selectedVariant={selectedVariant}
              customProductOptions={customProductOptions}
            />
          
        )}

        <ProductCustomColorOptions product={product} />

        <div className="flex flex-col">
          <AddToCartButton
            lines={[
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ]}
            disabled={isOutOfStock}
            mode="outline"
            analytics={{
              products: [productAnalytics],
              totalValue: parseFloat(productAnalytics.price),
            }}
            buttonClassName="w-full hover:opacity-50"
          >
            {!isPreorder ? 'Add to Cart' : 'Pre-order'}
          </AddToCartButton>
          {/* <BuyNowButton
          lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
          disabled={isOutOfStock}
          mode='outline'
        /> */}
        </div>
      </div>
    </Container>
  );
}
