import {useCallback, useEffect, useState} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Module from '../modules/Module';
import clsx from 'clsx';
import Button from '../elements/Button';
import MinimalHeader from '../global/MinimalHeader';
import {useTheme, Theme} from '../context/ThemeProvider';
import {HEADER_TOP, SITE_MARGINS_X, SITE_MARGINS_Y} from '~/lib/constants';
import {Typography} from '../global/Typography';

import {NAV_GAP_Y} from '~/lib/constants';
import {SlideshowCaption} from '../modules/ModuleSlideshow';
import {getImageLayout} from '../modules/ModuleSlideshow';

export default function ProjectSlideshow(props) {
  const {modules, setZoom, index, detached, mode} = props;
  const [selectedIndex, setSelectedIndex] = useState(index || 0);
  const [indexVisible, setIndexVisible] = useState(false);
  const [theme, setTheme] = useTheme();

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

  useEffect(() => {
    if (!indexVisible && emblaApi) {
      emblaApi.scrollTo(selectedIndex);
      setTheme(mode);
    } else {
      setTheme(mode);
    }

    if (indexVisible && mode === Theme.DARK) {
      setTheme(Theme.LIGHT);
    } else {
      setTheme(mode);
    }

    return () => {
      setTheme(Theme.LIGHT);
    };
  }, [indexVisible, emblaApi]);

  return (
    <div className={clsx('fixed left-0 top-0 z-50 h-screen w-screen bg-white')}>
      <MinimalHeader />
      <Button
        mode="text"
        type="button"
        className={clsx('fixed right-0 z-20', SITE_MARGINS_X, HEADER_TOP)}
        onClick={onClose}
      >
        <Typography type="body">Close</Typography>
      </Button>

      <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {modules?.map((module) => (
            <div
              className={clsx(
                'relative h-full w-full flex-shrink-0 flex-grow-0',
                getImageLayout(module, false),
              )}
              key={module._key}
              onClick={onClick}
              style={{backgroundColor: module.background?.hex}}
            >
              <Module module={module} mode={mode} inSlideShow={true} />
              <div
                data-await-intro
                data-module-layout={module.layout}
                className={clsx(
                  'mt-2 text-center md:hidden',
                  module.layout === 'full'
                    ? 'absolute bottom-14 left-0 w-full text-center'
                    : '',
                )}
              >
                <SlideshowCaption blocks={module.caption} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        data-await-intro
        className={clsx(
          'absolute bottom-0 z-10 flex w-full flex-col items-center justify-center text-center leading-none',
          SITE_MARGINS_Y,
          NAV_GAP_Y,
        )}
      >
        <span className="hidden md:inline">
          <SlideshowCaption blocks={modules[selectedIndex]?.caption} />
        </span>
        <span>
          {String(selectedIndex + 1).padStart(2, '0')}/
          {String(modules!.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
