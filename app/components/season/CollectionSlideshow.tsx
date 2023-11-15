import useEmblaCarousel from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import Button from '../elements/Button';
import MinimalHeader from '../global/MinimalHeader';
import StaggerIndexList from '../framer/StaggerIndexList';
import {Link} from '~/components/Link';
import {useTheme} from '../context/ThemeProvider';
import {Container} from '../global/Container';
import {
  HEADER_TOP,
  SITE_MARGINS_X,
  SITE_MARGINS_Y,
} from '~/lib/constants';
import {Typography} from '../global/Typography';

import {useMatches} from '@remix-run/react';

import SanityImage from '~/components/media/SanityImage';
import ProductHotspot from '~/components/product/Hotspot';
import ProductTag from '~/components/product/Tag';

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

export default function CollectionSlideshow(props) {
  const {
    modules,
    children,
    zoom,
    setZoom,
    index,
    setIndex,
    detached,
    showIndex,
    title,
    outboundLink,
    outboundLinkText,
    mode,
  } = props;
  const [indexVisible, setIndexVisible] = useState(false);
  const [theme, setTheme] = useTheme();
  const [w, setW] = useState<any>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: modules && modules.length > 1,
    loop: true,
    skipSnaps: true,
    speed: 100,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    setW(window);
    window.addEventListener('resize', () => {
      setW(window);
    });
  }, []);

  const onClick = (e) => {
    e.clientX < window.innerWidth / 2
      ? emblaApi.scrollPrev()
      : emblaApi.scrollNext();
  };

  const onClose = (e) => {
    e.stopPropagation();
  };

  const toggleIndexVisible = () => {
    setIndexVisible(!indexVisible);
  };

  useEffect(() => {
    if (!indexVisible && emblaApi) {
      emblaApi.scrollTo(index);
    }
  }, [indexVisible, emblaApi]);

  return (
    <div
      onClick={onClick}
      className={clsx(
        'fixed left-0 top-0 z-50 h-screen w-screen',
        theme === 'dark' ? 'bg-black' : 'bg-white',
      )}
    >
      <MinimalHeader />
      <Link
        as={Link}
        to="/collections"
        className={clsx('fixed right-0 z-40 hover:opacity-50 active:opacity-50', SITE_MARGINS_X, HEADER_TOP)}
        // onClick={onClose}
      >
        <Typography type="body">Close</Typography>
      </Link>

      {!indexVisible && (
        <div className="h-full w-screen overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {modules?.map((module) => (
              <div
                className={clsx(
                  'flex h-full w-full flex-shrink-0 flex-grow-0',
                  'flex flex-col items-center justify-center object-contain px-mobile ',
                  'py-[15.897vw] md:py-[4vw] xl:py-[3.25vw] 2xl:py-[3vw] 2xl:pb-[3.5vw]',
                )}
                key={module._key}
              >
                <div
                  className={clsx(
                    'flex-0 relative bg-white px-[1em] py-[1em] text-black',
                    'aspect-[938/1276] portrait:w-full landscape:h-full',
                    // w?.innerWidth > w?.innerHeight ? 'h-full' : 'w-full',
                  )}
                  // style={{
                  //   aspectRatio: `${
                  //     module.image.width / (module.image.height + 60)
                  //   }`,
                  // }}
                >
                  <CollectionModule
                    module={module}
                    mode={mode}
                    inSlideShow={true}
                  />
                  <div
                    data-await-intro
                    className={clsx(
                      'text-center',

                      'absolute bottom-[.875em] left-0 w-full select-none text-center xl:bottom-[.675em]',
                    )}
                  >
                    {modules[index]?.caption || ''}
                  </div>
                </div>
              </div>
            ))}

            {/* Text Slide */}
            <div
              className={clsx(
                'flex h-full w-full flex-shrink-0 flex-grow-0 select-none',
                'flex-col items-center justify-center object-contain',
                'py-[15.897vw] md:py-[4vw] xl:py-[3.25vw] 2xl:py-[3vw] 2xl:pb-[3.5vw]',
                SITE_MARGINS_X,
              )}
            >
              <div
                className={clsx(
                  'flex-0 relative bg-black py-[1em] md:py-[4em] text-white',
                  'aspect-[938/1276] portrait:w-full landscape:h-full',
                )}
              >
                {children}
              </div>
            </div>
            {/* End Text Slide */}
          </div>
        </div>
      )}
      {indexVisible && (
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
                        setIndex(index);
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
            'absolute bottom-0 z-10 flex w-full  select-none items-center justify-center gap-4 text-center leading-none',
            SITE_MARGINS_Y,
          )}
        >
          <span>
            {String(index + 1).padStart(2, '0')}/
            {String(modules!.length + 1).padStart(2, '0')}
          </span>
        </div>
      )}
      {/* Footer */}

      <div>
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
      </div>
    </div>
  );
}

