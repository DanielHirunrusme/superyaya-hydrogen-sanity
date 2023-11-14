import {Disclosure} from '@headlessui/react';
import {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
import {Typography} from '~/components/global/Typography';

import MinusIcon from '~/components/icons/Minus';
import PlusIcon from '~/components/icons/Plus';
import PortableText from '~/components/portableText/PortableText';
import type {SanityModuleAccordion} from '~/lib/sanity';

type Props = {
  value: PortableTextBlock & SanityModuleAccordion;
};

export default function AccordionBlock({value}: Props) {
  return (
    <StaggerIndexList>
      <ul
        className={clsx(
          'first:mt-0 last:mb-0', //
          'mb-[1em]',
        )}
      >
        {value?.groups?.map((group) => (
          <Disclosure key={group._key}>
            {({open}: {open: boolean}) => (
              <li className="flex flex-col opacity-0">
                <Disclosure.Button
                  className={clsx(
                    'flex items-center justify-between  transition-opacity duration-200 ease-out',
                    'hover:opacity-50 active:opacity-50',
                  )}
                >
                  <div className="flex truncate">
                    <span className="block w-[1.5em] text-left">
                      {open ? <MinusIcon /> : <PlusIcon />}
                    </span>{' '}
                    {group.title}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="pb-[2em]">
                  <PortableText blocks={group.body} />
                </Disclosure.Panel>
              </li>
            )}
          </Disclosure>
        ))}
      </ul>
    </StaggerIndexList>
  );
}
