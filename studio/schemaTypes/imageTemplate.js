export default {
  name: 'imageTemplate',
  title: 'Image Template',
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
      description: 'Brief description of this image template'
    },
    {
      name: 'category',
      title: 'Image Category',
      type: 'string',
      options: {
        list: [
          { title: 'Shared Template (Available to all)', value: 'shared' },
          { title: 'Site Specific', value: 'site-specific' },
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'siteId',
      title: 'Specific Site',
      type: 'reference',
      to: [{ type: 'siteConfig' }],
      hidden: ({ document }) => document?.category !== 'site-specific',
      validation: Rule => Rule.custom((field, context) => {
        if (context.document?.category === 'site-specific' && !field) {
          return 'Site is required for site-specific images'
        }
        return true
      })
    },
    {
      name: 'section',
      title: 'Section',
      type: 'string',
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'About', value: 'about' },
          { title: 'Testimonial', value: 'testimonial' },
          { title: 'CTA', value: 'cta' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'industry',
      title: 'Industry',
      type: 'string',
      options: {
        list: [
          { title: 'Lawyer', value: 'lawyer' },
          { title: 'Insurance Agent', value: 'insurance' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      section: 'section',
      industry: 'industry',
      category: 'category',
      media: 'image',
      siteName: 'siteId.siteName'
    },
    prepare({ title, section, industry, category, media, siteName }) {
      const subtitle = category === 'shared' 
        ? `${industry} - ${section} (Shared)`
        : `${industry} - ${section} (${siteName || 'No site selected'})`
      return {
        title,
        subtitle,
        media
      }
    }
  }
} 