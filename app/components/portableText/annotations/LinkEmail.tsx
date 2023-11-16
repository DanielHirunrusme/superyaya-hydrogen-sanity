import type {PortableTextMarkComponentProps} from '@portabletext/react';
import clsx from 'clsx';

type Props = PortableTextMarkComponentProps & {
  value?: PortableTextMarkComponentProps['value'] & {
    email: string;
  };
};

const LinkEmailAnnotation = ({children, value}: Props) => {
  if (!value?.email) {
    return null;
  }

  return (
    <a
      className={clsx(
        '', //
        'hover:opacity-50 active:opacity-50',
      )}
      href={`mailto:${value?.email}`}
    >
      <>{children}</>
    </a>
  );
};

export default LinkEmailAnnotation;
