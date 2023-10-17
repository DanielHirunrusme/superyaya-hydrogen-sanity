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
      <header id="Header" className="sticky top-0 z-50 text-center h-header-sm flex items-center justify-center" role="banner">
      <Link className="linkTextNavigation !no-underline " to="/">
        SUPERYAYA
      </Link>
        {/* Accounts, country selector + cart toggle */}
        <HeaderActions menuLinks={menuLinks} />
      </header>
      {menuLinks && <Navigation menuLinks={menuLinks} />}
    </>
  );
}
