'use client';
import {useFormFields, useMailChimpForm} from 'use-mailchimp-form';

type Props = {
  url: string;
};

export default function Newsletter(props: Props) {
  const url =
    props.url ||
    'https://super-yaya.us17.list-manage.com/subscribe/post?u=01e5abf41e3fbcb402dc71410&amp;id=db256d07f4&amp;f_id=00315ce0f0';
  // The useFormFields is not necessary. You can use your own form component.

  // The url looks like the url below:
  // https://aaaaaaaaa.us20.list-manage.com/subscribe/post?u=xxxxxxxxxxxxxxxxxx&amp;id=yyyyyyyyyy
  const {loading, error, success, message, handleSubmit} =
    useMailChimpForm(url);
  const {fields, handleFieldChange} = useFormFields({
    EMAIL: '',
  });
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(fields);
        }}
        className="relative mb-2 !block border-b border-black pb-[2px]"
      >
        <input
          id="EMAIL"
          placeholder="ENTER E-MAIL ADDRESS"
          type="email"
          value={fields.EMAIL}
          onChange={handleFieldChange}
          className="!h-auto w-full border-none bg-transparent !p-0 outline-none autofill:bg-white"
        />
        <button className="absolute right-0 hover:opacity-50 active:opacity-50">SUBMIT</button>
      </form>
      {loading && 'submitting'}
      {error && message}
      {success && message}
    </div>
  );
}
