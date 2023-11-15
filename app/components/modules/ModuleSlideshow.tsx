import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
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
  } = props;
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

  const getImageLayout = (layout) => {
    switch (layout) {
      case 'full':
        return 'object-cover';
      case 'contain':
        return 'object-contain flex flex-col items-center justify-center md:block';
      case 'default':
      default:
        return `flex flex-col items-center justify-center object-contain px-4  xl:pb-[3.6vw] ${
          detached
            ? 'pt-[4vw] xl:pt-[3.6vw]'
            : 'py-[13vw] md:pb-[4.25vw] md:pt-[7vw] xl:pt-[5.5vw] 2xl:pt-[5.203125vw]'
        }`;
    }
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'fixed left-0 top-0 h-screen w-screen',
        detached ? 'z-50' : 'z-40',
        theme === Theme.DARK && !indexVisible ? 'bg-black' : 'bg-white',
      )}
      // tabIndex={-1}
    >
      {detached && (
        <>
          <MinimalHeader />
          <Button
            mode="text"
            type="button"
            className={clsx('fixed right-0 z-10', SITE_MARGINS_X, HEADER_TOP)}
            onClick={onClose}
          >
            <Typography type="body">Close</Typography>
          </Button>
        </>
      )}
      {!indexVisible && (
        <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {modules?.map((module) => (
              <div
                className={clsx(
                  'h-full w-full flex-shrink-0 flex-grow-0 relative',
                  getImageLayout(module.layout),
                )}
                key={module._key}
                style={{backgroundColor: module.background?.hex}}
              >
                <Module module={module} mode={mode} inSlideShow={true} />
                <div
                  data-await-intro
                  data-module-layout={module.layout}
                  className={clsx(
                    'mt-2 text-center md:hidden',
                    module.layout === 'full' ?
                      'absolute bottom-14 left-0 w-full text-center' : '',
                  )}
                >
                  {modules[selectedIndex]?.caption || ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showIndex && indexVisible && (
        <div className="flex min-h-screen w-full items-center justify-center text-center">
          <Container type="slideshowIndex" asChild>
            <div className="mx-auto my-24 w-full text-center">
              {/* Table */}
              <StaggerIndexList>
                <ul className="relative top-[-2em] mx-auto w-full">
                  <li className="text-center">
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
                      className="cursor-pointer"
                      key={`table-${module._key}`}
                    >
                      <div className="leaders hover:opacity-50 active:opacity-50">
                        <span>{module.caption || 'Figure'}</span>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </StaggerIndexList>
            </div>
          </Container>
        </div>
      )}
      {!indexVisible && (
        <div
          data-await-intro
          className={clsx(
            'absolute bottom-0 z-10 flex w-full  items-center justify-center gap-4 text-center leading-none',
            SITE_MARGINS_Y,
          )}
        >
          <span>
            {String(selectedIndex + 1).padStart(2, '0')}/
            {String(modules!.length).padStart(2, '0')}
          </span>
          <span className="hidden md:inline">
            {modules[selectedIndex]?.caption || ''}
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
