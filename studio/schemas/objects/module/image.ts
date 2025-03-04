import {ImageIcon} from '@sanity/icons'
import {defineField} from 'sanity'

const VARIANTS = [
  {title: 'Simple', value: undefined},
  {title: 'Caption', value: 'caption'},
  // {title: 'Call to action', value: 'callToAction'},
  {title: 'Product hotspots', value: 'productHotspots'},
  // {title: 'Product tags', value: 'productTags'},
]

const IMAGE_SIZES = [
  {title: 'Small', value: 'small'},
  {title: 'Default', value: undefined},
  {title: 'Full: Contain', value: 'contain'},
  {title: 'Full: Cover', value: 'full'},
]

export default defineField({
  name: 'module.image', 
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
    // Variant
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: VARIANTS,
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
    // Caption
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'caption',
      // hidden: ({parent}) => parent.variant !== 'caption',
    }),
    // Call to action
    defineField({
      name: 'callToAction',
      title: 'Call to action',
      type: 'imageCallToAction',
      hidden: ({parent}) => parent.variant !== 'callToAction',
    }),
    // Product hotspots
    defineField({
      name: 'productHotspots',
      title: 'Hotspots',
      type: 'productHotspots',
      hidden: ({parent}) => parent.variant !== 'productHotspots',
    }),
    // Product tags
    defineField({
      name: 'productTags',
      title: 'Products',
      type: 'array',
      hidden: ({parent}) => parent.variant !== 'productTags',
      of: [
        {
          name: 'productWithVariant',
          title: 'Product + Variant',
          type: 'productWithVariant',
        },
      ],
    }),
    defineField({
      name: 'addMobileImage',
      title: 'Add mobile image?',
      description: 'Toggle this to add a mobile image',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => !parent.addMobileImage,
    }),
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
      fileName: 'image.asset.url',
      image: 'image',
      variant: 'variant',
    },
    prepare(selection) {
      const {fileName, image, variant} = selection
      const currentVariant = VARIANTS.find((v) => v.value === variant)

      return {
        media: image,
        subtitle: 'Image' + (currentVariant ? ` [${currentVariant.title}]` : ''),
        title: fileName,
      }
    },
  },
})
