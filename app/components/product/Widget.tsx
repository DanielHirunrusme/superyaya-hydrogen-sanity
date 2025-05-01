import {Money, ShopifyAnalyticsPayload} from '@shopify/hydrogen';
import {Product, ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import {convertSchemaToHtml} from '@thebeyondgroup/shopify-rich-text-renderer';
import ProductForm from '~/components/product/Form';
import type {SanityProductPage} from '~/lib/sanity';
import {Disclosure} from '@headlessui/react';
import {Typography} from '../global/Typography';
import { RichText } from '../global/RichText';

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  storefrontVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  analytics: ShopifyAnalyticsPayload;
  sizeChartVisible: boolean;
  setSizeChartVisible: (visible: boolean) => void;
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
  sizeChartVisible,
  setSizeChartVisible,
}: Props) {
  const availableForSale = selectedVariant?.availableForSale;

  if (!selectedVariant) {
    return null;
  }

  const onSizeGuideClick = () => {
    setSizeChartVisible(!sizeChartVisible);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };




  return (
    <div>
      {/* Sold out */}
      {!availableForSale && <div className="mb-3   uppercase ">Sold out</div>}
      {/* Sale */}
      {availableForSale && selectedVariant?.compareAtPrice && (
        <div className="mb-3   uppercase text-red">Sale</div>
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
        className='product-rte'
          dangerouslySetInnerHTML={{__html: storefrontProduct.descriptionHtml}}
        />
      )}

      {/* Product options */}
      <ProductForm
        product={storefrontProduct}
        variants={storefrontVariants}
        selectedVariant={selectedVariant}
        analytics={analytics}
        customProductOptions={sanityProduct.customProductOptions}
      />

      <div className="mt-mobile md:mt-tablet xl:mt-laptop 2xl:mt-desktop">

        {/* Washing Instructions */}
        {storefrontProduct.washing_instructions && (
          <div>

              <Disclosure>
                {({open}) => (
                  <>
                    <Disclosure.Button className="flex gap-[.5em] hover:opacity-50">
                      <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
                     Washing Instructions
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className="mb-4">
                        <RichText data={storefrontProduct.washing_instructions.value} />
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>

          </div>
        )}


        {/* Details */}
        {storefrontProduct.details && (
          <div>
            {storefrontProduct.details && (
              <Disclosure>
                {({open}) => (
                  <>
                    <Disclosure.Button className="flex gap-[.5em] hover:opacity-50">
                      <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
                      Product Details
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className="mb-4">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: convertSchemaToHtml(
                              storefrontProduct.details.value,
                            ),
                          }}
                        />
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )}
          </div>
        )}

        {/* Size Guide */}
        <button onClick={onSizeGuideClick} className="flex gap-[.5em] hover:opacity-50">
          <span className="w-3">{!sizeChartVisible ? '+' : <>&ndash;</>}</span>
          Size Guide
        </button>
      </div>
    </div>
  );
}
