import {SchemaIcon} from '@sanity/icons'
import {defineField} from 'sanity'

import {validateSlug} from '../../utils/validateSlug'

export default defineField({
  name: 'route',
  title: 'Route',
  type: 'document',
  icon: SchemaIcon,
  
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    // Slug
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      // @ts-ignore - TODO - fix this TS error
      validation: validateSlug,
      // readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
