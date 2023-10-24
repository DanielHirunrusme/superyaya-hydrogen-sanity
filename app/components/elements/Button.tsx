import {RemixLinkProps} from '@remix-run/react/dist/components';
import clsx from 'clsx';
import type {ButtonHTMLAttributes, ElementType} from 'react';
import {twMerge} from 'tailwind-merge';

import {Link} from '~/components/Link';

type ButtonMode = 'default' | 'outline' | 'text';
type ButtonTone = 'critical' | 'default' | 'shopPay';

type RemixLinkPropsOptional = Omit<RemixLinkProps, 'to'> & {
  to?: RemixLinkProps['to'];
};

type Props = {
  as?: ElementType;
  className?: string;
  mode?: ButtonMode;
  onClick?: () => void;
  to?: string;
  tone?: ButtonTone;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  RemixLinkPropsOptional;

type ButtonStyleOptions = {
  mode?: ButtonMode;
  tone?: ButtonTone;
};

export const defaultButtonStyles = (options?: ButtonStyleOptions) => {
  const mode: ButtonMode = options?.mode || 'default';
  const tone: ButtonTone = options?.tone || 'default';

  if (mode !== 'text') {
    return clsx([
      'flex items-center justify-center overflow-hidden px-4 md:px-2 hover:opacity-50',
      'disabled:opacity-20 disabled:bg-opacity-100',
      'border-black border',
      'h-[11.7948vw] md:h-[2.68vw] xl:h-[2.719vw] 2xl:h-[2.421875vw]',

      // mode === 'default' &&
      //   clsx([
      //     tone === 'critical' && 'bg-red',
      //     tone === 'default' && 'bg-black',
      //     tone === 'shopPay' && 'bg-shopPay',
      //     'hover:opacity-80 text-white',
      //   ]),
      // mode === 'outline' &&
      //   clsx([
      //     tone === 'critical' && 'border-color-red text-red',
      //     tone === 'default' && 'border border-black text-black',
      //     tone === 'shopPay' && 'border-color-shopPay text-shopPay',
      //     'bg-transparent border hover:opacity-50',
      //   ]),
    ]);
  } else {
    return clsx([
      'hover:opacity-50 uppercase',
    ]);
  }
};

export default function Button({
  as = 'button',
  className,
  mode = 'default',
  tone,
  ...props
}: Props) {
  const Component = props?.to ? Link : as;

  return (
    <Component
      className={twMerge(defaultButtonStyles({mode, tone}), className)}
      {...props}
    />
  );
}
