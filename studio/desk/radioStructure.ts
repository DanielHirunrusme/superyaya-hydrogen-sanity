 
import defineStructure from '../utils/defineStructure'
import {SparklesIcon} from '@sanity/icons'
 

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Radio')
    .icon(SparklesIcon)
    .schemaType('radio')
    .child(S.documentTypeList('radio'))
)

 