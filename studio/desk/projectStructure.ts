import {ListItemBuilder} from 'sanity/desk'
import defineStructure from '../utils/defineStructure'
import {SparklesIcon} from '@sanity/icons'
// export default defineStructure<ListItemBuilder>((S) =>
//   S.listItem()
//     .title('Project')
//     .schemaType('project')
//     .child(S.editor().title('Project').schemaType('project').documentId('project'))
// )


export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Projects')
    .icon(SparklesIcon)
    .schemaType('project')
    .child(S.documentTypeList('project'))
)
