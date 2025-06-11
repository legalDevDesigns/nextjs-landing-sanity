import {defineField, defineType} from 'sanity'
import {preview} from 'sanity-plugin-icon-picker'

export default defineType({
  name: 'featureItem',
  title: 'Feature Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [{ name: 'href', type: 'url', title: 'URL', validation: Rule => Rule.uri({allowRelative: true}) }]
              },
            ]
          }
        },
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'iconType',
      title: 'Icon Type',
      type: 'string',
      options: {
        list: [
          { title: 'Icon Picker', value: 'icon' },
          { title: 'Font Awesome Class', value: 'custom' },
          { title: 'No Icon', value: 'none' }
        ]
      },
      initialValue: 'icon',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'iconPicker',
      options: {
        providers: ['fa', 'mdi', 'hi'],
        outputFormat: 'react',
        storeSvg: true
      },
      hidden: ({ parent }) => parent?.iconType !== 'icon',
      validation: Rule => Rule.custom((value, context) => {
        if (context.parent?.iconType === 'icon' && !value) {
          return 'Please select an icon'
        }
        return true
      })
    }),
    defineField({
      name: 'customIconClass',
      title: 'Font Awesome Icon Class',
      type: 'string',
      description: 'E.g., "fa-solid fa-gavel"',
      hidden: ({ parent }) => parent?.iconType !== 'custom',
      validation: Rule => Rule.custom((value, context) => {
        if (context.parent?.iconType === 'custom' && !value) {
          return 'Please enter a custom icon class'
        }
        return true
      })
    }),
    defineField({
      name: 'image',
      title: 'Feature Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional image for this feature'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      iconType: 'iconType',
      iconProvider: 'icon.provider',
      iconName: 'icon.name',
      customIcon: 'customIconClass',
      image: 'image'
    },
    prepare({ title, iconType, iconProvider, iconName, customIcon, image }) {
      const icon = iconType === 'icon' && iconProvider ? {provider: iconProvider, name: iconName} : null;
      
      return {
        title: title || 'Untitled Feature',
        subtitle: icon ? `${iconProvider}:${iconName}` : (customIcon || 'No Icon'),
        media: image ? image : (icon ? preview(icon) : null)
      }
    }
  }
}) 