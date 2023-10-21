import {SchemaIcon} from '@sanity/icons'
import {defineField} from 'sanity'
import {validateSlug} from '../../utils/validateSlug'

export default defineField({
  name: 'sizeChart',
  title: 'Size Chart',
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
    }),
    defineField({
      // Include the table as a field
      // Giving it a semantic title
      name: 'sizeChart',
      title: 'Size Chart',
      type: 'table',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
