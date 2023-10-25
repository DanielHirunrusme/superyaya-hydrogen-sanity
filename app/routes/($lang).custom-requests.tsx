import ContactForm from '~/components/contact/ContactForm';
import {Container} from '~/components/global/Container';

export default function CustomRequestsPage() {
  return (
    <Container asChild type="customRequest">
      <div className="mx-auto">
        <p>
          PLEASE ENTER YOUR CUSTOM REQUESTS USING THE FORM BELOW, ONCE WE’VE
          RECEIVED YOUR REQUEST WE WILL GET BACK TO YOU WITH A QUOTE. PLEASE
          NOTE CUSTOM REQUESTS ARE SUBJECT TO LONGER PRODUCTION AND DELIVERY
          TIME.
        </p>
        <ContactForm />
      </div>
    </Container>
  );
}
