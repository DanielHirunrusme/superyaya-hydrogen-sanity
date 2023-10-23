import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
import Module from './Module';
import clsx from 'clsx';
import Button from '../elements/Button';
import MinimalHeader from '../global/MinimalHeader';
import StaggerIndexList from '../framer/StaggerIndexList';
import {Link} from '~/components/Link';
import { useTheme, Theme } from '../context/ThemeProvider';

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
  } = props;
  const [selectedIndex, setSelectedIndex] = useState(index || 0);
  const [indexVisible, setIndexVisible] = useState(false);
  const [theme, setTheme] = useTheme()

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
      // setTheme(Theme.DARK)
    } else {
      // setTheme(Theme.LIGHT)
    }

    return ()=> {
      setTheme(Theme.LIGHT)
    }
  }, [indexVisible, emblaApi]);

  return (
    <div
      onClick={onClick}
      className={clsx(
        'fixed left-0 top-0 h-screen w-screen bg-white',
        detached ? 'z-50' : 'z-40',
      )}
      // tabIndex={-1}
    >
      {detached && (
        <>
          <MinimalHeader />
          <Button
            mode="text"
            type="button"
            className="fixed right-0 top-0 z-10 p-4"
            onClick={onClose}
          >
            Close
          </Button>
        </>
      )}
      {!indexVisible && (
        <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {modules?.map((module) => (
              <div
                className={clsx(
                  'h-full w-full flex-shrink-0 flex-grow-0',
                  module.layout === 'full'
                    ? 'object-cover'
                    : `flex flex-col items-center justify-center object-contain px-4 pb-11 2xl:pb-22 ${
                        detached ? 'pt-14 2xl:pt-19' : 'pt-14 md:pt-19 2xl:pt-32'
                      }`,
                )}
                key={module._key}
              >
                <Module module={module} />
                <div
                data-await-intro
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
      )}
      {showIndex && indexVisible && (
        <div className="flex min-h-screen w-full items-center justify-center text-center">
          <div className="mx-auto my-24 w-full text-center md:max-w-[500px] 2xl:max-w-desktopContainer">
            {/* Table */}
            <StaggerIndexList>
              <ul className="mx-auto w-full">
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
                    <div className="leaders hover:opacity-50">
                      <span>{module.caption || 'Figure'}</span>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </StaggerIndexList>
          </div>
        </div>
      )}
      {!indexVisible && (
        <div
          data-await-intro
          className="absolute bottom-0 z-10 flex h-header-sm 2xl:h-header-2xl w-full items-center justify-center gap-4 text-center"
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
              className="fixed bottom-0 left-0 z-50 flex h-header-sm 2xl:h-header-2xl items-center px-4 2xl:px-8 linkTextNavigation"
            >
              {outboundLinkText}
            </Link>
          )}
          <Button
            data-await-intro
            mode="text"
            onClick={toggleIndexVisible}
            className="fixed bottom-0 right-0 z-50 flex h-header-sm 2xl:h-header-2xl 2xl:text-xl items-center px-4 2xl:px-8"
          >
            {!indexVisible ? 'Index' : 'Slideshow'}
          </Button>
        </>
      )}
    </div>
  );
}
