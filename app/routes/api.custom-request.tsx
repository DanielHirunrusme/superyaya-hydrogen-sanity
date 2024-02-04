import invariant from 'tiny-invariant';
import {json, type ActionArgs} from '@shopify/remix-oxygen';

export async function action({request}: ActionArgs) {
  const formData = await request.formData();

  const fields = Object.fromEntries(formData);

  invariant(fields.name, 'Name is required');
  invariant(fields.email, 'Email is required');
  invariant(fields.subject, 'Subject is required');
  invariant(fields.message, 'Message is required');

  fetch('https://getform.io/f/c3520d34-5135-449b-8d7e-fa61ef182790', {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));

  return json({form: fields});
}
