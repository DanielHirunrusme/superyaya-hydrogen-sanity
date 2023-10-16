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

type Props = {
  imageAspectClassName?: string;
  storefrontProduct: ProductWithNodes;
  variantGid?: string;
};

export default function ProductImages({
  imageAspectClassName = 'aspect-[866/1300]',
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

  console.log(storefrontProduct);

  return (
    <div className="group relative">
      <div
        className={clsx(
          'relative flex gap-2 justify-between',
        )}
      >
        {storefrontProduct?.images?.nodes?.map((image) => (
            <div className='w-[70px] flex-grow-0'>
          <Image
            key={image.id}
            className={clsx(' flex-grow-0', PRODUCT_IMAGE_RATIO)}
            data={image}
            crop="center"
            sizes="100%"
          />
          </div>
        ))}
      </div>
    </div>
  );
}
