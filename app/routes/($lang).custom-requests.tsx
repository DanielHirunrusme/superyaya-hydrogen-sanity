import ContactForm from '~/components/contact/ContactForm';

export default function CustomRequestsPage() {
  return (
    <div className='max-w-[1056px] 2xl:max-w-desktopContainer w-full mx-auto'>
        <p>PLEASE ENTER YOUR CUSTOM REQUESTS USING THE FORM BELOW, ONCE WE’VE RECEIVED YOUR REQUEST WE WILL GET BACK TO YOU WITH A QUOTE. PLEASE NOTE CUSTOM REQUESTS ARE SUBJECT TO LONGER PRODUCTION AND DELIVERY TIME.</p>
      <ContactForm />
    </div>
  );
}
