import Button from '../elements/Button';
import {useMemo, useCallback, useState} from 'react';
import {useFetcher, type Form as FormType} from '@remix-run/react';

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
  label: string;
};

export default function ContactFormModal(props: Props) {
  const {label} = props;
  const {Form, ...fetcher} = useFetcher();
  const data = fetcher?.data;
  const formSubmitted = data?.form;
  const formError = data?.error;
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && <Button onClick={()=>setOpen(true)} className="w-full">{label}</Button>}
      {open && <div className="">
        {formSubmitted ? (
          <div>
            <p>Thank you for your message. We will get back to you shortly.</p>
          </div>
        ) : (
          <ContactForm Form={Form} setOpen={setOpen} />
        )}
        {formError && (
          <div>
            <p>There was an error submitting your message. Please try again.</p>
            <p>{formError.message}</p>
          </div>
        )}
      </div>}
    </>
  );
}

function ContactForm({Form, setOpen}: {Form: typeof FormType, setOpen: (boolean)=>void}) {
  const yyyyMmDd = new Date().toISOString().split('T')[0];
  return (
    <Form action="/api/contact" method="post" className='pt-2 max-w-sm'>
      <fieldset>
        <label htmlFor="name">Name</label>
        <input placeholder="Name" type="text" name="name" required />
      </fieldset>
      <fieldset>
        <label htmlFor="email">Email</label>
        <input placeholder="Email" type="email" name="email" required />
      </fieldset>
      {/* <fieldset>
        <label htmlFor="subject">Subject</label>
        <input type="subject" name="subject" required />
      </fieldset> */}
      <input type="text" hidden name="date" defaultValue={yyyyMmDd} />
      <fieldset>
      <label htmlFor="message">Special Requirements</label>
      <textarea name="message" required placeholder="Specify any special requests" />
      </fieldset>
      <div className="flex gap-4 mt-4">
        <Button className='flex-1' onClick={()=>setOpen(false)}>Close</Button>
        <Button className='flex-1' type="submit">Send</Button>
      </div>
    </Form>
  );
}
