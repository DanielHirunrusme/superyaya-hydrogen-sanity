import {ImageIcon} from '@sanity/icons'
import {defineField} from 'sanity'



export default defineField({
    name: 'module.gallery',
    title: 'Gallery',
    type: 'object',
    icon: ImageIcon,
    fields: [
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{type: 'module.image'}],
        }),
    ]
})