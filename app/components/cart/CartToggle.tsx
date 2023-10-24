import {Await} from '@remix-run/react';
import {Cart} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';
import {Link} from '~/components/Link';
import Button from '../elements/Button';
import CartIcon from '../icons/Cart';
import { Typography } from '../global/Typography';

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
            <span className='hidden lead md:inline  '>
              Cart ({data?.totalQuantity || 0})
            </span>
           
            <div className='md:hidden w-[4.1025vw] aspect-[0.8] relative'>
              <CartIcon />
              <span className='absolute leading-none w-full  text-center left-0 bottom-[.1875em]'>{data?.totalQuantity || 0}</span>
            </div>
            </Typography>
          </Link>
        )}
      </Await>
    </Suspense>
  );
}

/*
<button
            aria-expanded={isOpen}
            aria-controls="cart"
            onClick={() => {
              openDrawer();
            }}
            className="linkTextNavigation"
          >
            Cart ({data?.totalQuantity || 0})
          </button>
          */
