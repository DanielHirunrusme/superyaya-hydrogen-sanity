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
        'flex flex-col md:grid h-full w-full md:grid-cols-2 justify-center gallery-module',
        GRID_GAP,
      )}
    >
      {module.images.map((image: SanityModuleImage) => (
        <ImageModule key={image._key} module={image} parentModule={module} />
      ))}
    </div>
  );
}
