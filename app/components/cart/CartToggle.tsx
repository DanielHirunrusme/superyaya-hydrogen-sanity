import {Await} from '@remix-run/react';
import {Cart} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';
import {Link} from '~/components/Link';
import Button from '../elements/Button';
import CartIcon from '../icons/Cart';
import {Typography} from '../global/Typography';

type Props = {
  cart: Cart;
  isOpen: boolean;
  openDrawer: () => void;
};

/**
 * A client component that defines the behavior when a user toggles a cart
 */
export default function CartToggle({cart, isOpen, openDrawer}: Props) {
  return (
    <Suspense fallback={<button>Cart (0)</button>}>
      <Await resolve={cart}>
        {(data) => (
          <Link to="/cart" className="linkTextNavigation">
            <Typography type="body" size="sm">
              <span className="lead hidden md:inline  ">
                Cart ({data?.totalQuantity || 0})
              </span>

              <div className="fixed top-0 py-[4.8vw] right-0 px-mobile   md:hidden">
                <div className='relative w-[4.1025vw] aspect-[0.8]'>
                <CartIcon />
                <span className="absolute select-none bottom-[.1875em] left-[.5px]  w-full text-center leading-none">
                  {data?.totalQuantity > 0 ? data?.totalQuantity : ""}
                </span>
                </div>
                
              </div>
            </Typography>
          </Link>
        )}
      </Await>
    </Suspense>
  );
}