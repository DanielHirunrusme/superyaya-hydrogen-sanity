import {MediaFile} from '@shopify/hydrogen';
import {
  MediaImage,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useRef} from 'react';
import type {ProductWithNodes} from '~/types/shopify';
import clsx from 'clsx';
import Button from '../elements/Button';
import MinimalHeader from '../global/MinimalHeader';
import {Typography} from '../global/Typography';
import {
  SITE_MARGINS_X,
  HEADER_TOP,
  SITE_MARGINS_Y,
  SLIDESHOW_WITH_CAPTIONS_MARGINS,
  NAV_GAP_Y,
} from '~/lib/constants';
import {getImageLayout} from '../modules/ModuleSlideshow';

type Props = {
  storefrontProduct: ProductWithNodes;
  selectedVariant?: ProductVariant;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  zoom: boolean;
  setZoom: (zoom: boolean) => void;
};

export default function ProductSlideshow({
  storefrontProduct,
  selectedVariant,
  selectedIndex,
  setSelectedIndex,
  zoom,
  setZoom,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };

  const media = storefrontProduct?.media?.nodes;

  // const [emblaRef, emblaApi] = useEmblaCarousel({
  //   align: 'start',
  //   draggable: media && media.length > 1,
  //   loop: true,
  //   skipSnaps: true,
  //   speed: 100,
  // });

  // const onSelect = useCallback(() => {
  //   if (!emblaApi) return;
  //   setSelectedIndex(emblaApi.selectedScrollSnap());
  // }, [emblaApi, setSelectedIndex, selectedIndex]);

  // useEffect(() => {
  //   if (!emblaApi) return;
  //   onSelect();

  //   emblaApi.on('select', onSelect);
  //   emblaApi.scrollTo(selectedIndex, true);
  // }, [emblaApi, onSelect]);

  // const onEmblaClick = (e) => {
  //   if (e.clientX > window.innerWidth / 3) {
  //     handleNext();
  //   } else {
  //     handlePrevious();
  //   }
  // };

  // const handleNext = () => {
  //   if (emblaApi) {
  //     emblaApi.scrollNext();
  //   }
  // };

  // const handlePrevious = () => {
  //   if (emblaApi) {
  //     emblaApi.scrollPrev();
  //   }
  // };

  // useEffect(() => {
  //   if (emblaApi) {
  //     emblaApi.scrollTo(selectedIndex);
  //   }
  // }, [emblaApi, selectedIndex]);

  // useEffect(() => {
  //   if (!selectedVariant) {
  //     return;
  //   }

  //   const variantImageUrl = selectedVariant?.image?.url?.split('?')[0];
  //   const galleryIndex =
  //     media?.findIndex((mediaItem) => {
  //       if (mediaItem.mediaContentType === 'IMAGE') {
  //         return (
  //           (mediaItem as MediaImage)?.image?.url.split('?')[0] ===
  //           variantImageUrl
  //         );
  //       }
  //       return false;
  //     }) ?? -1;

  //   if (emblaApi && galleryIndex >= 0) {
  //     emblaApi.scrollTo(galleryIndex, true); // instantly scroll
  //   }
  // }, [emblaApi, media, selectedVariant]);

  useEffect(() => {
    if (
      zoom &&
      selectedIndex >= 0 &&
      containerRef.current &&
      mediaRefs.current[selectedIndex]
    ) {
      const container = containerRef.current;
      const targetElement = mediaRefs.current[selectedIndex];

      // Calculate the offset position of the target element within the container
      // const offsetTop = targetElement.getBoundingClientRect().top;

      // Calculate offset by the product image ratio
      const offsetTop = window.innerWidth * (1944 / 1556) * selectedIndex;

      console.log('selectedIndex', selectedIndex);

      // Scroll the container to the calculated position
      container.scrollTo({
        top: offsetTop,
        left: 0,
        behavior: 'auto',
      });
    }
  }, [zoom, selectedIndex]);

  const onClose = () => {
    setZoom(false);
  };

  if (!media?.length) {
    return null;
  }

  return (
    <section
      ref={containerRef} // Ref to the scrolling container
      className={clsx(
        'fixed bottom-0 left-0 right-0 top-0 z-50 h-full w-screen overflow-scroll bg-white text-black',
        !zoom && '!pointer-events-none opacity-0',
      )}

    >
      <Button
        mode="text"
        type="button"
        className={clsx('fixed right-0 z-50', SITE_MARGINS_X, HEADER_TOP)}
        onClick={onClose}
      >
        <Typography size="md" type="body">
          Close
        </Typography>
      </Button>
      {/* Slides */}
      {media.slice(1, media.length).map((med, index) => {
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
          __typename: typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
          image: {
            // @ts-ignore
            ...med.image,
            altText: med.alt || 'Product image',
          },
        } as MediaImage;

        return (
          <div
            ref={(el) => (mediaRefs.current[index] = el)} // Add ref for each media item
            className={clsx('aspect-[1556/1944] w-screen cursor-zoom-out')}
            key={med.id}
            onClick={() => setZoom(false)}
          >
            <div
              className={clsx(
                'relative w-full  flex-1 text-black',
                // ' portrait:w-screen landscape:h-full',
                'relative flex items-center justify-center',
                // getImageLayout(med, true),
                // 'pb-[3.4vw] md:pb-[6vw] xl:pb-[5.5vw] 2xl:pb-[5.203125vw]',
              )}
            >
              <div
                className="relative aspect-[1556/1944] w-screen flex-1"
                // style={{width: '90.7694vw'}}
              >
                <MediaFile
                  className={
                    clsx('absolute h-full w-full select-none object-contain')

                    // 'py-[13vw] md:pb-[6vw] md:pt-[3.25vw] xl:pb-[5.5vw] 2xl:pb-[5.203125vw]', //extend image further up
                  }
                  data={data}
                  draggable={false}
                  // style={{aspectRatio: '866 / 1300'}}
                  tabIndex={0}
                  mediaOptions={{
                    image: {
                      crop: 'center',
                      sizes: '100vw',
                      loading: 'eager',
                    },
                  }}
                  {...extraProps}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );

  // return (
  //   <div
  //     className={clsx(
  //       'fixed bottom-0 left-0 right-0 top-0 z-50 bg-white text-black',
  //       !zoom && 'pointer-events-none opacity-0',
  //     )}
  //   >
  //     <MinimalHeader />
  //     <Button
  //       mode="text"
  //       type="button"
  //       className={clsx('fixed right-0 z-50', SITE_MARGINS_X, HEADER_TOP)}
  //       onClick={onClose}
  //     >
  //       <Typography type="body">Close</Typography>
  //     </Button>
  //     <button
  //       type="button"
  //       onClick={onEmblaClick}
  //       className="h-full overflow-hidden"
  //       ref={emblaRef}
  //     >
  //       <div className="flex h-full">
  //         {/* Slides */}
  //         {media.slice(1, media.length).map((med) => {
  //           let extraProps: Record<string, any> = {};

  //           if (med.mediaContentType === 'MODEL_3D') {
  //             extraProps = {
  //               interactionPromptThreshold: '0',
  //               ar: true,
  //               loading: 'eager',
  //               disableZoom: true,
  //               style: {height: '100%', margin: '0 auto'},
  //             };
  //           }

  //           const data = {
  //             ...med,
  //             __typename:
  //               typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
  //             image: {
  //               // @ts-ignore
  //               ...med.image,
  //               altText: med.alt || 'Product image',
  //             },
  //           } as MediaImage;

  //           return (
  //             <div
  //               className={clsx(
  //                 'flex h-full w-screen flex-shrink-0 flex-grow-0',
  //                 'flex flex-col items-center justify-center object-contain  ',
  //               )}
  //               key={med.id}
  //             >
  //               <div
  //                 className={clsx(
  //                   'relative flex-1  text-black',
  //                   ' portrait:w-screen landscape:h-full',
  //                   'relative flex items-center justify-center',
  //                   getImageLayout(med, true),
  //                   'pb-[3.4vw] md:pb-[6vw] xl:pb-[5.5vw] 2xl:pb-[5.203125vw]',
  //                 )}
  //               >
  //                 <div
  //                   className="relative h-full flex-1 md:w-screen"
  //                   style={{width: '90.7694vw'}}
  //                 >
  //                   <MediaFile
  //                     className={clsx(
  //                       'absolute h-full w-full select-none object-contain',

  //                       // 'py-[13vw] md:pb-[6vw] md:pt-[3.25vw] xl:pb-[5.5vw] 2xl:pb-[5.203125vw]', //extend image further up
  //                     )}
  //                     data={data}
  //                     draggable={false}
  //                     style={{aspectRatio: '866 / 1300'}}
  //                     tabIndex={0}
  //                     mediaOptions={{
  //                       image: {
  //                         crop: 'center',
  //                         sizes: '100vw',
  //                         loading: 'eager',
  //                       },
  //                     }}
  //                     {...extraProps}
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </button>
  //     <div
  //       data-await-intro
  //       className={clsx(
  //         'absolute bottom-0 z-10 flex w-full flex-col items-center justify-center text-center leading-none',
  //         SITE_MARGINS_Y,
  //         NAV_GAP_Y,
  //       )}
  //     >
  //       <span className="hidden leading-paragraph md:inline">
  //         {storefrontProduct.title}
  //       </span>
  //       <span>
  //         {String(selectedIndex + 1).padStart(2, '0')}/
  //         {String(media!.length).padStart(2, '0')}
  //         {/* {selectedIndex + 1}/{media!.length} */}
  //       </span>
  //     </div>
  //   </div>
  // );
}
