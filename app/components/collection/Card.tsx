import clsx from 'clsx';

import {Link} from '~/components/Link';
import type {SanityCollection} from '~/lib/sanity';

type Props = {
  collection: SanityCollection;
  onClick?: () => void;
};

export default function CollectionCard({collection, onClick}: Props) {
  if (!collection.slug) {
    return null;
  }

  return (
    <Link onClick={onClick} to={collection.slug}>
      <div
        className={clsx(
          'justify-centerbg-lightGray group relative flex aspect-[4/3] items-center transition-[border-radius] duration-500 ease-out',
          'hover:rounded-xl',
        )}
        style={{
          background: collection?.colorTheme?.background,
        }}
      >
        {/* Vector artwork */}
        {collection.vector && (
          <div
            className="absolute bottom-2 left-2 right-1 top-2 duration-1000 ease-out group-hover:scale-[1.03]"
            style={{
              background: collection?.colorTheme?.text,
              WebkitMask: `url(${collection.vector}) center center / contain no-repeat`,
              mask: `url(${collection.vector}) center center / contain no-repeat`,
            }}
          />
        )}

        {/* Title */}
        <div
          className={clsx(
            'relative text-center group-hover:underline',
            collection.vector ? 'text-white' : '',
          )}
        >
          {collection.title}
        </div>
      </div>
    </Link>
  );
}
