import type {SanityModuleGallery, SanityModuleImage} from '~/lib/sanity';
import ImageModule from './Image';
import clsx from 'clsx';
import {GRID_GAP} from '~/lib/constants';

type Props = {
  module: SanityModuleGallery;
};

export default function GalleryModule({module}: Props) {
  return (
    <div
      className={clsx(
        'gallery-module flex h-full w-full flex-col justify-center md:grid md:grid-cols-2',
        GRID_GAP,
      )}
    >
      {module.images.map((image: SanityModuleImage) => (
        <ImageModule key={image._key} module={image} parentModule={module} />
      ))}
    </div>
  );
}
