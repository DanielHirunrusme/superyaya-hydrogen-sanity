import {Money, ShopifyAnalyticsPayload} from '@shopify/hydrogen';
import {Product, ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import {convertSchemaToHtml} from '@thebeyondgroup/shopify-rich-text-renderer';
import ProductForm from '~/components/product/Form';
import type {SanityProductPage} from '~/lib/sanity';
import {Disclosure} from '@headlessui/react';

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
        <span className="mr-3  line-through decoration-red">
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

  return (
    <div>
      {/* Sold out */}
      {!availableForSale && (
        <div className="mb-3 text-xs  uppercase ">Sold out</div>
      )}

      {/* Sale */}
      {availableForSale && selectedVariant?.compareAtPrice && (
        <div className="mb-3 text-xs  uppercase text-red">Sale</div>
      )}

      {/* Title */}
      {storefrontProduct?.title && (
        <h1 className="">{storefrontProduct.title}</h1>
      )}

      {/* Prices */}
      <ProductPrices
        storefrontProduct={storefrontProduct}
        selectedVariant={selectedVariant}
      />

      <br />
      {/* Description */}
      {storefrontProduct?.descriptionHtml && (
        <div
          dangerouslySetInnerHTML={{__html: storefrontProduct.descriptionHtml}}
        />
      )}

      {/* Vendor */}
      {/* {storefrontProduct?.vendor && (
        <div className="mt-1 text-md ">
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

      {/* Details */}
      {storefrontProduct.details || storefrontProduct.sizeGuide && (
      <div className="my-8">
        {storefrontProduct.details && (
          <Disclosure>
            {({ open }) => (
              <>
            <Disclosure.Button className="flex gap-4">
              <span className='w-3'>{!open ? '+' : <>&ndash;</>}</span>Product Details
            </Disclosure.Button>
            <Disclosure.Panel>
              <div
                dangerouslySetInnerHTML={{
                  __html: convertSchemaToHtml(storefrontProduct.details.value),
                }}
              />
            </Disclosure.Panel>
            </>
            )}
          </Disclosure>
        )}
        {storefrontProduct.sizeGuide && (
          <Disclosure>
            {({ open }) => (
              <>
            <Disclosure.Button className="flex gap-4">
            <span className='w-3'>{!open ? '+' : '&mdash;'}</span>Size-guide
            </Disclosure.Button>
            <Disclosure.Panel>
              <div
                dangerouslySetInnerHTML={{
                  __html: convertSchemaToHtml(
                    storefrontProduct.sizeGuide.value,
                  ),
                }}
              />
            </Disclosure.Panel>
            </>
            )}
          </Disclosure>
        )}
      </div>
      )}
    </div>
  );
}