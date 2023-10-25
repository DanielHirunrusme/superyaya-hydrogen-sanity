import {Disclosure} from '@headlessui/react';
import {PortableTextBlock} from '@portabletext/types';
import clsx from 'clsx';
import { Typography } from '~/components/global/Typography';

import MinusIcon from '~/components/icons/Minus';
import PlusIcon from '~/components/icons/Plus';
import PortableText from '~/components/portableText/PortableText';
import type {SanityModuleAccordion} from '~/lib/sanity';

type Props = {
  value: PortableTextBlock & SanityModuleAccordion;
};

export default function AccordionBlock({value}: Props) {
  return (
    <div
      className={clsx(
        'first:mt-0 last:mb-0', //
        'mb-[1em]',
      )}
    >
      
      {value?.groups?.map((group) => (
        <Disclosure key={group._key}>
          {({open}: {open: boolean}) => (
            <div className="flex flex-col">
              <Disclosure.Button
                className={clsx(
                  'flex items-center justify-between  transition-opacity duration-200 ease-out',
                  'hover:opacity-60',
                )}
              >
                <div className="truncate">
                  {open ? <MinusIcon /> : <PlusIcon />} {group.title}
                </div>
            
              </Disclosure.Button>
              <Disclosure.Panel className="pb-[2em]">
                <PortableText blocks={group.body} />
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      ))}
 
    </div>
  );
}
