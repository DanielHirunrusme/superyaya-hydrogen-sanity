import { Image, Money, type ShopifyAnalyticsProduct } from '@shopify/hydrogen';
import type { ProductVariant } from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import Badge from '~/components/elements/Badge';
import { Link } from '~/components/Link';
import AddToCartButton from '~/components/product/buttons/AddToCartButton';
import { PRODUCT_IMAGE_RATIO } from '~/lib/constants';
import {
  getProductOptionString,
  hasMultipleProductOptions,
  useGid,
} from '~/lib/utils';
import type { ProductWithNodes } from '~/types/shopify';
import { Typography } from '../global/Typography';
import type {SanityModule} from '~/lib/sanity';

type Props = {
  imageAspectClassName?: string;
  storefrontProduct: (SanityModule | ProductWithNodes);
  variantGid?: string;
  index?: number;
  onImageLoad?: () => void;  // New prop to signal when an image has loaded
};

export default function ProductCard({
  imageAspectClassName = 'aspect-[1556/1944]',
  storefrontProduct,
  variantGid,
  index = 5,
  onImageLoad
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


  return (
    <Link to={`/products/${storefrontProduct.handle}`} className="group relative">
      <Typography type="body" size="sm">
        {/** Prefer eager loading for early cards to improve perceived speed */}
        {/** Treat first 6 cards as priority; tweak as needed */}
        {/** Using fetchPriority hints modern browsers to schedule earlier */}
        
        <div

          className={clsx(
            PRODUCT_IMAGE_RATIO,
            'relative flex items-center justify-center overflow-hidden bg-lightGray object-cover  duration-500 ease-out',
          )}
        >
          {/* Hover image */}
          <div
            className="group absolute left-0 top-0 h-full w-full"


          >
            {/* First image */}
            {firstVariant.image && (
              <Image
                className="absolute opacity-0 md:group-hover:opacity-100 z-10 h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
                data={firstVariant.image}
                crop="center"
                sizes="(min-width: 768px) 25vw, 100vw"
                loading={index < 6 ? 'eager' : 'lazy'}
                // @ts-expect-error Hydrogen Image forwards props to underlying <img>
                fetchPriority={index < 6 ? 'high' : 'auto'}
                onLoad={onImageLoad} // Call when loaded
              />
            )}


            {/* Second image */}
            {/* @ts-ignore */}
            {storefrontProduct.media?.nodes?.[1]?.image && (
              <Image
                className="absolute  h-full w-full transform bg-cover bg-center object-cover object-center ease-in-out"
                data={storefrontProduct.media.nodes[1].image}
                crop="center"
                sizes="(min-width: 768px) 25vw, 100vw"
                onLoad={onImageLoad} // Call when loaded
                loading="lazy"
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
          </div>

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

        <div className="mt-2 ">
          <div className="space-y-1 truncate flex">
            {/* Title */}
            <div
              className={clsx(
                'group-hover:opacity-50 group-active:opacity-50', //
                '',
              )}

            >
              {storefrontProduct.title}
              <div className="flex">
                {firstVariant.compareAtPrice && (
                  <span className="">
                    <Money
                      data={firstVariant.compareAtPrice}
                      className="mr-2.5 line-through decoration-red"
                      withoutTrailingZeros
                    />
                  </span>
                )}
                {firstVariant.price && <Money data={firstVariant.price} withoutTrailingZeros />}
              </div>
            </div>

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

        </div>
      </Typography>
    </Link>
  );
}
