import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
import Module from './Module';
import clsx from 'clsx';
import Button from '../elements/Button';
import MinimalHeader from '../global/MinimalHeader';

type Props = {
  modules: any[];
  children?: never;
  zoom: boolean;
  setZoom: (zoom: boolean) => void;
  index: number;
  setIndex: (index: number) => void;
};

export default function ModuleSlideshow(props) {
  const {modules, children, zoom, setZoom, index} = props;
  const [selectedIndex, setSelectedIndex] = useState(index || 0);

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

  const onClose = () => {
    setZoom(false);
  };

  return (
    <div
      onClick={onClick}
      className="fixed left-0 top-0 z-50 h-screen w-screen bg-white"
      // tabIndex={-1}
    >
      <MinimalHeader />
      <Button
        mode="text"
        type="button"
        className="fixed right-0 top-0 z-10 p-4"
        onClick={onClose}
      >
        Close
      </Button>
      <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {modules?.map((module) => (
            <div
              className={clsx(
                'h-full w-full flex-shrink-0 flex-grow-0',
                module.layout === 'full'
                  ? 'object-cover'
                  : 'flex flex-col items-center justify-center object-contain px-4 pb-11 pt-14 md:pt-19',
              )}
              key={module._key}
            >
              <Module module={module} />
              <div
                className={clsx(
                  'mt-2 text-center md:hidden',
                  module.layout === 'full' &&
                    'absolute bottom-14 left-0 w-full text-center',
                )}
              >
                {modules[selectedIndex]?.caption || ''}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 z-10 flex h-header-sm w-full items-center justify-center gap-4 text-center">
        <span>
          {String(selectedIndex + 1).padStart(2, '0')}/
          {String(modules!.length).padStart(2, '0')}
        </span>
        <span className="hidden md:inline">
          {modules[selectedIndex]?.caption || ''}
        </span>
      </div>
    </div>
  );
}
