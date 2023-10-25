import {ListItemBuilder} from 'sanity/desk'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Collaboration')
    .schemaType('collaboration')
    .child(
      S.editor().title('Collaboration').schemaType('collaboration').documentId('collaboration')
    )
)
