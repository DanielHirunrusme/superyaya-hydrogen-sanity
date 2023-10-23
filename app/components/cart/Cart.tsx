import {useMatches} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import type {
  Cart,
  CartCost,
  CartLine,
  CartLineUpdateInput,
  ComponentizableCartLine,
} from '@shopify/hydrogen/storefront-api-types';
import {
  flattenConnection,
  Image,
  Money,
  ShopPayButton,
} from '@shopify/hydrogen-react';
import clsx from 'clsx';

import Button, {defaultButtonStyles} from '~/components/elements/Button';
import MinusCircleIcon from '~/components/icons/MinusCircle';
import PlusCircleIcon from '~/components/icons/PlusCircle';
import RemoveIcon from '~/components/icons/Remove';
import SpinnerIcon from '~/components/icons/Spinner';
import {Link} from '~/components/Link';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {GRID_GAP, PRODUCT_IMAGE_RATIO} from '~/lib/constants';
import PlusIcon from '../icons/Plus';
import MinusIcon from '../icons/Minus';
import React from 'react';

export function CartLineItems({
  linesObj,
}: {
  linesObj: Cart['lines'] | undefined;
}) {
  const lines = linesObj ? flattenConnection(linesObj) : [];
  return (
    <ul role="table" aria-label="Shopping cart">
      <li role="row" className="sr-only opacity-0">
        <div role="columnheader">Product image</div>
        <div role="columnheader">Product details</div>
        <div role="columnheader">Price</div>
      </li>
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </ul>
  );
}

function LineItem({lineItem}: {lineItem: CartLine | ComponentizableCartLine}) {
  const {merchandise} = lineItem;

  const updatingItems = useCartFetchers(CartForm.ACTIONS.LinesUpdate);
  const removingItems = useCartFetchers(CartForm.ACTIONS.LinesRemove);

  // Check if the line item is being updated, as we want to show the new quantity as optimistic UI
  let updatingQty;
  const updating =
    updatingItems?.find((fetcher) => {
      const formData = fetcher?.formData;

      if (formData) {
        const formInputs = CartForm.getFormInput(formData);
        return (
          Array.isArray(formInputs?.inputs?.lines) &&
          formInputs?.inputs?.lines?.find((line: CartLineUpdateInput) => {
            updatingQty = line.quantity;
            return line.id === lineItem.id;
          })
        );
      }
    }) && updatingQty;

  // Check if the line item is being removed, as we want to show the line item as being deleted
  const deleting = removingItems.find((fetcher) => {
    const formData = fetcher?.formData;
    if (formData) {
      const formInputs = CartForm.getFormInput(formData);
      return (
        Array.isArray(formInputs?.inputs?.lineIds) &&
        formInputs?.inputs?.lineIds?.find(
          (lineId: CartLineUpdateInput['id']) => lineId === lineItem.id,
        )
      );
    }
  });

  const firstVariant = merchandise.selectedOptions[0];
  const hasDefaultVariantOnly =
    firstVariant.name === 'Title' && firstVariant.value === 'Default Title';

  return (
    <li
      role="row"
      className={clsx(
        'relative grid grid-cols-8 opacity-0',
        GRID_GAP,
        'flex border-b border-black py-2 last:border-b-0',
        deleting && 'opacity-50',
      )}
    >
      {/* Image & Title */}
      <div className="col-span-8 flex md:col-span-4">
        <div
          role="cell"
          className={clsx(
            'mr-3 w-[70px] 2xl:w-[5.07vw] flex-shrink-0 md:ml-2',
            PRODUCT_IMAGE_RATIO,
          )}
        >
          {merchandise.image && (
            <Link to={`/products/${merchandise.product.handle}`}>
              <Image
                data={merchandise.image}
                width={866}
                height={1300}
                alt={merchandise.title}
              />
            </Link>
          )}
        </div>
        {/* Title */}
        <div className="flex flex-1 flex-col">
          <div
            role="cell"
            className="flex-grow-1 mr-4 flex w-full flex-col items-start"
          >
            <Link
              to={`/products/${merchandise.product.handle}`}
              className="leading-none hover:underline"
            >
              {merchandise.product.title}
            </Link>

            {/* Options */}
            {!hasDefaultVariantOnly && (
              <span className="">
                {merchandise.selectedOptions
                  .slice(0)
                  .reverse()
                  .map(({name, value}, index) => (
                    <span key={name}>
                      {name !== 'Color' && name} {value}
                      {index < merchandise.selectedOptions.length - 1 && ', '}
                    </span>
                  ))}
              </span>
            )}
          </div>

          <div className="md:hidden">
            <CartItemQuantity line={lineItem} submissionQuantity={updating} />
          </div>

          <div role="cell" className="mt-3 self-start">
            <ItemRemoveButton lineIds={[lineItem.id]} />
          </div>
        </div>
      </div>

      {/* Quantity */}
      <div className="col-span-3 hidden md:block">
        <CartItemQuantity line={lineItem} submissionQuantity={updating} />
      </div>
      {/* Price */}
      <div className="absolute bottom-2 right-0 col-span-1 flex justify-end p-2 text-right md:text-left leading-none md:relative">
      <span className='md:w-[5.5em] px-2'>
        {updating ? (
          <SpinnerIcon width={24} height={24} />
        ) : (
          <Money data={lineItem.cost.totalAmount} />
        )}
      </span>
      </div>
    </li>
  );
}

