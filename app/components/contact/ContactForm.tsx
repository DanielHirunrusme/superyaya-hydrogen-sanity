import Button from '../elements/Button';
import {useMemo, useCallback, useState} from 'react';
import {useFetcher, type Form as FormType} from '@remix-run/react';
import {Disclosure} from '@headlessui/react';

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
};

export default function ContactForm(props: Props) {
  const {label} = props;
  const {Form, ...fetcher} = useFetcher();
  const data = fetcher?.data;
  const formSubmitted = data?.form;
  const formError = data?.error;
  const [open, setOpen] = useState(false);
  return (
    <>
      {formSubmitted ? (
        <div>
          <p>Thank you for your message. We will get back to you shortly.</p>
        </div>
      ) : (
        <EmailForm Form={Form} setOpen={setOpen} />
      )}
      {formError && (
        <div>
          <p>There was an error submitting your message. Please try again.</p>
          <p>{formError.message}</p>
        </div>
      )}
    </>
  );
}

function EmailForm({
  Form,
  setOpen,
}: {
  Form: typeof FormType;
  setOpen: (boolean) => void;
}) {
  const yyyyMmDd = new Date().toISOString().split('T')[0];
  return (
    <Form action="/api/contact" method="post" className="pt-[1em]">
      <Disclosure defaultOpen>
        {({open}) => (
          <>
            <fieldset>
              <Disclosure.Button className="flex gap-4">
                <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
                <label htmlFor="message">Special Requirements</label>
              </Disclosure.Button>
              <Disclosure.Panel className="flex flex-col gap-4 pb-8">
                <textarea
                  name="message"
                  required
                  className="w-full"
                  placeholder="Specify any special requirements"
                  rows={10}
                />
              </Disclosure.Panel>
            </fieldset>
          </>
        )}
      </Disclosure>
      {/* Measurements */}
      <Disclosure>
        {({open}) => (
          <>
            <Disclosure.Button className="flex gap-4">
              <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
              <h4>Measurements</h4>
            </Disclosure.Button>
            <Disclosure.Panel className="flex flex-col gap-4 pb-8">
              <div className="flex gap-4">
                <fieldset className="flex-1">
                  <label htmlFor="bust">Bust (cm)</label>
                  <input placeholder="Bust" type="text" name="bust" required />
                </fieldset>
                <fieldset className="flex-1">
                  <label htmlFor="waist">Waist (cm)</label>
                  <input
                    placeholder="Waist"
                    type="text"
                    name="waist"
                    required
                  />
                </fieldset>
              </div>

              <div className="flex gap-4">
                <fieldset className="flex-1">
                  <label htmlFor="bust">Hips (cm)</label>
                  <input placeholder="Hips" type="text" name="hips" required />
                </fieldset>
                <fieldset className="flex-1">
                  <label htmlFor="waist">Height (cm)</label>
                  <input
                    placeholder="Height"
                    type="text"
                    name="height"
                    required
                  />
                </fieldset>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {/* Contact Details */}
      <Disclosure>
        {({open}) => (
          <>
            <Disclosure.Button className="flex gap-4">
              <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
              <h4>Contact Details</h4>
            </Disclosure.Button>
            <Disclosure.Panel className="flex flex-col gap-4 pb-8">
              <fieldset>
                <label htmlFor="email">E-mail Address</label>
                <input
                  placeholder="E-mail Address"
                  type="email"
                  name="email"
                  required
                />
              </fieldset>
              <fieldset>
                <label htmlFor="phone">Phone</label>
                <input placeholder="Phone" type="phone" name="phone" required />
              </fieldset>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {/* Shipping Details */}
      <Disclosure>
        {({open}) => (
          <>
            <Disclosure.Button className="flex gap-4">
              <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
              <h4>Shipping Details</h4>
            </Disclosure.Button>
            <Disclosure.Panel className="flex flex-col gap-4 pb-8">
              <fieldset>
                <label htmlFor="country">Country</label>
                <input
                  placeholder="Country"
                  type="text"
                  name="country"
                  required
                />
              </fieldset>
              <div className="flex gap-4">
                <fieldset className="flex-1">
                  <label htmlFor="firstName">First name</label>
                  <input
                    placeholder="First name"
                    type="text"
                    name="firstName"
                    required
                  />
                </fieldset>
                <fieldset className="flex-1">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    placeholder="Last name"
                    type="text"
                    name="lastName"
                    required
                  />
                </fieldset>
              </div>
              <fieldset>
                <label htmlFor="address">Address</label>
                <input
                  placeholder="Address Line 1"
                  type="text"
                  name="address"
                  required
                />
              </fieldset>
              <fieldset>
                <label htmlFor="address">
                  Apartment, Suite, Etc. (Optional)
                </label>
                <input
                  placeholder="Address Line 2"
                  type="text"
                  name="addressLine2"
                />
              </fieldset>

              <div className="flex gap-4">
                <fieldset className="flex-1">
                  <label htmlFor="firstName">City</label>
                  <input placeholder="City" type="text" name="city" required />
                </fieldset>
                <fieldset className="flex-1">
                  <label htmlFor="postal">Postal/Zip Code</label>
                  <input
                    placeholder="Postal/Zip Code"
                    type="text"
                    name="postal"
                    required
                  />
                </fieldset>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {/* Please specify your delivery date */}
      <Disclosure>
        {({open}) => (
          <>
            <div className="flex gap-4">
              <fieldset className="flex-1">
                <Disclosure.Button className="flex gap-4">
                  <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
                  <label htmlFor="postal">
                    Please specify your delivery date
                  </label>
                </Disclosure.Button>
                <Disclosure.Panel className="flex flex-col gap-4 pb-8">
                  <input
                    placeholder="Delivery Date"
                    type="text"
                    name="postal"
                    required
                  />
                </Disclosure.Panel>
              </fieldset>
            </div>
          </>
        )}
      </Disclosure>

      {/* <fieldset>
        <label htmlFor="subject">Subject</label>
        <input type="subject" name="subject" required />
      </fieldset> */}
      <input type="text" hidden name="date" defaultValue={yyyyMmDd} />

      <div className="mt-4 flex gap-4">
        <Button className="flex-1" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
}
