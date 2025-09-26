import type {ActionFunctionArgs} from '@remix-run/node';
import {Await, useMatches, useNavigate} from '@remix-run/react';
import {
  CartForm,
  type CartQueryData,
  type SeoHandleFunction,
} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import clsx from 'clsx';
import {useEffect, useState} from 'react';
import {Suspense} from 'react';
import invariant from 'tiny-invariant';
import {CartActions, CartLineItems, CartSummary} from '~/components/cart/Cart';
import CartInquireForm from '~/components/cart/CartInquireForm';
import StaggerIndexList from '~/components/framer/StaggerIndexList';
import {Container} from '~/components/global/Container';
import {Typography} from '~/components/global/Typography';
import SpinnerIcon from '~/components/icons/Spinner';
import {Link} from '~/components/Link';
import {isLocalPath} from '~/lib/utils';
import {HEADER_TOP} from '~/lib/constants';
import CloseIcon from '~/components/icons/Close';

import {EmptyMessage} from './($lang).boutique.$handle';

const seo: SeoHandleFunction = () => ({
  title: 'Cart',
  noIndex: true,
});

export const handle = {
  seo,
};

export async function action({request, context}: ActionFunctionArgs) {
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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const idx = (window.history.state && (window.history.state as any).idx) ?? 0;
    setHasHistory(idx > 0 || window.history.length > 1);
  }, []);

  return (
    <section
      className={clsx(
        '', //
        '',
      )}
    >
      {hasHistory && (
        <div
          className={clsx(
            'fixed left-0 z-50 mt-[1px] px-mobile md:px-tablet xl:px-laptop 2xl:px-desktop',
            HEADER_TOP,
          )}
        >
          <button
            className={clsx('linkTextNavigation hidden md:inline')}
            onClick={() => navigate(-1)}
          >
            <Typography type="body" size="sm">
              Back
            </Typography>
          </button>
        </div>
      )}

      {hasHistory && (
        <div
          className={clsx(
            'fixed left-0 z-[60] py-[3px] px-mobile md:px-tablet xl:px-laptop 2xl:px-desktop',
            HEADER_TOP,
          )}
        >
          <button
            className={clsx(
              'flex aspect-[1.214] w-[4.358vw] items-center justify-center md:hidden',
            )}
            aria-label="Go back"
            onClick={() => navigate(-1)}
          >
            <CloseIcon />
          </button>
        </div>
      )}
      <Suspense
        fallback={
          <div className="flex justify-center overflow-hidden">
            <SpinnerIcon />
          </div>
        }
      >
        <Await resolve={(root.data as any)?.cart}>
          {(cart) => {
            return (
              <div className="cart">
                <StaggerIndexList>
                  {cart && cart.lines?.edges?.length > 0 ? (
                    <Container type="cart">
                      {!formSubmitted && <div className="mb-10 text-center">
                        <h1>Inquire to Purchase</h1>
                        <br />
                        <p className="text-balance">
                        PLEASE REVIEW AND COMPLETE YOUR ORDER INQUIRY USING THE FORM BELOW. ONCE SUBMITTED, YOU WILL RECEIVE AN ORDER CONFIRMATION AND INVOICE VIA EMAIL WITHIN 2 BUSINESS DAYS. 
                        </p>
                      </div>}
                      <ul>
                        {!formSubmitted && <li className="hidden grid-cols-8 border-b border-black opacity-0 md:grid">
                          <span className="col-span-4">
                            <span className="cell ml-[7em] block leading-none 2xl:ml-[5.07vw]">
                              Item
                            </span>
                          </span>
                          <span className="cell col-span-3 leading-none">
                            Quantity
                          </span>
                          <span className="cell col-span-1 flex justify-end text-right leading-none md:relative md:text-left">
                            <span className="ml-auto block w-[5.5em] text-right leading-none md:relative md:text-left">
                              Price
                            </span>
                          </span>
                        </li>}
                        {!formSubmitted && (
                          <li>
                            <CartLineItems linesObj={cart?.lines} />
                          </li>
                        )}
                        {/* grid grid-cols-8 gap-6 2xl:grid-cols-3  opacity-0 */}
                        <li className={clsx(!formSubmitted && 'border-t border-black')}>
                          <div className={clsx(!formSubmitted && 'pt-5')}>
                            {' '}
                            <CartInquireForm
                              cartLines={cart?.lines}
                              onFormSuccess={() => setFormSubmitted(true)}
                            />
                          </div>
                          {/* <div className="cell col-span-4 hidden md:col-span-6 md:flex gap-[1em] 2xl:col-start-1 2xl:col-end-3">
                        <div className='w-[6em] flex-shrink-0  2xl:w-[5.07vw] aspect-[1556/1944]' />
                        <Typography type="body" size="sm">
                          Shipping &amp; taxes calculated at checkout
                        </Typography>
                      </div>
                      <div className="col-span-8 md:col-span-2 2xl:col-span-1 2xl:col-start-3 2xl:col-end-3">
                        <div className="ml-auto md:ml-0 md:w-auto">
                          <CartSummary cost={cart?.cost} />
                        </div>
                        <CartActions cart={cart} />
                      </div> */}
                        </li>
                      </ul>
                    </Container>
                  ) : (
                    <EmptyMessage>
                      <Container type="cart">
                        <ul>
                          <li className="text-center">
                            Your cart is currently empty.
                          </li>
                        </ul>
                      </Container>
                    </EmptyMessage>
                  )}
                </StaggerIndexList>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </section>
  );
}
