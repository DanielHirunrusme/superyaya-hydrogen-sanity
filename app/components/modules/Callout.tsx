import clsx from 'clsx';

import LinkButton from '~/components/elements/LinkButton';
import type {SanityModuleCallout} from '~/lib/sanity';
import {useColorTheme} from '~/lib/theme';

type Props = {
  module: SanityModuleCallout;
};

export default function CalloutModule({module}: Props) {
  const colorTheme = useColorTheme();

  return (
    <div
      className="mr-auto flex flex-col items-start"
      style={{color: colorTheme?.text}}
    >
      {/* Text */}
      <div
        className={clsx(
          'max-w-[60rem] ', //
          ' ',
        )}
      >
        {module.text}
      </div>

      {/* Link */}
      {module.link && (
        <div className="mt-4">
          <LinkButton backgroundColor={colorTheme?.text} link={module.link} />
        </div>
      )}
    </div>
  );
}
