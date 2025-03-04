import CalloutModule from '~/components/modules/Callout';
import CallToActionModule from '~/components/modules/CallToAction';
import CollectionModule from '~/components/modules/Collection';
import ImageModule from '~/components/modules/Image';
import InstagramModule from '~/components/modules/Instagram';
import ProductModule from '~/components/modules/Product';
import type {SanityModule} from '~/lib/sanity';
import GalleryModule from './Gallery';
import {Theme} from '../context/ThemeProvider';

type Props = {
  imageAspectClassName?: string;
  module: SanityModule;
  mode?: Theme.DARK | Theme.LIGHT;
  inSlideShow?: boolean;
};

export default function Module({
  imageAspectClassName,
  module,
  mode,
  inSlideShow,
}: Props) {
  switch (module._type) {
    case 'module.callout':
      return <CalloutModule module={module} />;
    case 'module.callToAction':
      return <CallToActionModule module={module} />;
    case 'module.collection':
      return <CollectionModule module={module} />;
    case 'module.image':
      return (
        <ImageModule module={module} mode={mode} inSlideShow={inSlideShow} />
      );
    case 'module.imageCollection':
      return (
        <ImageModule module={module} mode={mode} inSlideShow={inSlideShow} />
      );
    case 'module.gallery':
      return <GalleryModule module={module} />;
    case 'module.instagram':
      return <InstagramModule module={module} />;
    case 'module.product':
      return (
        <ProductModule
          imageAspectClassName={imageAspectClassName}
          module={module}
        />
      );
    default:
      return null;
  }
}
