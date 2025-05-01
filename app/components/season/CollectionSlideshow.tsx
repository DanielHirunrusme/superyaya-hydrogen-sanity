import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
// import Button from '../elements/Button';
import MinimalHeader from '../global/MinimalHeader';
import StaggerIndexList from '../framer/StaggerIndexList';
import { Link } from '~/components/Link';
import { Theme, useTheme } from '../context/ThemeProvider';
import { Container } from '../global/Container';
import {
  HEADER_TOP,
  NAV_GAP_Y,
  // SITE_CONTENT_OFFSET,
  SITE_MARGINS_X,
  SITE_MARGINS_Y,
} from '~/lib/constants';
import { Typography } from '../global/Typography';

import { useMatches } from '@remix-run/react';

import SanityImage from '~/components/media/SanityImage';
import ProductHotspot from '~/components/product/Hotspot';
import ProductTag from '~/components/product/Tag';
import { SlideshowCaption, getImageLayout } from '../modules/ModuleSlideshow';
import Leader from '../global/Leader';

type Props = {
  modules: any[];
  children?: never;
  zoom?: boolean;
  setZoom?: (zoom: boolean) => void;
  index: number;
  setIndex: (index: number) => {};
  detached?: boolean;
  showIndex?: boolean;
  title?: string;
  outboundLink?: string;
  outboundLinkText?: string;
  mode: any;
  closeTo?: string;
};

