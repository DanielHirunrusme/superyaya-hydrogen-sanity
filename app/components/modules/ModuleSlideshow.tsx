import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Module from './Module';

export default function ModuleSlideshow(props) {
    const { modules, children } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        draggable: modules && modules.length > 1,
        loop: true,
        skipSnaps: true,
        speed: 1,
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

    const onClick = (e) => {
        if (e.clientX < window.innerWidth / 2) {
            emblaApi.scrollPrev()
        } else {
            emblaApi.scrollNext()
        }
    }

    //   useEffect(() => {

    //     const galleryIndex = 1

    //     if (emblaApi && galleryIndex >= 0) {
    //       emblaApi.scrollTo(galleryIndex, true); // instantly scroll
    //     }
    //   }, [emblaApi, media, selectedVariant]);

    return (
        <div onClick={onClick} className="h-screen w-screen fixed top-0 left-0" tabIndex={-1}>
            <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
                <div className="flex h-full">
                    {modules?.map((module) => <div className='w-full object-cover flex-grow-0 flex-shrink-0' key={module._key}><Module
                        module={module}
                    /></div>)}
                </div>
            </div>
            <div className='pt-4 text-center absolute bottom-0 m-4 w-full text-center z-10'>{selectedIndex + 1}/{modules!.length}</div>
        </div>
    )
}