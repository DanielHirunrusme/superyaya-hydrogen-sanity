import {ActivityIcon} from '@sanity/icons'
import {defineField} from 'sanity'

import {validateSlug} from '../../utils/validateSlug'

export default defineField({
  name: 'radio',
  title: 'Radio',
  type: 'document',
  icon: ActivityIcon,
  groups: [
    // {
    //   name: 'theme',
    //   title: 'Theme',
    // },
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
    // Mux
    // Slug
    defineField({
      name: 'video',
      type: 'mux.video',
      validation: (Rule) => Rule.required(),
    }),
    // Title
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),

    // Contributors
    defineField({
      name: 'contributors',
      title: 'Contributor(s)',
      type: 'array',
      of:[{
        title: 'Name',
        name: 'name',
        type: 'string'
      }],
      validation: (Rule) => Rule.required(),
    }),
    
    // Body
    // defineField({
    //   name: 'body',
    //   title: 'Body',
    //   type: 'body',
    //   group: 'editorial',
    // }),
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
