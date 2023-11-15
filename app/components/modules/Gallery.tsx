import type {SanityModuleGallery, SanityModuleImage} from '~/lib/sanity';
import ImageModule from './Image';
import clsx from 'clsx';
import {GRID_GAP} from '~/lib/constants';

type Props = {
  module: SanityModuleGallery;
};

export default function GalleryModule({module}: Props) {

  const getGallerySize = (layout) => {
    switch (layout) {
      case 'small':
        return 'w-full md:w-[64.65%] xl:w-[58.33%] 2xl:w-[48.28125%]';
      default:
        return 'w-full';
    }
  }

  const getGalleryStack = (stack) => {
    switch (stack) {
      case 'Vertical':
        return 'flex flex-col justify-center md:grid md:grid-cols-2';
      case 'default':
      default:
        return 'grid grid-cols-2';
    }
  }

  return (
    <div
      className={clsx(
        'gallery-module md:h-full portrait:w-full',
        getGalleryStack(module.mobileStack),
        getGallerySize(module.layout),
        GRID_GAP,
      )}
      data-mobilestack={module.mobileStack}
      data-count={module.images?.length}
    >
      {module.images.map((image: SanityModuleImage) => (
        <ImageModule key={image._key} module={image} parentModule={module} />
      ))}
    </div>
  );
}
