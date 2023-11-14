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
import {Typography} from '~/components/global/Typography';
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
            <div className='cart'>
            <StaggerIndexList>
              {cart && cart.lines?.edges?.length > 0 ? (
                <Container type="cart">
                  <ul>
                    <li className="hidden grid-cols-8 border-b border-black opacity-0 md:grid">
                      <span className="col-span-4">
                        <span className="cell block leading-none ml-[7em] 2xl:ml-[5.07vw]">Item</span>
                      </span>
                      <span className="cell col-span-3 leading-none">
                        Quantity
                      </span>
                      <span className=" cell col-span-1 flex justify-end text-right leading-none md:relative md:text-left">
                        <span className="ml-auto block w-[5.5em] text-right leading-none leading-none md:relative md:text-left">
                          Price
                        </span>
                      </span>
                    </li>
                    <li>
                      <CartLineItems linesObj={cart?.lines} />
                    </li>
                    <li className="grid grid-cols-8 gap-6 border-t border-black opacity-0 2xl:grid-cols-3">
                      <div className="cell col-span-4 hidden md:col-span-6 md:flex gap-[1em] 2xl:col-start-1 2xl:col-end-3">
                        <div className='w-[6em] flex-shrink-0  2xl:w-[5.07vw] aspect-[866/1300]' />
                        <Typography type="body" size="sm">
                          Shipping &amp; taxes calculated at checkout
                        </Typography>
                      </div>
                      <div className="col-span-8 md:col-span-2 2xl:col-span-1 2xl:col-start-3 2xl:col-end-3">
                        <div className="ml-auto md:ml-0 md:w-auto">
                          <CartSummary cost={cart?.cost} />
                        </div>
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
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}
