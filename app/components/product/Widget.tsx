import {Money, ShopifyAnalyticsPayload} from '@shopify/hydrogen';
import {Product, ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import ProductForm from '~/components/product/Form';
import type {SanityProductPage} from '~/lib/sanity';

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  storefrontVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
};

function ProductPrices({
  storefrontProduct,
  selectedVariant,
}: {
  storefrontProduct: Product;
  selectedVariant: ProductVariant;
}) {
  if (!storefrontProduct || !selectedVariant) {
    return null;
  }

  return (
    <div>
      {selectedVariant.compareAtPrice && (
        <span className="mr-3 text-darkGray line-through decoration-red">
          <Money data={selectedVariant.compareAtPrice} />
        </span>
      )}
      {selectedVariant.price && <Money data={selectedVariant.price} />}
    </div>
  );
}

export default function ProductWidget({
  sanityProduct,
  storefrontProduct,
  storefrontVariants,
  selectedVariant,
  analytics,
}: Props) {
  const availableForSale = selectedVariant?.availableForSale;

  if (!selectedVariant) {
    return null;
  }

  console.log('storefrontProduct', storefrontProduct)

  return (
    <div

    >
      {/* Sold out */}
      {!availableForSale && (
        <div className="mb-3 text-xs font-bold uppercase text-darkGray">
          Sold out
        </div>
      )}

      {/* Sale */}
      {availableForSale && selectedVariant?.compareAtPrice && (
        <div className="mb-3 text-xs font-bold uppercase text-red">Sale</div>
      )}

      {/* Title */}
      {storefrontProduct?.title && (
        <h1 className="">
          {storefrontProduct.title}
        </h1>
      )}

      {/* Prices */}
      <ProductPrices
        storefrontProduct={storefrontProduct}
        selectedVariant={selectedVariant}
      />

<br />
      {/* Description */}
      {storefrontProduct?.descriptionHtml && <div dangerouslySetInnerHTML={{__html: storefrontProduct.descriptionHtml }} />}

      {/* Vendor */}
      {/* {storefrontProduct?.vendor && (
        <div className="mt-1 text-md text-darkGray">
          {storefrontProduct.vendor}
        </div>
      )} */}

      {/* Product options */}
      <ProductForm
        product={storefrontProduct}
        variants={storefrontVariants}
        selectedVariant={selectedVariant}
        analytics={analytics}
        customProductOptions={sanityProduct.customProductOptions}
      />
    </div>
  );
}
