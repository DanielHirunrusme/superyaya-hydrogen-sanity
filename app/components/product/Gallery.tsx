import {MediaFile} from '@shopify/hydrogen';
import {
  MediaImage,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';

// import CircleButton from '~/components/elements/CircleButton';
// import { ArrowRightIcon } from '~/components/icons/ArrowRight';
import {GRID_GAP, STAGGER_SPEED} from '~/lib/constants';
import type {ProductWithNodes} from '~/types/shopify';
import clsx from 'clsx';
import {stagger, useAnimate} from 'framer-motion';
import {useLocation} from '@remix-run/react';

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
  const [scope, animate] = useAnimate();
  const location = useLocation();
  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };

  const media = storefrontProduct?.media?.nodes;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: media && media.length > 1,
    loop: true,
    skipSnaps: true,
    speed: 7,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    if(window.innerWidth < 768) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex, selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);
  useEffect(() => {
    if (!sizeChartVisible)
      animate(
        'li',
        {opacity: 1},
        {delay: stagger(STAGGER_SPEED), duration: 0.01},
      );
  }, [sizeChartVisible, location]);

  const onEmblaClick = (e) => {
    if (e.clientX > window.innerWidth / 3) {
      handleNext();
    } else {
      handlePrevious();
    }
  };

  const handleNext = () => {
    if (emblaApi) {
      // emblaApi.scrollNext();
    }
  };

  const handlePrevious = () => {
    if (emblaApi) {
      // emblaApi.scrollPrev();
    }
  };

  useEffect(() => {
    if (!selectedVariant) {
      return;
    }

    const variantImageUrl = selectedVariant?.image?.url?.split('?')[0];
    const galleryIndex =
      media?.findIndex((mediaItem) => {
        if (mediaItem.mediaContentType === 'IMAGE') {
          return (
            (mediaItem as MediaImage)?.image?.url.split('?')[0] ===
            variantImageUrl
          );
        }
        return false;
      }) ?? -1;

    if (emblaApi && galleryIndex >= 0) {
      emblaApi.scrollTo(galleryIndex, true); // instantly scroll
    }
  }, [emblaApi, media, selectedVariant]);

  if (!media?.length) {
    return null;
  }

  const onMediaClick = (index: number) => {


    setZoom(true);
    setSelectedIndex(index);
  };

  return (
    <>
      {/* Mobile slideshow */}
      <div className="-mx-mobile md:hidden">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {/* Slides */}
            {media.slice(1, media.length).map((med) => {
              let extraProps: Record<string, any> = {};

              if (med.mediaContentType === 'MODEL_3D') {
                extraProps = {
                  interactionPromptThreshold: '0',
                  ar: true,
                  loading: 'eager',
                  disableZoom: true,
                  style: {height: '100%', margin: '0 auto'},
                };
              }

              const data = {
                ...med,
                __typename:
                  typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
                image: {
                  // @ts-ignore
                  ...med.image,
                  altText: med.alt || 'Product image',
                },
              } as MediaImage;

              return (
                <MediaFile
                  className="relative flex w-full shrink-0 grow-0 select-none object-cover px-mobile"
                  data={data}
                  draggable={false}
                  key={med.id}
                  tabIndex={0}
                  mediaOptions={{
                    image: {crop: 'center', sizes: '100vw', loading: 'eager'},
                  }}
                  {...extraProps}
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
        ref={scope}
        className={clsx(
          'hidden md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4',
          sizeChartVisible && 'opacity-0',
          GRID_GAP,
        )}
      >
        {/* Slides */}
        {media.slice(0, 1).concat(media.slice(2)).map((med, index) => {
          let extraProps: Record<string, any> = {};

          if (med.mediaContentType === 'MODEL_3D') {
            extraProps = {
              interactionPromptThreshold: '0',
              ar: true,
              loading: 'eager',
              disableZoom: true,
              style: {height: '100%', margin: '0 auto'},
            };
          }

          const data = {
            ...med,
            __typename:
              typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
            image: {
              // @ts-ignore
              ...med.image,
              altText: med.alt || 'Product image',
            },
          } as MediaImage;

          return (
            <li data-index={index} key={med.id} className="aspect-[1556/1944] bg-gray opacity-0 ">
              <MediaFile
                className="relative flex w-full shrink-0 grow-0 cursor-zoom-in select-none object-cover"
                data={data}
                draggable={false}
                tabIndex={0}
                onClick={() => onMediaClick(index)}
                mediaOptions={{
                  image: {crop: 'center', sizes: '100vw', loading: 'eager'},
                }}
                {...extraProps}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
