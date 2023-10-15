import {DocumentIcon} from '@sanity/icons'
import {defineField} from 'sanity'

import {validateSlug} from '../../utils/validateSlug'

export default defineField({
  name: 'archive',
  title: 'Archive',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'theme',
      title: 'Theme',
    },
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
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
    // Category
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    // Body
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
      group: 'editorial',
    }),
     // Modules
     defineField({
        name: 'modules',
        title: 'Modules',
        type: 'array',
        of: [
          {type: 'module.image'},
        ],
        group: 'editorial',
      }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      active: 'active',
      seoImage: 'seo.image',
      title: 'title',
    },
    prepare(selection) {
      const {seoImage, title} = selection

      return {
        media: seoImage,
        title,
      }
    },
  },
})
