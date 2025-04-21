import React from 'react'
import IconPicker from '../components/IconPicker'

export default function iconPickerPlugin() {
  return {
    name: 'icon-picker',
    form: {
      components: {
        input: (props) => {
          if (props.schemaType.name === 'iconPicker') {
            return <IconPicker {...props} />
          }
          return props.renderDefault(props)
        }
      }
    }
  }
} 