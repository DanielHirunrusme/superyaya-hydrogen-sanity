import Button from '../elements/Button';
import {useMemo, useCallback, useState} from 'react';
import {useFetcher, type Form as FormType} from '@remix-run/react';
import {Disclosure} from '@headlessui/react';
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
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState(0);

  const onInputFileChange = (e) => {
    console.log(e.target.files.length);
    setFiles(e.target.files.length);
    // console.log('Input File Change', e.target.files.length);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setSending(true);
    fetch('https://getform.io/f/c3520d34-5135-449b-8d7e-fa61ef182790', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        setSending(false);
        setSuccess(true);
      })
      .catch((error) => {
        setSending(false);
        setError(true);
      });
  };

  if (!success) {
    return (
      <>
        <p>
          PLEASE ENTER YOUR CUSTOM REQUESTS USING THE FORM BELOW, ONCE WE’VE
          RECEIVED YOUR REQUEST WE WILL GET BACK TO YOU WITH A QUOTE. PLEASE
          NOTE CUSTOM REQUESTS ARE SUBJECT TO LONGER PRODUCTION AND DELIVERY
          TIME.
        </p>
        <form
          action="/api/custom-request"
          acceptCharset="UTF-8"
          id="form"
          onSubmit={onSubmit}
          className="w-full gap-0 pt-[1em]"
        >
          <Disclosure defaultOpen>
            {({open}) => (
              <>
                <fieldset className="gap-[.75em]">
                  <Disclosure.Button className=" flex gap-4 hover:opacity-50">
                    <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
                    <label htmlFor="message">Special Requirements*</label>
                  </Disclosure.Button>
                  <Disclosure.Panel className="flex flex-col gap-4 pb-8">
                    <textarea
                      name="message"
                      required
                      className="w-full hover:opacity-50 focus:outline-none"
                      placeholder="Specify any special requirements"
                      rows={10}
                    />
                    <div className="flex flex-col gap-[.75em]">
                      <span>Images References (optional)</span>
                      <label
                        className="relative flex h-[11.7948vw] cursor-pointer items-center border border-black  hover:opacity-50 md:h-auto"
                        htmlFor="file"
                      >
                        <span className="p-[1em]">
                          {files === 0 ? (
                            <span className="opacity-50">
                              Click or drag file to upload
                            </span>
                          ) : (
                            `(${files}) Image${files > 1 ? 's' : ''} added`
                          )}
                        </span>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 transform p-[1em]">
                          <ArrowUpload />
                        </span>
                      </label>
                      <input
                        type="file"
                        onChange={onInputFileChange}
                        id="file"
                        name="file"
                        className="hidden"
                        multiple
                      />
                    </div>
                  </Disclosure.Panel>
                </fieldset>
              </>
            )}
          </Disclosure>
          {/* Contact Details */}
          <Disclosure defaultOpen>
            {({open}) => (
              <>
                <Disclosure.Button className=" flex gap-4 hover:opacity-50">
                  <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
                  <h4>Contact Details</h4>
                </Disclosure.Button>
                <Disclosure.Panel className="flex flex-col gap-4 pb-8 pt-4">
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
                    <input
                      placeholder="Phone"
                      type="phone"
                      name="phone"
                      required
                    />
                  </fieldset>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          {/* Measurements */}
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className=" flex gap-4 hover:opacity-50">
                  <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
                  <h4>Measurements</h4>
                </Disclosure.Button>
                <Disclosure.Panel className="flex flex-col gap-4 pb-8 pt-4">
                  <div className="flex gap-4">
                    <fieldset className="flex-1 gap-[.75em]">
                      <label htmlFor="bust">Bust (cm)</label>
                      <input
                        placeholder="Bust"
                        type="text"
                        name="bust"
                        required
                      />
                    </fieldset>
                    <fieldset className="flex-1 gap-[.75em]">
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
                    <fieldset className="flex-1 gap-[.75em]">
                      <label htmlFor="bust">Hips (cm)</label>
                      <input
                        placeholder="Hips"
                        type="text"
                        name="hips"
                        required
                      />
                    </fieldset>
                    <fieldset className="flex-1 gap-[.75em]">
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

          {/* Shipping Details */}
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className=" flex gap-4 hover:opacity-50">
                  <span className="w-3">{!open ? '+' : <>&ndash;</>}</span>
                  <h4>Shipping Details</h4>
                </Disclosure.Button>
                <Disclosure.Panel className="flex flex-col gap-4 pb-8 pt-4">
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
                    <fieldset className="flex-1 gap-[.75em]">
                      <label htmlFor="firstName">City</label>
                      <input
                        placeholder="City"
                        type="text"
                        name="city"
                        required
                      />
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
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          {/* Please specify your delivery date */}
          <Disclosure>
            {({open}) => (
              <>
                <div className="flex gap-4">
                  <fieldset className="flex-1 gap-[.75em]">
                    <Disclosure.Button className=" flex gap-4 hover:opacity-50">
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

          {/* <fieldset className='gap-[.75em]'>
        <label htmlFor="subject">Subject</label>
        <input type="subject" name="subject" required />
      </fieldset> */}
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
                {!sending ? 'Submit' : 'Sending...'}
              </Button>
            </div>
          </Container>
        </form>
      </>
    );
  } else {
    return (
      <div className="gap-0 pt-[1em]">
        <p>Thank you for your message. We will get back to you shortly.</p>
      </div>
    );
  }
}
