'use client';
import {Image} from '@shopify/hydrogen';
import type {ProductVariant} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';

import {GRID_GAP, PRODUCT_IMAGE_RATIO} from '~/lib/constants';
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
  imageAspectClassName = 'aspect-[1556/1944]',
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
    // setSelectedIndex(index);
    setZoom(true);
  };

  return (
    <>
      <div className="group relative">
        <div className={clsx('relative grid grid-cols-3 md:grid-cols-12', GRID_GAP)}>
          {storefrontProduct?.images?.nodes?.map((image, index) => (
            <button
              type="button"
              onClick={() => onClick(index)}
              className="flex-grow-0 cursor-pointer"
              key={image._key}
            >
              <Image
                key={image.id}
                className={clsx(' flex-grow-0', PRODUCT_IMAGE_RATIO)}
                data={image}
                crop="center"
                sizes="100%"
              />
            </button>
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
