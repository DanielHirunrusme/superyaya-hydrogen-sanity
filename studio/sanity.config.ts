import {defineConfig, isDev} from 'sanity'

import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {structure} from './desk'

import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {customDocumentActions} from './plugins/customDocumentActions'
import {table} from '@sanity/table'
const devOnlyPlugins = [visionTool()]

import {muxInput} from 'sanity-plugin-mux-input'

export default defineConfig({
  name: 'default',
  title: 'SUPER YAYA',
  projectId: 'wswdnh4k',
  dataset: 'production',

  plugins: [
    deskTool({structure}),
    colorInput(),
    imageHotspotArrayPlugin(),
    customDocumentActions(),
    media(),
    table(),
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
