import {SchemaIcon, TextIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.textBlock',
  title: 'Text Block',
  type: 'document',
  icon: TextIcon,

  fields: [
    // Title
    defineField({
      name: 'noPadding',
      title: 'Remove padding from below block?',
      type: 'boolean',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      // Include the table as a field
      // Giving it a semantic title
      name: 'body',
      title: 'Body',
      type: 'body',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
