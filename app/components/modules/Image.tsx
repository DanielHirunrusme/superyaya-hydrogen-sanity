import {useMatches} from '@remix-run/react';
import clsx from 'clsx';

import Button from '~/components/elements/Button';
import Link from '~/components/elements/Link';
import SanityImage from '~/components/media/SanityImage';
import ProductHotspot from '~/components/product/Hotspot';
import ProductTag from '~/components/product/Tag';
import type {SanityModuleImage} from '~/lib/sanity';
import {Theme} from '../context/ThemeProvider';

type Props = {
  module: SanityModuleImage;
  parentModule?: any;
  mode?: Theme.DARK | Theme.LIGHT;
  inSlideShow?: boolean;
};

export default function ImageModule({
  module,
  parentModule,
  mode,
  inSlideShow,
}: Props) {
  if (!module.image) {
    return null;
  }

  return (
    <>
      {module.variant === 'callToAction' && module.callToAction?.link ? (
        <Link className="group" link={module.callToAction.link}>
          <ImageContent module={module} inSlideShow={inSlideShow} />
        </Link>
      ) : (
        <ImageContent
          parentModule={parentModule}
          module={module}
          mode={mode}
          inSlideShow={inSlideShow}
        />
      )}

      {/* Caption */}
      {module.variant === 'caption' && module.caption && (
        <div className="mt-2 max-w-[35rem]  leading-caption ">
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

  // const applyAspectRatio = false;

  return (
    <ImageContainer module={module} image={image} parentModule={parentModule}>
      <>
        <SanityImage
          crop={image?.crop}
          dataset={sanityDataset}
          hotspot={image?.hotspot}
          // layout="responsive"
          projectId={sanityProjectID}
          sizes={['50vw, 100vw']}
          src={image?.asset?._ref}
          layout="fill"
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

        {/* Call to action */}
        {module.variant === 'callToAction' && (
          <div
            className={clsx(
              'absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-20 duration-500 ease-out',
              'group-hover:bg-opacity-30',
            )}
          >
            <div className="mt-[1em] flex flex-col items-center gap-5">
              {/* Title */}
              <div
                className={clsx(
                  'max-w-[30rem]  text-white', //
                  '',
                  '',
                )}
              >
                {module.callToAction?.title}
              </div>

              {/* Button */}
              {module.callToAction?.link && (
                <Button
                  className={clsx('pointer-events-none bg-white text-offBlack')}
                >
                  {module.callToAction.title}
                </Button>
              )}
            </div>
          </div>
        )}
      </>
    </ImageContainer>
  );
};

function ImageContainer({image, parentModule, module, children}) {
  const applyAspectRatio = parentModule?._type === 'module.gallery';

  const getImageSize = (layout, image) => {
    switch (layout) {
      case 'full':
        return 'w-full h-full';
      case 'contain':
        return 'w-full md:h-full';
      case 'small':
        if (image.width < image.height) {
          // portrait
          return 'w-[50%] md:h-full md:w-[18.92%] xl:w-[19%] 2xl:w-[16.667%]';
        } else {
          // landscape
          return 'w-[66.667%] md:h-full md:w-[38.52%] xl:w-[38.773%] 2xl:w-[25%]';
        }
      case 'default':
      default:
        return 'w-full md:h-full';
    }
  };

  if (parentModule?._type !== 'module.gallery') {
    return (
      <div
        className={clsx(
          'relative select-none',
          getImageSize(module.layout, image),
        )}
        style={{
          aspectRatio: !applyAspectRatio ? image.width / image.height : 'auto',
        }}
      >
        {children}
      </div>
    );
  } else {
    return (
      <div
        className={clsx(
          'relative select-none gallery-image',
          getImageSize(module.layout, image),
        )}
        style={{
          aspectRatio: image.width / image.height,
        }}
      >
        {children}
      </div>
    );
  }
}
