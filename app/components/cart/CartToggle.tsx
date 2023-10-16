import {Await} from '@remix-run/react';
import {Cart} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';
import {Link} from '~/components/Link';
import Button from '../elements/Button';

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
          <Link to="/cart"><Button mode="text" as="span">Cart ({data?.totalQuantity || 0})</Button></Link>
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