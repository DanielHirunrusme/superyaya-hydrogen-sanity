import type {PortableTextMarkComponentProps} from '@portabletext/react';
import clsx from 'clsx';

import {Link} from '~/components/Link';

type Props = PortableTextMarkComponentProps & {
  value?: PortableTextMarkComponentProps['value'] & {
    slug?: string;
  };
};

export default function LinkInternalAnnotation({children, value}: Props) {
  if (!value?.slug) {
    return null;
  }

  return (
    <Link
      className={clsx(
        'inline-flex items-center',
        'hover:opacity-50 active:opacity-50',
      )}
      to={value?.slug}
      onClick={(e) => e.stopPropagation()}
    >
      <>{children}</>
    </Link>
  );
}
