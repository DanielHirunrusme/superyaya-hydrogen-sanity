import {useMatches} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import clsx from 'clsx';
import {useEffect} from 'react';

import {CartDrawer, useDrawer} from '~/components/cart/CartDrawer';
import CartToggle from '~/components/cart/CartToggle';
import {CountrySelector} from '~/components/global/CountrySelector';
import {UserIcon} from '~/components/icons/User';
import {Link} from '~/components/Link';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import MobileNavigation from './MobileNavigation';
import {stagger, useAnimate} from 'framer-motion';
import {HEADER_TOP, NAV_GAP, STAGGER_SPEED} from '~/lib/constants';
import { Typography } from './Typography';

type Props = {
  menuLinks: any;
  logoVisible: boolean;
};

export default function HeaderActions(props: Props) {
  const {menuLinks, logoVisible} = props;
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const [root] = useMatches();
  const cart = root.data?.cart;
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const fadeIn = async () => {
      animate(
        'li',
        {opacity: 1},
        {delay: stagger(STAGGER_SPEED), duration: 0.01},
      );
    };
    if (logoVisible) {
      fadeIn();
    }
  }, [logoVisible]);

  // Grab all the fetchers that are adding to cart
  // const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // When the fetchers array changes, open the drawer if there is an add to cart action
  // useEffect(() => {
  //   if (
  //     isOpen ||
  //     addToCartFetchers.length === 0 ||
  //     addToCartFetchers[0].state === 'submitting'
  //   )
  //     return;
  //   openDrawer();
  // }, [addToCartFetchers, isOpen, openDrawer]);

  return (
    <>
      <ul
        ref={scope}
        className={clsx("fixed right-0 top-0 flex  items-center px-mobile md:px-tablet xl:px-laptop 2xl:px-desktop gap-[1em] md:gap-[2em]", HEADER_TOP)}
      >
        {/* Country select */}
        {/* <div
          className={clsx(
            'hidden', //
            'lg:block',
          )}
        >
          <CountrySelector />
        </div> */}
        {/* Account */}
        {/* <Link
          className={clsx([
            'hidden h-[2.4rem] items-center rounded-sm bg-darkGray bg-opacity-0 p-2',
            'lg:flex',
            'hover:bg-opacity-10',
          ])}
          to="/account"
        >
          <UserIcon />
        </Link> */}
        {/* Cart */}
        <li className="opacity-0">
          <Link
            to="/pages/faq"
            className="linkTextNavigation hidden  md:inline "
          >
            <Typography type="body" size="sm">Assistance</Typography>
          </Link>
        </li>

        <li className="opacity-0">
          <CartToggle cart={cart} isOpen openDrawer={openDrawer} />
        </li>

        {/* <Link to="/pages/studio" className="linkTextNavigation hidden md:inline">Studio</Link> */}

        {menuLinks && <MobileNavigation menuLinks={menuLinks} />}
      </ul>

      <CartDrawer cart={cart} open={isOpen} onClose={closeDrawer} />
    </>
  );
}
