import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useRef, useState} from 'react';
import Module from './Module';
import clsx from 'clsx';
import Button from '../elements/Button';
import MinimalHeader from '../global/MinimalHeader';
import StaggerIndexList from '../framer/StaggerIndexList';
import {Link} from '~/components/Link';
import {useTheme, Theme} from '../context/ThemeProvider';
import {Container} from '../global/Container';
import {HEADER_TOP, SITE_MARGINS_X, SITE_MARGINS_Y} from '~/lib/constants';
import {Typography} from '../global/Typography';
// import PortableText from '../portableText/PortableText';
import {PortableTextBlock} from '@sanity/types';
import {NAV_GAP_Y} from '~/lib/constants';
import Leader from '../global/Leader';
import blocksToText from 'studio/utils/blocksToText';

type Props = {
  modules: any[];
  children?: never;
  zoom?: boolean;
  setZoom?: (zoom: boolean) => void;
  index?: number;
  setIndex?: (index: number) => void;
  detached?: boolean;
  showIndex?: boolean;
  title?: string;
  outboundLink?: string;
  outboundLinkText?: string;
};

export const getImageLayout = (module, detached = false) => {
  switch (module.layout) {
    case 'full':
      return 'object-cover';
    case 'contain':
      return 'object-contain flex flex-col items-center justify-center md:block';
    case 'default':
    default:
      // default styles
      let styles =
        'flex flex-col items-center justify-center object-contain px-mobile md:px-tablet xl:px-laptop 2xl:px-desktop';

      if (detached) {
        if (!module.caption) {
          styles += ' pb-[13vw] md:pb-[3.25vw]  md:pt-[4vw] xl:pt-[3.242vw]';
        } else {
          styles +=
            ' pb-[3.4vw] md:pb-[7vw] xl:pb-[5.5vw] 2xl:pb-[5.203125vw]  md:pt-[4vw] xl:pt-[3.242vw]';
        }
      } else {
        if (module.caption) {
          // if there is a caption add symmetrical padding top and bottom
          styles +=
            ' pb-[13vw] md:pb-[7vw] xl:pb-[5.5vw] 2xl:pb-[5.203125vw] md:pt-[7vw] xl:pt-[5.5vw] 2xl:pt-[5.203125vw]';
        } else {
          // if there is no caption make image extend further down
          styles +=
            ' pb-[13vw] md:pb-[3.25vw] md:pt-[7vw] xl:pt-[5.5vw] 2xl:pt-[5.203125vw]';
        }
      }

      return styles;
  }
};

export default function ModuleSlideshow(props) {
  const {
    modules,
    children,
    zoom,
    setZoom,
    index,
    detached,
    showIndex,
    title,
    outboundLink,
    outboundLinkText,
    mode,
    showCount = true,
  } = props;
  const [selectedIndex, setSelectedIndex] = useState(index || 0);
  const [indexVisible, setIndexVisible] = useState(false);
  const {theme, setTheme} = useTheme();
  const slideshowContainerRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: modules && modules.length > 1,
    loop: true,
    skipSnaps: true,
    speed: 100,
  });

  useEffect(() => {
    if(!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [index, emblaApi]);

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
    if (e.clientX < window.innerWidth / 3) {
      emblaApi.scrollPrev();
    } else {
      emblaApi.scrollNext();
    }
  };

  const onClose = () => {
    setZoom(false);
  };

  const toggleIndexVisible = () => {
    setIndexVisible(!indexVisible);
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

  useEffect(() => {
    console.log('slideshowContainerRef', slideshowContainerRef);
    if (!slideshowContainerRef?.current) return;

    const mouseMove = (e) => {
      document.body.style.cursor = e.clientX < window.innerWidth / 2 ? 'w-resize' : 'e-resize';
    };

    slideshowContainerRef.current.addEventListener('mousemove', mouseMove);

    return () => {
      document.body.style.cursor = 'auto';
      slideshowContainerRef.current?.removeEventListener('mousemove', mouseMove);
    };
}, [slideshowContainerRef]);

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 h-screen w-screen',
        detached ? 'z-50' : 'z-40',
        !zoom && detached && 'opacity-0 pointer-events-none',
        theme === Theme.DARK && !indexVisible
          ? 'bg-black'
          : 'bg-white text-black',
      )}
      // tabIndex={-1}
    >
      {detached && (
        <>
          <MinimalHeader />
          <Button
            mode="text"
            type="button"
            className={clsx('fixed right-0 z-20', SITE_MARGINS_X, HEADER_TOP)}
            onClick={onClose}
          >
            <Typography type="body">Close</Typography>
          </Button>
        </>
      )}
      {!indexVisible && (
        <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
          <div className="flex h-full" ref={slideshowContainerRef}>
            {modules?.map((module) => (
              <div
                className={clsx(
                  'relative h-full w-full flex-shrink-0 flex-grow-0',
                  getImageLayout(module, detached),
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
      )}
      {showIndex && indexVisible && (
        <div className="flex min-h-screen w-full justify-center text-center md:items-center ">
          <Container type="slideshowIndex" asChild>
            {/* Table */}
            <StaggerIndexList>
              <ul className="relative mx-auto w-full md:top-[-2em]">
                <li className="text-center opacity-0">
                  {title}
                  <br />
                  <br />
                </li>
                {modules?.map((module, index) => (
                  <li
                    onClick={() => {
                      setIndexVisible(false);
                      setSelectedIndex(index);
                    }}
                    className="cursor-pointer opacity-0"
                    key={`table-${module._key}`}
                  >
                    <Leader
                      title={
                        module.caption ? blocksToText(module.caption) : 'Figure'
                      }
                      index={String(index + 1).padStart(2, '0')}
                    />
                  </li>
                ))}
              </ul>
            </StaggerIndexList>
          </Container>
        </div>
      )}
      {!indexVisible && showCount && (
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
      )}
      {/* Footer */}
      {showIndex && (
        <>
          {outboundLink && (
            <Link
              to={outboundLink}
              data-await-intro
              className={clsx(
                'linkTextNavigation fixed bottom-0 left-0 z-50 flex items-center !no-underline',
                SITE_MARGINS_X,
                SITE_MARGINS_Y,
              )}
            >
              {outboundLinkText}
            </Link>
          )}
          <Button
            data-await-intro
            mode="text"
            onClick={toggleIndexVisible}
            className={clsx(
              'linkTextNavigation fixed bottom-0 right-0 z-50 flex items-center !no-underline',
              SITE_MARGINS_X,
              SITE_MARGINS_Y,
            )}
          >
            {!indexVisible ? 'Index' : 'Slideshow'}
          </Button>
        </>
      )}
    </div>
  );
}

type SlideshowCaptionProps = {
  blocks: PortableTextBlock[];
};
export const SlideshowCaption = (props: SlideshowCaptionProps) => {
  const {blocks} = props;
  return (
    <div className="uppercase text-black">
      {/* <PortableText blocks={blocks} variant="caption" /> */}
    </div>
  );
};
