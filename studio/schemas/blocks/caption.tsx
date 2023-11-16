import {defineField} from 'sanity'

export default defineField({
  name: 'caption',
  title: 'Caption',
  type: 'array',
  of: [
    {
      // Styles
      styles: [],
      // Lists
      lists: [],
      // Marks
      marks: {
        // Decorators
        decorators: [],
        // Annotations
        annotations: [
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
  ],
})