function CartItemQuantity({
  line,
  submissionQuantity,
}: {
  line: CartLine | ComponentizableCartLine;
  submissionQuantity: number | undefined;
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;

  // // The below handles optimistic updates for the quantity
  const lineQuantity = submissionQuantity ? submissionQuantity : quantity;

  const prevQuantity = Number(Math.max(0, lineQuantity - 1).toFixed(0));
  const nextQuantity = Number((lineQuantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-2">
      <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          value={prevQuantity}
          disabled={quantity <= 1}
        >
          <MinusIcon />
        </button>
      </UpdateCartButton>

      <div className="min-w-[1rem] text-center text-black">{lineQuantity}</div>

      <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button aria-label="Increase quantity" value={prevQuantity}>
          <PlusIcon />
        </button>
      </UpdateCartButton>
    </div>
  );
}

function UpdateCartButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function ItemRemoveButton({lineIds}: {lineIds: CartLine['id'][]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className="disabled:pointer-events-all disabled:cursor-wait"
        type="submit"
      >
        Remove
      </button>
    </CartForm>
  );
}

export function CartSummary({cost}: {cost: CartCost}) {
  return (
    <>
      <div role="table" className="pr-2 2xl:ml-[7.25vw]" aria-label="Cost summary">
        <div className="flex justify-between pb-8 pt-1" role="row">
          <span role="rowheader">Subtotal</span>
          <span role="cell" className=" md:w-[5.5em] px-2">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>

        {/* <div
          role="row"
          className="flex justify-between border-t border-gray p-4"
        >
          <span role="rowheader">
            Shipping
          </span>
          <span role="cell">
            Calculated at checkout
          </span>
        </div> */}
      </div>
    </>
  );
}

export function CartActions({cart}: {cart: Cart}) {
  const [root] = useMatches();

  if (!cart || !cart.checkoutUrl) return null;

  // const storeDomain = root?.data?.storeDomain;

  // const shopPayLineItems = flattenConnection(cart.lines).map((line) => ({
  //   id: line.merchandise.id,
  //   quantity: line.quantity,
  // }));

  return (
    <div className="flex w-full flex-col gap-3">
      {/* <ShopPayButton
        className={clsx([defaultButtonStyles({tone: 'shopPay'})])}
        variantIdsAndQuantities={shopPayLineItems}
        storeDomain={storeDomain}
      /> */}
      <Button to={cart.checkoutUrl} className={clsx([defaultButtonStyles()], '!max-w-none')}>
        Checkout
      </Button>
    </div>
  );
}
