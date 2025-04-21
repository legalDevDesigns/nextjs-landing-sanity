import {preview} from 'sanity-plugin-icon-picker'

export default {
  name: 'featureCard',
  title: 'Feature Card',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
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
      validation: Rule => Rule.required()
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'iconPicker',
      options: {
        providers: ['fa', 'mdi', 'hi'],
        outputFormat: 'react',
        storeSvg: true
      },
      hidden: ({ document }) => document?.iconType !== 'icon',
      validation: Rule => Rule.custom((value, context) => {
        if (context.document?.iconType === 'icon' && !value) {
          return 'Please select an icon'
        }
        return true
      })
    },
    {
      name: 'customIconClass',
      title: 'Font Awesome Icon Class',
      type: 'string',
      description: 'Enter a Font Awesome icon class (e.g., "fa-solid fa-gavel" or "fa-regular fa-building")',
      hidden: ({ document }) => document?.iconType !== 'custom',
      validation: Rule => Rule.custom((value, context) => {
        if (context.document?.iconType === 'custom' && !value) {
          return 'Please enter a custom icon class'
        }
        return true
      })
    },
    {
      name: 'image',
      title: 'Feature Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image to display with this feature'
    },
    {
      name: 'industry',
      title: 'Industry',
      type: 'string',
      options: {
        list: [
          { title: 'Lawyer', value: 'lawyer' },
          { title: 'Insurance Agent', value: 'insurance' },
          { title: 'Custom', value: 'custom' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this feature should appear (lower numbers appear first)',
      validation: Rule => Rule.required().min(1).max(100)
    }
  ],
  preview: {
    select: {
      title: 'title',
      industry: 'industry',
      iconType: 'iconType',
      iconProvider: 'icon.provider',
      iconName: 'icon.name',
      customIcon: 'customIconClass',
      image: 'image'
    },
    prepare({ title, industry, iconType, iconProvider, iconName, customIcon, image }) {
      const icon = iconType === 'icon' ? {provider: iconProvider, name: iconName} : null;
      const getIconDisplay = () => {
        if (icon) return `${iconProvider}:${iconName}`;
        if (iconType === 'custom') return customIcon;
        return 'No icon';
      };
      
      return {
        title,
        subtitle: `${industry.charAt(0).toUpperCase() + industry.slice(1)} - ${getIconDisplay()}`,
        media: image ? image : (icon ? preview(icon) : null)
      };
    }
  }
} 