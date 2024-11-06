import {Image, Money, type ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import Badge from '~/components/elements/Badge';
import {Link} from '~/components/Link';
import AddToCartButton from '~/components/product/buttons/AddToCartButton';
import {PRODUCT_IMAGE_RATIO} from '~/lib/constants';
import {
  getProductOptionString,
  hasMultipleProductOptions,
  useGid,
} from '~/lib/utils';
import type {ProductWithNodes} from '~/types/shopify';
import {Typography} from '../global/Typography';

type Props = {
  imageAspectClassName?: string;
  storefrontProduct: ProductWithNodes;
  variantGid?: string;
};

export default function ProductCard({
  imageAspectClassName = 'aspect-[1556/1944]',
  storefrontProduct,
  variantGid,
}: Props) {
  const firstVariant =
    useGid<ProductVariant>(variantGid) ??
    storefrontProduct.variants.nodes.find(
      (variant) => variant.id == variantGid,
    ) ??
    storefrontProduct.variants.nodes[0];

  if (firstVariant == null) {
    return null;
  }

  const multipleProductOptions = hasMultipleProductOptions(
    storefrontProduct.options,
  );
  const productOptions = getProductOptionString(storefrontProduct.options);

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: storefrontProduct.id ? storefrontProduct.id : '',
    variantGid: firstVariant.id,
    name: storefrontProduct.title ? storefrontProduct.title : '',
    variantName: firstVariant.title,
    brand: storefrontProduct.vendor ? storefrontProduct.vendor : '',
    price: firstVariant.price.amount,
    quantity: 1,
  };

  console.log('firstVariant', firstVariant);

  {
    /*
    {
    "id": "gid://shopify/ImageSource/39779858415919",
    "url": "https://cdn.shopify.com/s/files/1/0831/2474/8591/files/240521000034660019.jpg?v=1728060825",
    "altText": null,
    "width": 1369,
    "height": 1711
}
    */
  }

  return (
    <div className="group relative">
      <Typography type="body" size="sm">
        <div
          className={clsx(
            PRODUCT_IMAGE_RATIO,
            'relative flex items-center justify-center overflow-hidden bg-lightGray object-cover  duration-500 ease-out',
          )}
        >
          <Link
            className="group absolute left-0 top-0 h-full w-full"
            to={`/products/${storefrontProduct.handle}`}
          >
            {/* First image */}
            {firstVariant.image && (
              <Image
                className="absolute opacity-0 md:group-hover:opacity-100 z-10 h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
                data={firstVariant.image}
                crop="center"
                sizes="100%"
              />
            )}

            {/* Second image */}
            {/* @ts-ignore */}
            {storefrontProduct.media?.nodes?.[1]?.image && (
              <Image
                className="absolute  h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
                data={storefrontProduct.media.nodes[1].image}
                crop="center"
                sizes="100%"
              />
            )}

            {/* Badges */}
            <div className="absolute left-4 top-4">
              {/* Sale */}
              {firstVariant?.availableForSale &&
                firstVariant?.compareAtPrice && (
                  <Badge label="Sale" tone="critical" />
                )}
              {/* Sold out */}
              {!firstVariant?.availableForSale && <Badge label="Sold out" />}
            </div>
          </Link>

          {/* Quick add to cart */}
          {/* {firstVariant.availableForSale && (
          <div
            className={clsx(
              'absolute bottom-0 right-4 translate-y-full pb-4 duration-200 ease-in-out',
              'group-hover:block group-hover:translate-y-0',
            )}
          >
            <AddToCartButton
              lines={[
                {
                  merchandiseId: firstVariant.id,
                  quantity: 1,
                },
              ]}
              disabled={!firstVariant.availableForSale}
              analytics={{
                products: [productAnalytics],
                totalValue: parseFloat(productAnalytics.price),
              }}
            >
              Quick add
            </AddToCartButton>
          </div>
        )} */}
        </div>

        <div className="mt-2 group-hover:opacity-50 group-active:opacity-50">
          <div className="space-y-1 truncate">
            {/* Title */}
            <Link
              className={clsx(
                '', //
                '',
              )}
              to={`/products/${storefrontProduct.handle}`}
            >
              {storefrontProduct.title}
            </Link>

            {/* Vendor */}
            {/* {storefrontProduct.vendor && (
            <div className="">{storefrontProduct.vendor}</div>
          )} */}

            {/* Product options */}
            {/* {multipleProductOptions && (
            <div className="">{productOptions}</div>
          )} */}
          </div>

          {/* Price / compare at price */}
          <div className="flex">
            {firstVariant.compareAtPrice && (
              <span className="">
                <Money
                  data={firstVariant.compareAtPrice}
                  className="mr-2.5 line-through decoration-red"
                />
              </span>
            )}
            {firstVariant.price && <Money data={firstVariant.price} />}
          </div>
        </div>
      </Typography>
    </div>
  );
}
