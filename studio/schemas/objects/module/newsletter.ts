import {defineField} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'
export default defineField({
  name: 'module.newsletter',
  title: 'Newsletter',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      description:
        'URL to the newsletter such as https://super-yaya.us10.list-manage.com/subscribe/post?u=c981ccd93fdea8e390a1a6496&amp;id=d47311f66d&amp;f_id=008b4ce4f0',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
