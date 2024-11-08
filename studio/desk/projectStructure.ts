import {ListItemBuilder} from 'sanity/desk'
import defineStructure from '../utils/defineStructure'
import {SparklesIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Projects')
    .icon(SparklesIcon)
    .schemaType('project')
    .child(S.documentTypeList('project'))
)

// export default defineStructure((S, context) =>
//   orderableDocumentListDeskItem({type: 'category', S, context}),
// )
