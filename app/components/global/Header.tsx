import {useMatches} from '@remix-run/react';
import clsx from 'clsx';

import HeaderActions from '~/components/global/HeaderActions';
import HeaderBackground from '~/components/global/HeaderBackground';
import MobileNavigation from '~/components/global/MobileNavigation';
import Navigation from '~/components/global/Navigation';
import {Link} from '~/components/Link';

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const [root] = useMatches();

  const layout = root.data?.layout;
  const {menuLinks} = layout || {};
  return (
    <>
      <header id="Header" className="absolute w-full top-0 z-50 text-center  flex flex-col items-center justify-center" role="banner">
      <Link className="linkTextNavigation mt-4 mb-3 !no-underline " to="/">
        SUPER YAYA
      </Link>
        {/* Accounts, country selector + cart toggle */}
        <HeaderActions menuLinks={menuLinks} />
     
      {menuLinks && <Navigation menuLinks={menuLinks} />}
      </header>
    </>
  );
}
