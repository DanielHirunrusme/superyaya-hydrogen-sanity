import {useLocation, useMatches} from '@remix-run/react';
// import clsx from 'clsx';
import {useAnimate} from 'framer-motion';
import {useEffect} from 'react';

import HeaderActions from '~/components/global/HeaderActions';
// import HeaderBackground from '~/components/global/HeaderBackground';
// import MobileNavigation from '~/components/global/MobileNavigation';
import Navigation from '~/components/global/Navigation';
import {Link} from '~/components/Link';
import {useState} from 'react';
import clsx from 'clsx';
import {HEADER_TOP, NAV_GAP, NAV_GAP_Y} from '~/lib/constants';

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const [root] = useMatches();
  const layout = root.data?.layout;
  const {menuLinks, assistance} = layout || {};
  const [scope, animate] = useAnimate();
  const [logoVisible, setLogoVisible] = useState<boolean>(false);
  const location = useLocation();


  useEffect(() => {
    const fadeIn = async () => {
      await animate(scope.current, {opacity: 1}, {duration: 0.1, delay: 1});
      setLogoVisible(true);
    };
    fadeIn();
  }, [scope]);
  return (
    <>
      <header
        id="Header"
        className={clsx(
          'z-50 flex  w-full flex-col items-center justify-center text-center',
          assistance?.links?.some((e) => e.slug === location?.pathname) ? 'relative md:absolute pb-mobile md:pb-0' : 'absolute',
          NAV_GAP_Y,
          HEADER_TOP,
        )}
        role="banner"
      >
        <Link
          ref={scope}
          className="linkTextNavigation !no-underline opacity-0"
          to="/"
        >
          SUPER YAYA
        </Link>
        {/* Accounts, country selector + cart toggle */}
        <HeaderActions logoVisible={logoVisible} menuLinks={menuLinks} assistance={assistance} />

        {menuLinks && (
          <Navigation logoVisible={logoVisible} menuLinks={menuLinks} assistance={assistance} />
        )}
      </header>
    </>
  );
}
