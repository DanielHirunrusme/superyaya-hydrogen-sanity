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
import {Container} from '../global/Container';
import PortableText from '~/components/portableText/PortableText';
import {Link} from '@remix-run/react';

type Props = {
  modules: any;

  index: number;
  detached: boolean;
  mode: Theme.DARK | Theme.LIGHT;
  title: string;
  body: any;
};

export default function ProjectSlideshow(props: Props) {
  const {modules, index, detached, mode, title, body} = props;
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

  // const onSelect = useCallback(() => {
  //   if (!emblaApi) return;
  //   setSelectedIndex(emblaApi.selectedScrollSnap());
  // }, [emblaApi, setSelectedIndex]);

  // useEffect(() => {
  //   if (!emblaApi) return;
  //   onSelect();
  //   emblaApi.on('select', onSelect);
  // }, [emblaApi, onSelect]);

  // const onClick = (e) => {
  //   if (!emblaApi) return;
  //   if (e.clientX < window.innerWidth / 3) {
  //     emblaApi.scrollPrev();
  //   } else {
  //     emblaApi.scrollNext();
  //   }
  // };

  // useEffect(() => {
  //   if (!indexVisible && emblaApi) {
  //     emblaApi.scrollTo(selectedIndex);
  //     setTheme(mode);
  //   } else {
  //     setTheme(mode);
  //   }

  //   if (indexVisible && mode === Theme.DARK) {
  //     setTheme(Theme.LIGHT);
  //   } else {
  //     setTheme(mode);
  //   }

  //   return () => {
  //     setTheme(Theme.LIGHT);
  //   };
  // }, [indexVisible, emblaApi]);

  return (
    <div className={clsx('fixed left-0 top-0 z-50 h-screen w-screen bg-white')}>
      <MinimalHeader />
      <Link
        to={'/projects'}
        type="button"
        className={clsx('fixed right-0 z-20 hover:opacity-50', SITE_MARGINS_X, HEADER_TOP)}
      >
        <Typography type="body">Close</Typography>
      </Link>

      <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">

          {modules?.map((module) => (
            <div
              className={clsx(
                'relative h-full w-full flex-shrink-0 flex-grow-0',
                getImageLayout(module, true),
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

          {/* Description */}
          <div
            className={clsx(
              'relative flex h-full w-full flex-shrink-0 flex-grow-0 items-center select-none',
            )}
            onClick={onClick}
          >
            <Container type="pageDescription" asChild>
              <div className="mx-auto mb-[36.92vw] text-center md:mb-[7.035vw] xl:mb-[9.4328vw] 2xl:mb-[13.28125vw]">
                <Typography type="rte">
                  <div className=" !uppercase !tracking-widest">{title}</div>
                  <br />
                  {body && (
                    <div className="mx-auto text-left !normal-case">
                      <PortableText blocks={body} />
                    </div>
                  )}
                </Typography>
              </div>
            </Container>
          </div>
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

          <span className="hidden select-none md:inline">
            <SlideshowCaption blocks={modules[selectedIndex - 1]?.caption} />
          </span>


          <span>
            {String(selectedIndex + 1).padStart(2, '0')}/
            {String(modules!.length + 1).padStart(2, '0')}
          </span>

      </div>
    </div>
  );
}