export default function CollectionSlideshow(props: Props) {
  const {
    modules,
    zoom,
    setZoom,
    index,
    setIndex,
    title,
    mode,
    closeTo = '/collections',
  } = props;
  const [indexVisible, setIndexVisible] = useState(false);
  const { theme, setTheme } = useTheme();
  const [w, setW] = useState<any>(null);

  const slideshowContainerRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    draggable: modules && modules.length > 1,
    loop: true,
    skipSnaps: true,
    speed: 100,
    startIndex: index
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
    const winResizeCollectionSlideshow = () => {
      setW(window);
    }

    window.addEventListener('resize', winResizeCollectionSlideshow);

    return () => {
      window.removeEventListener('resize', winResizeCollectionSlideshow)
    }
  }, []);

  const onClick = (e) => {
    if (indexVisible) return;
    e.clientX < window.innerWidth / 3
      ? emblaApi?.scrollPrev()
      : emblaApi?.scrollNext();
  };

  // useEffect(() => {
  //   if (!indexVisible && emblaApi) {
  //     emblaApi.scrollTo(index);
  //   }
  // }, [indexVisible, emblaApi, index]);

  useEffect(() => {
    return () => {
      setTheme(Theme.LIGHT);
    };
  }, [index, indexVisible]);

  useEffect(() => {
    if (!slideshowContainerRef?.current) return;

    const mouseMove = (e: MouseEvent) => {
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
      onClick={onClick}
      className={clsx(
        'fixed left-0 top-0 z-50 h-screen w-screen',
        theme === 'dark' ? 'bg-black' : 'bg-white',
        !zoom && 'opacity-0 pointer-events-none',
      )}
    >
      <MinimalHeader />
      <button
        // to={closeTo}
        onClick={(e) => {
          if (closeTo === '#') e.preventDefault();
          e.stopPropagation();
          setZoom(false);
        }}
        className={clsx(
          'fixed right-0 z-40 text-black no-underline hover:opacity-50 active:opacity-50',
          SITE_MARGINS_X,
          HEADER_TOP,
        )}
      // onClick={onClose}
      >
        <Typography type="body">Close</Typography>
      </button>

      <div
        className={clsx(
          'h-full w-screen overflow-hidden',
          indexVisible && 'hidden',
        )}
        ref={emblaRef}
      >
        <div className="flex h-full" ref={slideshowContainerRef}>
          {modules?.map((module) => (
            <div
              className={
                'flex h-full w-full flex-shrink-0 flex-grow-0 flex-col items-center justify-center object-contain'
              }
              key={module._key}
            >
              <div
                className={clsx(
                  'flex-0 relative  text-black',
                  ' portrait:w-full landscape:h-full',
                  'flex items-center justify-center',
                  getImageLayout(module, true),
                )}
              >
                <CollectionModule
                  module={module}
                  mode={mode}
                  inSlideShow={true}
                />

                <div
                  data-await-intro="true"
                  data-module-layout="small"
                  className="mt-2 text-center md:hidden"
                >
                  <div className="uppercase">
                    <div className="caption">
                      <SlideshowCaption blocks={module.caption} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Text Slide */}
          {/* <div
            className={clsx(
              ' flex w-full flex-shrink-0 flex-grow-0 select-none',
              'flex-col items-center justify-center object-contain',
              // 'py-[15.897vw] md:py-[4vw] xl:py-[3.25vw] 2xl:py-[3vw] 2xl:pb-[3.5vw]',
              SITE_MARGINS_X,
              SITE_CONTENT_OFFSET,
            )}
          >
            <div className="flex-0 relative w-full md:mx-0 md:h-full md:w-auto">
              {children}
            </div>
          </div> */}
          {/* End Text Slide */}
        </div>
      </div>

      {indexVisible && (
        <div className="flex min-h-screen w-full justify-center text-center text-black md:items-center">
          <Container type="slideshowIndex" asChild>
            {/* Table */}
            <StaggerIndexList>
              <ul className="relative mx-auto w-full">
                <li className="text-center opacity-0">
                  {title}
                  <br />
                  <br />
                </li>
                {modules?.map((module, index) => (
                  <li
                    onClick={() => {
                      setIndexVisible(false);
                      // setIndex(index);
                    }}
                    className="block cursor-pointer opacity-0"
                    key={`table-${module._key}`}
                  >
                    <Leader
                      title={String(module.caption)}
                      index={String(index + 1).padStart(2, '0')}
                    />
                  </li>
                ))}
              </ul>
            </StaggerIndexList>
          </Container>
        </div>
      )}
      {!indexVisible && (
        <div
          data-await-intro
          className={clsx(
            'absolute bottom-0 z-10 flex w-full select-none flex-col items-center justify-center text-center leading-none text-black',
            SITE_MARGINS_Y,
            NAV_GAP_Y,
          )}
        >
          <span className="hidden leading-paragraph md:inline">
            {index < modules.length
              ? String(modules[index]?.caption || '')
              : ''}
          </span>
          <span>
            {String(index + 1).padStart(2, '0')}/
            {String(modules!.length).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Footer */}

      <div>
        {modules[index]?.reference?.store?.slug && !indexVisible && (
          <Link
            to={`/products/${modules[index]?.reference?.store?.slug.current}`}
            data-await-intro
            className={clsx(
              'linkTextNavigation fixed bottom-0 left-0 z-50 flex items-center leading-none text-black !no-underline',
              SITE_MARGINS_X,
              SITE_MARGINS_Y,
            )}
          >
            Pre-order
          </Link>
        )}

        <Link
          to="/collections"
          title="Collections"
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            'linkTextNavigation select-none fixed bottom-0 right-0 z-50 flex items-center leading-none text-black !no-underline',
            SITE_MARGINS_X,
            SITE_MARGINS_Y,
          )}
        >
          Index
        </Link>

        {/* <Button
          data-await-intro
          mode="text"
          onClick={toggleIndexVisible}
          className={clsx(
            'linkTextNavigation fixed bottom-0 right-0 z-50 flex items-center leading-none text-black !no-underline',
            SITE_MARGINS_X,
            SITE_MARGINS_Y,
          )}
        >
          {!indexVisible ? 'Index' : 'Slideshow'}
        </Button> */}
      </div>
    </div>
  );
}

function CollectionModule({ module, parentModule, mode, inSlideShow }: Props) {
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
          <SlideshowCaption blocks={module.caption} />
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

const ImageContent = ({ module, parentModule, mode, inSlideShow }: Props) => {
  const image = module.image;
  const mobileImage = module.mobileImage;
  const [root] = useMatches();
  const { sanityDataset, sanityProjectID } = root.data;
  const applyAspectRatio = parentModule?._type === 'module.gallery';

  return (
    <div
      className={clsx(
        'relative select-none',
        // image.width > image.height ? 'w-full' : 'w-full',
        // parentModule?._type === 'module.gallery' && 'h-full md:h-auto',
        // module.layout === 'full' && 'h-full',
        'w-full md:h-full md:w-auto',
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
