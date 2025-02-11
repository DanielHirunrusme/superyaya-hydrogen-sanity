import { defineField } from 'sanity';
import { GrSubscript, GrSuperscript } from 'react-icons/gr';
import { MdEmail } from 'react-icons/md'; // Email icon

const SuperscriptDecorator = (props: any) => <sup>{props.children}</sup>;
const SubscriptDecorator = (props: any) => <sub>{props.children}</sub>;

export default defineField({
  name: 'tableCell',
  title: 'Cell',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        decorators: [
          { title: 'Italic', value: 'em' },
          { title: 'Strong', value: 'strong' },
          {
            title: 'Superscript',
            value: 'sup',
            icon: GrSuperscript,
            component: SuperscriptDecorator,
          },
        ],
        annotations: [
          // Internal link
          { name: 'annotationLinkInternal', type: 'annotationLinkInternal' },

          // URL link
          { name: 'annotationLinkExternal', type: 'annotationLinkExternal' },

          // Email link
          {
            name: 'annotationLinkEmail',
            type: 'annotationLinkEmail',
             
          },
        ],
      },
    },
  ],
});
