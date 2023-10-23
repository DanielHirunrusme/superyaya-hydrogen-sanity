import {ListItemBuilder} from 'sanity/desk'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Project')
    .schemaType('project')
    .child(S.editor().title('Project').schemaType('project').documentId('project'))
)
