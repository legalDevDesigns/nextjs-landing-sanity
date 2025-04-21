import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonialItem',
  title: 'Testimonial Item',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'position',
      title: 'Author Position/Title (Optional)',
      type: 'string',
      description: 'E.g., CEO, Happy Customer'
    }),
    defineField({
      name: 'avatar',
      title: 'Author Avatar (Optional)',
      type: 'image',
      options: { hotspot: true }
    })
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'quote',
      media: 'avatar'
    },
    prepare({ title, subtitle, media }) {
      // Truncate quote for subtitle
      const truncatedQuote = subtitle && subtitle.length > 70 ? `${subtitle.substring(0, 70)}...` : subtitle;
      return {
        title: title || 'No author',
        subtitle: truncatedQuote || 'No quote',
        media: media
      }
    }
  }
}) 