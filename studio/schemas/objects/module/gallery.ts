// import {ImageIcon} from '@sanity/icons'
import {ThLargeIcon} from '@sanity/icons'
import {defineField} from 'sanity'

const IMAGE_SIZES = [
  {title: 'Small', value: 'small'},
  {title: 'Default', value: undefined},
]

export default defineField({
  name: 'module.gallery',
  title: 'Image Grid',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      description: 'Add 2 or 4 images',
      type: 'array',
      of: [{type: 'module.image'}],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    // Caption
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'caption',
      // hidden: ({parent}) => parent.variant !== 'caption',
    }),
    // Layout
    defineField({
      name: 'mobileStack',
      title: 'Mobile: Stack',
      description: 'How should the images stack on mobile?',
      type: 'string',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: ['Horizontal', 'Vertical'],
      },
      initialValue: undefined,
    }),
     // Variant
     defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: IMAGE_SIZES,
      },
      initialValue: undefined,
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
  preview: {
    select: {
      images: 'images',
      thumbnail: 'images.0.image',
      caption: 'caption',
    },
    prepare({images, caption, thumbnail}) {
      return {
        title: 'Image Grid',
        subtitle: `${caption}`,
        // media: thumbnail,
      }
    },
  },
})
