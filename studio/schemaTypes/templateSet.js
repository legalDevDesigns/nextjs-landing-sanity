export default {
  name: 'templateSet',
  title: 'Template Set',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Set Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'setId',
      title: 'Set ID',
      type: 'string',
      options: {
        list: [
          { title: 'Lawyer Set 1 - Modern', value: 'lawyer-1' },
          { title: 'Lawyer Set 2 - Professional', value: 'lawyer-2' },
          { title: 'Lawyer Set 3 - Classic', value: 'lawyer-3' },
          { title: 'Insurance Set 1 - Friendly', value: 'insurance-1' },
          { title: 'Insurance Set 2 - Corporate', value: 'insurance-2' },
          { title: 'Insurance Set 3 - Modern', value: 'insurance-3' }
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
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of this template set'
    },
    {
      name: 'heroImage',
      title: 'Hero Section Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    },
    {
      name: 'aboutImage',
      title: 'About Section Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    },
    {
      name: 'testimonialAvatars',
      title: 'Testimonial Avatars',
      type: 'array',
      of: [{ 
        type: 'image',
        options: { hotspot: true }
      }],
      validation: Rule => Rule.required().min(3)
    },
    {
      name: 'ctaImage',
      title: 'CTA Background Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'name',
      setId: 'setId',
      media: 'heroImage'
    },
    prepare({ title, setId, media }) {
      const type = setId.split('-')[0]
      const number = setId.split('-')[1]
      return {
        title,
        subtitle: `${type.charAt(0).toUpperCase() + type.slice(1)} Template Set ${number}`,
        media
      }
    }
  }
} 