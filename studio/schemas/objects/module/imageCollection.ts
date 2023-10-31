import {ImageIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.imageCollection',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    // Image
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    // Caption
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
      // hidden: ({parent}) => parent.variant !== 'caption',
    }),
    defineField({
        name: 'reference',
        title: 'Reference',
        type: 'reference',
        to: [{type: 'product'}],
    }),
  ],
  preview: {
    select: {
      fileName: 'image.asset.originalFilename',
      image: 'image',
    },
    prepare(selection) {
      const {fileName, image, variant} = selection

      return {
        media: image,
        // subtitle: 'Image' + (currentVariant ? ` [${currentVariant.title}]` : ''),
        title: fileName,
      }
    },
  },
})
