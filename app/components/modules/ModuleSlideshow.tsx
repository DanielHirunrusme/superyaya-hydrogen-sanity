import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
import Module from './Module';
import clsx from 'clsx';

export default function ModuleSlideshow(props) {
  const {modules, children} = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: modules && modules.length > 1,
    loop: true,
    skipSnaps: true,
    speed: 100,
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
      emblaApi.scrollPrev();
    } else {
      emblaApi.scrollNext();
    }
  };

  //   useEffect(() => {

  //     const galleryIndex = 1

  //     if (emblaApi && galleryIndex >= 0) {
  //       emblaApi.scrollTo(galleryIndex, true); // instantly scroll
  //     }
  //   }, [emblaApi, media, selectedVariant]);

  console.log(modules);

  return (
    <div
      onClick={onClick}
      className="fixed left-0 top-0 h-screen w-screen"
      tabIndex={-1}
    >
      <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {modules?.map((module) => (
            <div
              className={clsx(
                'h-full w-full flex-shrink-0 flex-grow-0',
                module.layout === 'full'
                  ? 'object-cover'
                  : 'object-contain pb-11 pt-14 md:pt-19 px-4 flex items-center justify-center flex-col',
              )}
              key={module._key}
            >
              <Module module={module} />
              <div className={clsx('text-center md:hidden mt-2', module.layout === "full" && "absolute bottom-14 w-full left-0 text-center")}>{modules[selectedIndex]?.caption || ''}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 z-10 flex h-header-sm w-full items-center justify-center gap-4 text-center">
        <span>
          {String(selectedIndex + 1).padStart(2, '0')}/
          {String(modules!.length).padStart(2, '0')}
        </span>
        <span className='hidden md:inline'>{modules[selectedIndex]?.caption || ''}</span>
      </div>
    </div>
  );
}
