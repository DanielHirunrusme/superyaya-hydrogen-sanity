import {defineField} from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'
export default defineField({
    name: 'module.newsletter',
    title: 'Newsletter',
    type: 'object',
    icon: EnvelopeIcon,
    fields: [
        defineField({
            name: 'url',
            title: 'URL',
            description: 'URL to the newsletter such as https://super-yaya.us17.list-manage.com/subscribe/post?u=01e5abf41e3fbcb402dc71410&amp;id=db256d07f4&amp;f_id=00315ce0f0',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
    ]
})