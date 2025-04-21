// schemas/landingPage.js
import {defineField, defineType} from 'sanity'
import { HomeIcon, CogIcon, PresentationChartLineIcon, InformationCircleIcon } from '@heroicons/react/24/outline' // Example icons for groups

// --- Helper for Domain Uniqueness Validation ---
// (Place this function either here or in a separate utils file and import it)
const isUniqueDomain = async (domain, context) => {
  if (!domain) return true // Allow empty if not required (though we make it required below)
  const {document, getClient} = context
  const client = getClient({apiVersion: '2023-05-03'}) // Use your API version
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    domain: domain
  }
  const query = `!defined(*[
    _type == 'landingPage' &&
    customDomain == $domain &&
    !(_id in [$draft, $published])
  ][0]._id)`
  const result = await client.fetch(query, params)
  return result // Returns true if unique, false otherwise
}


// --- Main Landing Page Schema ---
export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  icon: HomeIcon, // Optional: Adds an icon in the Studio list

  // --- Define Groups for Editor Tabs ---
  groups: [
    { name: 'content', title: 'Page Content', icon: PresentationChartLineIcon, default: true },
    { name: 'businessInfo', title: 'Business Info', icon: InformationCircleIcon },
    { name: 'seo', title: 'SEO & Settings', icon: CogIcon },
  ],

  // --- Define Fields ---
  fields: [
    // --- Core Identification (SEO & Settings Group) ---
    defineField({
      name: 'title',
      title: 'Page Title (Internal)',
      type: 'string',
      description: 'Identifies the page in the Sanity Studio (e.g., "Insurance Landing Page - City A"). Used to generate the slug if empty.',
      group: 'seo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customDomain',
      title: 'Custom Domain Name',
      type: 'string',
      description: 'REQUIRED. The exact domain for this page (e.g., www.cityainsurance.com). Must be unique and configured on Netlify.',
      group: 'seo',
      validation: (Rule) => Rule.required().custom(async (value, context) => {
          const isUnique = await isUniqueDomain(value, context)
          if (!isUnique) return 'This domain name is already assigned to another page.'
          // Add regex validation if needed:
          // if (value && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value)) {
          //   return 'Invalid domain format.'
          // }
          return true
      }),
    }),
     defineField({
      name: 'slug',
      title: 'Slug (Optional Fallback)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'Optional identifier if needed (e.g., for internal previews). Domain is primary.',
      group: 'seo',
    }),

    // --- SEO Fields (SEO & Settings Group) ---
     defineField({
        name: 'seoTitle',
        title: 'SEO Title',
        type: 'string',
        description: 'Overrides the page title for search engines (keep under 60 characters). If blank, uses Hero Title.',
        group: 'seo',
        validation: Rule => Rule.max(60).warning('Best practice is under 60 characters')
     }),
     defineField({
        name: 'seoDescription',
        title: 'SEO Description',
        type: 'text',
        rows: 3,
        description: 'Meta description for search engines (keep under 160 characters).',
        group: 'seo',
        validation: Rule => Rule.max(160).warning('Best practice is under 160 characters')
     }),
     defineField({
        name: 'seoImage',
        title: 'Social Share Image',
        type: 'image',
        description: 'Image used when sharing the page link on social media (e.g., Facebook, Twitter). Recommended size: 1200x630px.',
        group: 'seo',
        options: { hotspot: true }
     }),


    // --- Business Info (Business Info Group) ---
    defineField({
      name: 'businessInfo',
      title: 'Business Information',
      type: 'object',
      group: 'businessInfo',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'name', title: 'Business Name', type: 'string' }),
        defineField({ name: 'phone', title: 'Business Phone', type: 'string' }),
        defineField({ name: 'email', title: 'Business Email', type: 'string' }),
        defineField({ name: 'address', title: 'Business Address', type: 'text', rows: 3 }), // Text for multi-line addresses
        defineField({ // Optional specific field example
            name: 'hoursOfOperation',
            title: 'Hours of Operation',
            type: 'text',
            rows: 5,
            description: 'Optional: Enter operating hours. Leave blank if not applicable.',
        }),
        // Add other common optional fields here if they appear frequently
        // defineField({ name: 'licenseNumber', title: 'License Number', type: 'string'}),
      ]
    }),


    // --- Hero Section (Page Content Group) ---
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: false },
      fields: [
        {name: 'title', title: 'Headline', type: 'string', validation: Rule => Rule.required()},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {name: 'backgroundImage', title: 'Background Image', type: 'image', options: {hotspot: true}, validation: Rule => Rule.required()},
        {name: 'formTitle', title: 'Form Title', type: 'string', description: "Optional title above the form in the hero."},
        {name: 'formPlaceholder', title: 'Form Input Placeholder', type: 'string'},
        // Add other hero variations if needed (e.g., button text/link if form is optional)
      ],
    }),

    // --- Features Section (Page Content Group) ---
    defineField({
      name: 'mainFeatures',
      title: 'Main Features / Services',
      type: 'array',
      group: 'content',
      description: 'Primary features or services offered.',
      of: [{type: 'featureItem'}], // Reference reusable featureItem object
    }),
    defineField({
      name: 'secondaryFeatures',
      title: 'Secondary Features / Benefits',
      type: 'array',
      group: 'content',
      description: 'Additional benefits or value points (e.g., Quality, Experience).',
      of: [{type: 'featureItem'}], // Reuse featureItem object
    }),

    // --- About Section (Page Content Group) ---
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: true }, // Start collapsed
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Description', type: 'text'},
        {name: 'image', title: 'Image', type: 'image', options: {hotspot: true}},
      ],
    }),

    // --- Testimonials Section (Page Content Group) ---
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'content',
      description: 'Add customer testimonials for this page.',
      of: [{type: 'testimonialItem'}], // Reference reusable testimonialItem object
    }),

     // --- Flexible Content Area (Page Content Group) !!! ---
    defineField({
      name: 'extraContentSection',
      title: 'Extra Content Section',
      type: 'portableText',
      group: 'content',
      description: 'Flexible area for additional page-specific content like unique selling points, detailed descriptions, embedded videos, special notices, parking info, etc. Use headings and lists for structure.',
      // Define allowed block types and potentially custom components
      of: [
        {
          type: 'block', // Standard text blocks (paragraphs, headings H2-H6, lists, quotes)
          styles: [ // Limit available styles if needed
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [ // Allow lists
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: { // Allow standard marks like bold, italic, links
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [ // Allow links
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [{ name: 'href', type: 'url', title: 'URL', validation: Rule => Rule.uri({allowRelative: true}) }]
              },
            ]
          }
        },
        {
          type: 'image', // Allow embedding images directly in the text flow
          options: {hotspot: true}
        },
        // --- Placeholder for potential custom components later ---
        // { type: 'ctaButton' }, // Example: If you define a ctaButton schema
        // { type: 'videoEmbed' }, // Example: If you define a video embed schema
      ]
    }),


    // --- CTA Sections (Page Content Group) ---
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA Section',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: true },
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {name: 'buttonText', title: 'Button Text', type: 'string'},
        // {name: 'buttonLink', title: 'Button Link', type: 'url'}, // Optional if button does something else
        {name: 'backgroundImage', title: 'Background Image', type: 'image', options: {hotspot: true}},
      ],
    }),
     defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA Section',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: true },
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'subtitle', title: 'Subtitle', type: 'text'},
        {name: 'buttonText', title: 'Button Text', type: 'string'},
        // {name: 'buttonLink', title: 'Button Link', type: 'url'},
        {name: 'backgroundImage', title: 'Background Image', type: 'image', options: {hotspot: true}},
      ],
    }),

    // --- Map Section (Page Content Group) ---
     defineField({
      name: 'map',
      title: 'Map Section',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: true },
      fields: [
        {name: 'location', title: 'Location Address (for display)', type: 'string', description: 'Optional: Display address text near map.'},
        {name: 'embedUrl', title: 'Google Maps Embed URL', type: 'url', description: 'Paste the full embed URL from Google Maps share options.'},
        // {name: 'coordinates', title: 'Coordinates', type: 'geopoint'} // Alternative using geopoint
      ],
    }),
  ],

  // --- Preview Configuration ---
  preview: {
    select: {
      title: 'title', // Use the internal title
      domain: 'customDomain',
      media: 'hero.backgroundImage', // Show hero image
    },
    prepare(selection) {
      const {title, domain, media} = selection
      return {
        title: title || 'Untitled Landing Page',
        subtitle: domain || 'No domain set',
        media: media,
      }
    },
  },
})

// --- Reusable Object Schemas (Create separate files for these) ---

// schemas/featureItem.js
// ... (as defined previously: title, description, icon, image) ...

// schemas/testimonialItem.js
// ... (as defined previously: quote, author, position, avatar) ...

// --- Remember to import and include all schemas in your main schema config ---