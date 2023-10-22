import {useMatches} from '@remix-run/react';
// import clsx from 'clsx';
import {useAnimate} from 'framer-motion';
import {useEffect} from 'react';

import HeaderActions from '~/components/global/HeaderActions';
// import HeaderBackground from '~/components/global/HeaderBackground';
// import MobileNavigation from '~/components/global/MobileNavigation';
import Navigation from '~/components/global/Navigation';
import {Link} from '~/components/Link';
import {useState} from 'react';

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const [root] = useMatches();
  const layout = root.data?.layout;
  const {menuLinks} = layout || {};
  const [scope, animate] = useAnimate();
  const [logoVisible, setLogoVisible] = useState<boolean>(false);

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
        className="absolute top-0 z-50 flex w-full  flex-col items-center justify-center text-center"
        role="banner"
      >
        <Link
          ref={scope}
          className="linkTextNavigation mb-3 mt-4 !no-underline opacity-0"
          to="/"
        >
          SUPER YAYA
        </Link>
        {/* Accounts, country selector + cart toggle */}
        <HeaderActions logoVisible={logoVisible} menuLinks={menuLinks} />

        {menuLinks && (
          <Navigation logoVisible={logoVisible} menuLinks={menuLinks} />
        )}
      </header>
    </>
  );
}
