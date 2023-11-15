import {ImageIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.gallery',
  title: '2-Up Images',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'module.image'}],
    }),
    // Caption
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
      // hidden: ({parent}) => parent.variant !== 'caption',
    }),
    // Text color
    // defineField({
    //   name: 'text',
    //   title: 'Text',
    //   type: 'color',
    //   options: {disableAlpha: true},
    // }),
    // Background color
    defineField({
      name: 'background',
      title: 'Background',
      type: 'color',
      options: {disableAlpha: true},
    }),
  ],
})
