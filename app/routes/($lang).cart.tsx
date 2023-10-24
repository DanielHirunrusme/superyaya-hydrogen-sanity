import {Await, useMatches} from '@remix-run/react';
import {
  CartForm,
  type CartQueryData,
  type SeoHandleFunction,
} from '@shopify/hydrogen';
import {ActionArgs, json} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';
import {Link} from '~/components/Link';

import {CartActions, CartLineItems, CartSummary} from '~/components/cart/Cart';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
import {Container} from '~/components/global/Container';
import SpinnerIcon from '~/components/icons/Spinner';
import {isLocalPath} from '~/lib/utils';

const seo: SeoHandleFunction = () => ({
  title: 'Cart',
  noIndex: true,
});

export const handle = {
  seo,
};

export async function action({request, context}: ActionArgs) {
  const {session, cart} = context;

  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    session.get('customerAccessToken'),
  ]);

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryData;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
        customerAccessToken,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(request, redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors} = result;
  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const [root] = useMatches();

  return (
    <section
      className={clsx(
        '', //
        '',
      )}
    >
      <Suspense
        fallback={
          <div className="flex justify-center overflow-hidden">
            <SpinnerIcon />
          </div>
        }
      >
        <Await resolve={root.data?.cart}>
          {(cart) => (
            <StaggerIndexList>
              {cart && cart.lines?.edges?.length > 0 ? (
                <Container type="cart">
                  <ul>
                    <li className="hidden grid-cols-8 gap-6 border-b border-black opacity-0 md:grid 2xl:grid-cols-12">
                      <span className="col-span-4 2xl:col-span-6">
                        <span className="block px-2">Item</span>
                      </span>
                      <span className="col-span-3 2xl:col-span-4">
                        Quantity
                      </span>
                      <span className="col-span-1 items-end justify-end text-right 2xl:col-span-2">
                        <span className="ml-auto block w-[5.5em] px-2 text-left">
                          Price
                        </span>
                      </span>
                    </li>
                    <li>
                      <CartLineItems linesObj={cart?.lines} />
                    </li>
                    <li className="grid grid-cols-8 gap-6 border-t border-black opacity-0 2xl:grid-cols-3">
                      <div className="col-span-4 md:col-span-6 2xl:col-span-1" />
                      <div className="col-span-4 md:col-span-2 2xl:col-span-1 2xl:col-start-3 2xl:col-end-3">
                        <CartSummary cost={cart?.cost} />
                        <CartActions cart={cart} />
                      </div>
                    </li>
                  </ul>
                </Container>
              ) : (
                <Container type="cart">
                  <ul>
                    <li className="text-center">
                      You cart is empty.{' '}
                      <Link to="/boutique/all">Continue shopping</Link>
                    </li>
                  </ul>
                </Container>
              )}
            </StaggerIndexList>
          )}
        </Await>
      </Suspense>
    </section>
  );
}
