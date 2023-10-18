'use client';
import {Image} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import {PRODUCT_IMAGE_RATIO} from '~/lib/constants';
import {useGid} from '~/lib/utils';
import type {ProductWithNodes} from '~/types/shopify';
import ProductSlideshow from './ProductSlideshow';
import {useState} from 'react';

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
  const [zoom, setZoom] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const firstVariant =
    useGid<ProductVariant>(variantGid) ??
    storefrontProduct.variants.nodes.find(
      (variant) => variant.id == variantGid,
    ) ??
    storefrontProduct.variants.nodes[0];

  if (firstVariant == null) {
    return null;
  }

  const onClick = (index) => {
    setZoom(true);
  };

  return (
    <>
      <div className="group relative">
        <div
          className={clsx(
            'relative grid grid-cols-4 gap-2 md:flex',
          )}
        >
          {storefrontProduct?.images?.nodes?.map((image, index) => (
            <div
              onClick={() => onClick(index)}
              className="flex-grow-0 cursor-pointer md:w-[70px]"
            >
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
      <ProductSlideshow
        storefrontProduct={storefrontProduct}
        zoom={zoom}
        setZoom={setZoom}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </>
  );
}
