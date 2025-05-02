import {defineConfig, isDev} from 'sanity'

import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'

import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {customDocumentActions} from './plugins/customDocumentActions'
import {table} from '@sanity/table'
import {portableTable} from '@bitfo/sanity-plugin-portable-table'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

const devOnlyPlugins = [visionTool()]

import {muxInput} from 'sanity-plugin-mux-input'

export default defineConfig({
  name: 'default',
  title: 'SUPER YAYA',
  projectId: 'wswdnh4k',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) => {
        return S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home')
              .schemaType('home')
              .child(S.editor().title('Home').schemaType('home').documentId('home')),
            S.divider(),
            S.listItem()
              .title('Collections')
              .schemaType('collection')
              .child(S.documentTypeList('collection')),
            S.listItem()
              .title('Products')
              .schemaType('product')
              .child(S.documentTypeList('product')),
            S.divider(),
            S.listItem().title('Pages').schemaType('page').child(S.documentTypeList('page')),
            // Minimum required configuration
            orderableDocumentListDeskItem({type: 'project', title: 'Projects', S, context}),
            orderableDocumentListDeskItem({type: 'season', title: 'Collection', S, context}),
           
            S.listItem().title('Category').schemaType('category').child(S.documentTypeList('category')),
            S.listItem().title('Size Chart').schemaType('sizeChart').child(S.documentTypeList('sizeChart')),
            
              S.divider(),
              S.listItem().title('Radio episodes').schemaType('radio').child(S.documentTypeList('radio')),
            S.divider(),
            S.listItem()
              .title('Settings')
              .schemaType('settings')
              .child(S.editor().title('Settings').schemaType('settings').documentId('settings')),
              S.divider(),
            S.listItem().title('Route').schemaType('route').child(S.documentTypeList('route')),
            S.listItem()
              .title('Color themes')
              .schemaType('colorTheme')
              .child(S.documentTypeList('colorTheme')),
            

            // ... all other desk items
          ])
      },
    }),
    colorInput(),
    imageHotspotArrayPlugin(),
    customDocumentActions(),
    media(),
    table(),
    portableTable({
      // Optional: default name is "table"
      name: "sanityTable",

      // Optional: default title is "Table"
      title: "Portable Table",

      // Required: must provide a block definition
      cellSchema: {
        name: "block",
        type: "block",
        styles: [],
        lists: [],
        marks: {
          decorators: [{ title: "Strong", value: "strong" }],
          annotations: [],
        },
      },
    }),
    muxInput({mp4_support: 'standard'}),
    ...(isDev ? devOnlyPlugins : []),
  ],

  schema: {
    types: schemaTypes,
  },

  form: {
    file: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource !== mediaAssetSource)
      },
    },
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource === mediaAssetSource)
      },
    },
  },
})
