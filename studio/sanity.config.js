import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './deskStructure'
import {iconPicker} from 'sanity-plugin-icon-picker'

export default defineConfig({
  name: 'default',
  title: 'Landing Pages CMS',

  projectId: 'xtdik1rn',
  dataset: 'production',

  plugins: [
    deskTool({
      structure
    }), 
    visionTool(),
    iconPicker()
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
  
  cors: {
    allowOrigins: ['http://localhost:3000', 'https://your-netlify-url.netlify.app'],
    allowCredentials: true,
  }
})
