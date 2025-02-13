import { MediaFile } from '@shopify/hydrogen';
import {
  MediaImage,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

// import CircleButton from '~/components/elements/CircleButton';
// import { ArrowRightIcon } from '~/components/icons/ArrowRight';
import { GRID_GAP, STAGGER_SPEED } from '~/lib/constants';
import type { ProductWithNodes } from '~/types/shopify';
import clsx from 'clsx';
import { stagger, useAnimate } from 'framer-motion';
import { useLocation } from '@remix-run/react';
import {motion} from 'framer-motion'

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */


type Props = {
  storefrontProduct: ProductWithNodes;
  selectedVariant?: ProductVariant;
  zoom: boolean;
  setZoom: (zoom: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  sizeChartVisible: boolean;
};

export default function ProductGallery({
  storefrontProduct,
  selectedVariant,
  zoom,
  setZoom,
  selectedIndex,
  setSelectedIndex,
  sizeChartVisible,
}: Props) {
  const media = storefrontProduct?.media?.nodes;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: media && media.length > 1,
    loop: true,
    skipSnaps: true,
    speed: 7,
  });

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      if (window.innerWidth < 768) setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi, setSelectedIndex]);

  const [pendingImages, setPendingImages] = useState<Set<number>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [nextIndex, setNextIndex] = useState(0);

  const handleImageLoad = (index: number) => {
    setPendingImages((prev) => new Set(prev).add(index));
  };

  useEffect(() => {
    if (pendingImages.has(nextIndex)) {
      setLoadedImages((prev) => new Set(prev).add(nextIndex));
      setNextIndex((prev) => prev + 1);
    }
  }, [pendingImages, nextIndex]);

  if (!media?.length) return null;

  const onMediaClick = (index: number) => {
    setZoom(true);
    setSelectedIndex(index);
  };

  useEffect(()=>{
    return() => {
      setLoadedImages(new Set())
    }
  }, [])

  return (
    <>
      {/* Mobile Slideshow */}
      <div className="-mx-mobile md:hidden">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {media?.slice(1).map((med) => {
              const data = {
                ...med,
                __typename: 'MediaImage',
                image: {
                  ...med.image,
                  altText: med.alt || 'Product image',
                },
              } as MediaImage;

              return (
                <MediaFile
                  key={med.id}
                  className="relative flex w-full shrink-0 grow-0 select-none object-cover px-mobile"
                  data={data}
                  draggable={false}
                  tabIndex={0}
                  mediaOptions={{
                    image: { crop: 'center', sizes: '100vw', loading: 'eager' },
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="pt-4 text-center">
          {selectedIndex + 1}/{media!.length - 1}
        </div>
      </div>

      {/* Desktop Gallery */}
      <ul
        className={clsx(
          'hidden md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4',
          sizeChartVisible && 'opacity-0',
          GRID_GAP
        )}
      >
        {media.slice(0, 1).concat(media.slice(2)).map((med, index) => {
          const data = {
            ...med,
            __typename: 'MediaImage',
            image: {
              ...med.image,
              altText: med.alt || 'Product image',
            },
          } as MediaImage;

          return (
            <motion.li
              key={med.id}
              className={clsx(
                'aspect-[1556/1944] ',
              
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: loadedImages.has(index) ? 1 : 0}}
              transition={{ duration: 0, delay: index * 0.1 }}
            >
              <MediaFile
                className="relative flex w-full shrink-0 grow-0 cursor-zoom-in select-none object-cover"
                data={data}
                onClick={() => onMediaClick(index)}
                draggable={false}
                tabIndex={0}
                onLoad={() => handleImageLoad(index)}
                mediaOptions={{
                  image: { crop: 'center', sizes: '25vw, 100vw', loading: 'eager' },
                }}
              />
            </motion.li>
          );
        })}
      </ul>
    </>
  );
}
