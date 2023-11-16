import type {PortableTextMarkComponentProps} from '@portabletext/react';
import clsx from 'clsx';

type Props = PortableTextMarkComponentProps & {
  value?: PortableTextMarkComponentProps['value'] & {
    newWindow?: boolean;
    url: string;
  };
};

const LinkExternalAnnotation = ({children, value}: Props) => {
  if (!value?.url) {
    return <>{children}</>;
  }

  return (
    <a
      className={clsx(
        'inline-flex items-center',
        'hover:opacity-50 active:opacity-50',
      )}
      href={value?.url}
      rel="noopener noreferrer"
      target={value?.newWindow ? '_blank' : '_self'}
      onClick={(e) => e.stopPropagation()}
    >
      <>{children}</>
    </a>
  );
};

export default LinkExternalAnnotation;
