import {type Form as FormType, useFetcher} from '@remix-run/react';
import {useState} from 'react';

import Button from '../elements/Button';
import {Container} from '../global/Container';
import {ArrowUpload} from '../icons/ArrowUpload';

type CustomText = {text: string};

type RenderLeafProps = {
  attributes: Record<string, any>;
  children: React.ReactNode;
  leaf: CustomText & {
    italic?: boolean;
    bold?: boolean;
  };
  text: CustomText;
};

type Props = {
  label?: string;
  cartLines?: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          product: {
            title: string;
            handle: string;
          };
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      };
    }>;
  };
  onFormSuccess?: () => void;
};

export default function CartInquireForm(props: Props) {
  const {label, cartLines, onFormSuccess} = props;
  const {Form, ...fetcher} = useFetcher();
  const data = fetcher?.data as
    | {form?: boolean; error?: {message: string}}
    | undefined;
  const formSubmitted = data?.form;
  const formError = data?.error;
  return (
    <>
      {formSubmitted ? (
        <div className="text-center">
          <p>Thank you for your inquiry. We will get back to you shortly.</p>
        </div>
      ) : (
        <EmailForm
          Form={Form}
          cartLines={cartLines}
          onFormSuccess={onFormSuccess}
        />
      )}
      {formError && (
        <div>
          <p>There was an error submitting your inquiry. Please try again.</p>
          <p>{formError.message}</p>
        </div>
      )}
    </>
  );
}

function EmailForm({
  Form,
  cartLines,
  onFormSuccess,
}: {
  Form: typeof FormType;
  cartLines?: Props['cartLines'];
  onFormSuccess?: () => void;
}) {
  const yyyyMmDd = new Date().toISOString().split('T')[0];
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState(0);

  const onInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files?.length || 0);
  };

  // Structure cart data for getform
  const formatCartData = () => {
    if (!cartLines?.edges) return '';

    return cartLines.edges
      .map(({node}) => {
        const {merchandise, quantity} = node;
        const options = merchandise.selectedOptions
          .map((option) => `${option.name}: ${option.value}`)
          .join(', ');

        return `${merchandise.product.title} - ${merchandise.title} (${options}) - Qty: ${quantity} - $${merchandise.price.amount}`;
      })
      .join('\n');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Add cart data to form submission
    const cartData = formatCartData();
    if (cartData) {
      formData.append('cartItems', cartData);
    }

    setSending(true);
    fetch('https://getform.io/f/avrmpxra', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        setSending(false);
        setSuccess(true);
        onFormSuccess?.();
      })
      .catch((error) => {
        setSending(false);
        setError(true);
      });
  };

  if (!success) {
    return (
      <>
        <form
          action="/api/custom-request"
          acceptCharset="UTF-8"
          id="form"
          onSubmit={onSubmit}
          className="w-full gap-0 pt-[1em]"
        >
          {/* Contact Details */}
          <div className="flex flex-col gap-4 pb-8">
            <h4 className="text-center">Contact Details</h4>
            <fieldset className="gap-[.75em]">
              <label htmlFor="email">E-mail Address*</label>
              <input
                placeholder="E-mail Address"
                type="email"
                name="email"
                required
              />
            </fieldset>
            <fieldset className="gap-[.75em]">
              <label htmlFor="phone">Phone</label>
              <input placeholder="Phone" type="phone" name="phone" required />
            </fieldset>
          </div>

          {/* Shipping Details */}
          <div className="flex flex-col gap-4 pb-8">
            <h4 className="text-center">Shipping Details</h4>
            <div className="flex gap-4">
              <fieldset className="flex-1 gap-[.75em]">
                <label htmlFor="firstName">First name</label>
                <input
                  placeholder="First name"
                  type="text"
                  name="firstName"
                  required
                />
              </fieldset>
              <fieldset className="flex-1 gap-[.75em]">
                <label htmlFor="lastName">Last name</label>
                <input
                  placeholder="Last name"
                  type="text"
                  name="lastName"
                  required
                />
              </fieldset>
            </div>
            <fieldset className="gap-[.75em]">
              <label htmlFor="address">Address</label>
              <input
                placeholder="Address Line 1"
                type="text"
                name="address"
                required
              />
            </fieldset>
            <fieldset className="gap-[.75em]">
              <label htmlFor="address">Apartment, Suite, Etc. (Optional)</label>
              <input
                placeholder="Address Line 2"
                type="text"
                name="addressLine2"
              />
            </fieldset>

            <div className="flex gap-4">
              <fieldset className="flex-1 gap-[.75em]">
                <label htmlFor="firstName">City</label>
                <input placeholder="City" type="text" name="city" required />
              </fieldset>
              <fieldset className="flex-1 gap-[.75em]">
                <label htmlFor="postal">Postal/Zip Code</label>
                <input
                  placeholder="Postal/Zip Code"
                  type="text"
                  name="postal"
                  required
                />
              </fieldset>
            </div>

            <fieldset className="gap-[.75em]">
              <label htmlFor="country">Country</label>
              <input
                placeholder="Country"
                type="text"
                name="country"
                required
              />
            </fieldset>
          </div>

          <input type="text" hidden name="date" defaultValue={yyyyMmDd} />

          {/*  add hidden Honeypot input to prevent spams */}
          <input
            type="hidden"
            name="_gotcha"
            style={{display: 'none !important'}}
          />

          <Container type="pdpForm">
            <div className="mt-7 flex gap-4">
              <Button className="flex-1" type="submit" disabled={sending}>
                {!sending ? 'Submit Inquiry' : 'Sending...'}
              </Button>
            </div>
          </Container>
        </form>
      </>
    );
  } else {
    return (
      <div className="gap-0 pt-[1em] text-center">
        <p>Thank you for your inquiry. We will get back to you shortly.</p>
      </div>
    );
  }
}
