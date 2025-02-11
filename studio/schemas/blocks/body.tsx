import {defineField} from 'sanity'
import {GrSubscript, GrSuperscript} from 'react-icons/gr'
const SuperscriptDecorator = (props:any) => (
  <sup>{props.children}</sup>
)
const SubscriptDecorator = (props:any) => (
  <sub>{props.children}</sub>
)

export default defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    {
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {
            title: 'Italic',
            value: 'em',
          },
          {
            title: 'Strong',
            value: 'strong',
          },
          {
            title: 'Superscript',
            value: 'sup',
            icon: GrSuperscript, 
            component: SuperscriptDecorator
          },
        ],
        annotations: [
          // product
          {
            name: 'annotationProduct',
            type: 'annotationProduct',
          },
          // Email
          {
            name: 'annotationLinkEmail',
            type: 'annotationLinkEmail',
          },
          // Internal link
          {
            name: 'annotationLinkInternal',
            type: 'annotationLinkInternal',
          },
          // URL
          {
            name: 'annotationLinkExternal',
            type: 'annotationLinkExternal',
          },
        ],
      },
      // Paragraphs
      type: 'block',
    },
    {
      type: 'module.image',
    },
    // Custom blocks
    // {
    //   type: 'module.accordion',
    // },
    // {
    //   type: 'module.callout',
    // },
    // {
    //   type: 'module.grid',
    // },
    // {
    //   type: 'module.images',
    // },
    // {
    //   type: 'module.instagram',
    // },
    // {
    //   type: 'module.products',
    // },
    {
      type: 'module.newsletter',
    },
    {
      type: 'module.table',
    },
    {
      type: 'module.portableTable'
    }
  ],
})
