import { MediaFile } from '@shopify/hydrogen';
import {
    MediaImage,
    ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect } from 'react';
import type { ProductWithNodes } from '~/types/shopify';
import clsx from 'clsx';

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
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    const onEmblaClick = (e) => {
        if (e.clientX > window.innerWidth / 2) {
            handleNext();
        } else {
            handlePrevious();
        }
    };

    const handleNext = () => {
        if (emblaApi) {
            emblaApi.scrollNext();
        }
    };

    const handlePrevious = () => {
        if (emblaApi) {
            emblaApi.scrollPrev();
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

    const onClose = () => {
        setZoom(false);
    };

    if (!media?.length || !zoom) {
        return null;
    }



    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-white">
            <button className="fixed top-0 right-0 z-10 p-4" onClick={onClose}>Close</button>
            <div onClick={onEmblaClick} className="h-full overflow-hidden" ref={emblaRef}>
                <div className="flex h-full">
                    {/* Slides */}
                    {media.map((med) => {
                        let extraProps: Record<string, any> = {};

                        if (med.mediaContentType === 'MODEL_3D') {
                            extraProps = {
                                interactionPromptThreshold: '0',
                                ar: true,
                                loading: 'eager',
                                disableZoom: true,
                                style: { height: '100%', margin: '0 auto' },
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
                                className="relative flex w-full shrink-0 grow-0 select-none object-contain px-4 py-14"
                                data={data}
                                draggable={false}
                                key={med.id}
                                tabIndex={0}
                                mediaOptions={{
                                    image: { crop: 'center', sizes: '100vw', loading: 'eager' },
                                }}
                                {...extraProps}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="text-center absolute bottom-0 z-10 w-full py-4 items-center flex gap-4 justify-center">
                <span>{selectedIndex + 1}/{media!.length}</span><span>{storefrontProduct.title}</span>
            </div>
        </div>
    );
}
