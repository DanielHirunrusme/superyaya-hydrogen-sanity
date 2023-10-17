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
import type { SanityCustomProductOption } from '~/lib/sanity';
import { hasMultipleProductOptions } from '~/lib/utils';
import Button from '../elements/Button';
import ContactFormModal from '../contact/ContactFormModal';

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

  invariant(
    analytics?.products?.[0],
    'Missing product analytics data for product page',
  );

  const productAnalytics: ShopifyAnalyticsProduct = {
    ...analytics.products[0],
    quantity: 1,
  };

  if(!isCustomPricing){
  return (
    <div className='max-w-sm'>
      {multipleProductOptions && (
        <>
          <ProductOptions
            product={product}
            variants={variants}
            options={product.options}
            selectedVariant={selectedVariant}
            customProductOptions={customProductOptions}
          />
        </>
      )}

      <div className="flex flex-col space-y-2">
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
        />
        {/* <BuyNowButton
          lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
          disabled={isOutOfStock}
          mode='outline'
        /> */}
      </div>
    </div>
  )
      } else {
        return <div className='max-w-sm my-8'><ContactFormModal label="Custom Requests" /></div>
      }
}
