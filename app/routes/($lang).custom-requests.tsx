import ContactForm from '~/components/contact/ContactForm';
import {Container} from '~/components/global/Container';

export default function CustomRequestsPage() {
  return (
    <Container asChild type="customRequest">
      <div className="mx-auto">
        
        <ContactForm />
      </div>
    </Container>
  );
}
