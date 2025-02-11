import { TextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'module.portableTable',
  title: 'Table',
  type: 'document',
  icon: TextIcon,

  fields: [
    defineField({
      name: 'noPadding',
      type: 'boolean',
      title: 'No Padding?',
      description: 'Toggle this on to remove bottom padding'
    }),
    defineField({
      name: 'columns',
      type: 'string',
      title: 'Column(s)',
      options: {
        list: Array.from({ length: 7 }, (_, i) => ({
          title: `${i + 2}`, // Start from 2
          value: `${i + 2}`,
        })),
        layout: 'dropdown',
      },
    }),
    ...Array.from({ length: 8 }, (_, i) =>
      defineField({
        name: `body${i + 1}`,
        title: `Cell ${i + 1}`,
        type: 'tableCell',
        hidden: ({ parent }) => parent?.columns && parseInt(parent.columns, 10) < i + 1,
      })
    ),
  ],

  preview: {
    select: {
      subtitle: 'columns',
      firstCell: 'body1.0.children.0.text', // Selects the first text content of body1
    },
    prepare({ subtitle, firstCell }) {
      return {
        title: firstCell || 'Untitled',
        // subtitle: `Columns: ${subtitle}`,
      };
    },
  },
});
