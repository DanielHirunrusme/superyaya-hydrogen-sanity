import { useMatches } from '@remix-run/react';
import { CartForm } from '@shopify/hydrogen';
import clsx from 'clsx';
import { useEffect } from 'react';

import { CartDrawer, useDrawer } from '~/components/cart/CartDrawer';
import CartToggle from '~/components/cart/CartToggle';
import { CountrySelector } from '~/components/global/CountrySelector';
import { UserIcon } from '~/components/icons/User';
import { Link } from '~/components/Link';
import { useCartFetchers } from '~/hooks/useCartFetchers';
import MobileNavigation from './MobileNavigation';

export default function HeaderActions({menuLinks}) {
  const { isOpen, openDrawer, closeDrawer } = useDrawer();
  const [root] = useMatches();
  const cart = root.data?.cart;

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
      <div
        className="fixed right-0 top-0 h-header-sm items-center px-4 flex gap-[14px] md:gap-4"
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
        <Link to="/pages/faq" className="linkTextNavigation hidden md:inline text-xxs 2xl:text-lg">Assistance</Link>

     
          <CartToggle cart={cart} isOpen openDrawer={openDrawer} />
  
        {/* <Link to="/pages/studio" className="linkTextNavigation hidden md:inline">Studio</Link> */}

        {menuLinks && <MobileNavigation menuLinks={menuLinks} />}

      </div>

      <CartDrawer cart={cart} open={isOpen} onClose={closeDrawer} />
    </>
  );
}
