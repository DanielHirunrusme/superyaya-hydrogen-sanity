import {SchemaIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.table',
  title: 'Table',
  type: 'document',
  icon: SchemaIcon,

  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
      // Include the table as a field
      // Giving it a semantic title
      name: 'table',
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