function CollectionModule({module, parentModule, mode, inSlideShow}: Props) {
  if (!module.image) {
    return null;
  }

  return (
    <>
      <ImageContent
        parentModule={parentModule}
        module={module}
        mode={mode}
        inSlideShow={inSlideShow}
      />

      {/* Caption */}
      {module.variant === 'caption' && module.caption && (
        <div className="mt-1 max-w-[35rem]  leading-caption ">
          {module.caption}
        </div>
      )}

      {/* Product tags */}
      {module.variant === 'productTags' && !inSlideShow && (
        <div className=" flex flex-wrap gap-x-1 gap-y-2">
          {module.productTags?.map((tag) => {
            if (!tag?.gid) {
              return null;
            }

            return (
              <ProductTag
                key={tag._key}
                productGid={tag?.gid}
                variantGid={tag?.variantGid}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

const ImageContent = ({module, parentModule, mode, inSlideShow}: Props) => {
  const image = module.image;
  const mobileImage = module.mobileImage;
  const [root] = useMatches();
  const {sanityDataset, sanityProjectID} = root.data;
  const applyAspectRatio = parentModule?._type === 'module.gallery';

  return (
    <div
      className={clsx(
        'relative select-none',
        // image.width > image.height ? 'w-full' : 'w-full',
        parentModule?._type === 'module.gallery' && 'h-full md:h-auto',
        module.layout === 'full' && 'h-full',
        'w-full',
      )}
      style={{
        aspectRatio: !applyAspectRatio ? image.width / image.height : 'auto',
      }}
    >
      <SanityImage
        crop={image?.crop}
        dataset={sanityDataset}
        hotspot={image?.hotspot}
        layout="responsive"
        projectId={sanityProjectID}
        sizes={['50vw, 100vw']}
        src={image?.asset?._ref}
        objectFit={module.layout !== 'full' ? 'contain' : 'cover'}
        className={clsx(
          module.layout === 'full' && 'object-center',
          module.mobileImage && 'hidden md:block',
        )}
      />
      {mobileImage && (
        <SanityImage
          crop={mobileImage?.crop}
          dataset={sanityDataset}
          hotspot={mobileImage?.hotspot}
          // layout="responsive"
          projectId={sanityProjectID}
          sizes={['50vw, 100vw']}
          src={mobileImage?.asset?._ref}
          layout="fill"
          objectFit={module.layout !== 'full' ? 'contain' : 'cover'}
          className={clsx(
            module.layout === 'full' && 'object-cover object-center',
            'md:hidden',
          )}
        />
      )}

      {/* Product hotspots */}
      {module.variant === 'productHotspots' && inSlideShow && (
        <>
          {module.productHotspots?.map((hotspot) => {
            if (!hotspot?.product?.gid) {
              return null;
            }

            return (
              <ProductHotspot
                key={hotspot._key}
                productGid={hotspot?.product?.gid}
                variantGid={hotspot?.product?.variantGid}
                x={hotspot.x}
                y={hotspot.y}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
