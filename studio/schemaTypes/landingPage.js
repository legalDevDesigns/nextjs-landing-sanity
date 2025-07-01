import {defineField, defineType} from 'sanity'
import { HomeIcon, CogIcon, PresentationChartLineIcon, InformationCircleIcon } from '@heroicons/react/24/outline' // Example icons for groups

// --- Helper for Domain Uniqueness Validation --- - Assuming this function exists or is added
const isUniqueDomain = async (domain, context) => {
  if (!domain) return true // Already required
  const {document, getClient} = context
  const client = getClient({apiVersion: '2024-07-08'}) // Use your API version
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
  return result
}


// --- Main Landing Page Schema ---
export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  icon: HomeIcon, 

  // --- Define Groups for Editor Tabs ---
  groups: [
    { name: 'content', title: 'Page Content', icon: PresentationChartLineIcon, default: true },
    { name: 'businessInfo', title: 'Business Info', icon: InformationCircleIcon },
    { name: 'seo', title: 'SEO & Settings', icon: CogIcon },
    { name: 'theme', title: 'Theme Settings', icon: CogIcon },
  ],

  // --- Define Fields ---
  fields: [
    // --- Theme Settings (Theme Settings Group) ---
    defineField({
      name: 'useDefaultTheme',
      title: 'Use Default Theme',
      type: 'boolean',
      group: 'theme',
      description: 'If checked, a predefined default color scheme will be used, ignoring the color pickers below.',
      initialValue: false,
    }),
    defineField({
      name: 'primaryColor',
      title: 'Button Color',
      type: 'color',
      options: { disableAlpha: true },
      group: 'theme',
      description: 'Select the primary color for the website theme (e.g., for buttons).',
      hidden: ({document}) => document?.useDefaultTheme === true,
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Header Color',
      type: 'color',
      options: { disableAlpha: true },
      group: 'theme',
      description: 'Select the secondary color for the website theme (e.g., for the header).',
      hidden: ({document}) => document?.useDefaultTheme === true,
    }),
    defineField({
      name: 'buttonTextColorChoice',
      title: 'Button Text Color',
      type: 'string',
      group: 'theme',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'light',
      description: 'Choose light or dark text for elements using the Button Color.',
      hidden: ({document}) => document?.useDefaultTheme === true,
    }),
    defineField({
      name: 'headerFooterTextColorChoice',
      title: 'Header & Footer Text Color',
      type: 'string',
      group: 'theme',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'light',
      description: 'Choose light or dark text for elements using the Header Color (e.g., header, footer).',
      hidden: ({document}) => document?.useDefaultTheme === true,
    }),
    // --- Core Identification (SEO & Settings Group) ---
    defineField({
      name: 'title',
      title: 'Page Title (Internal)',
      type: 'string',
      description: 'Identifies the page in the Sanity Studio (e.g., "Insurance Landing Page - City A").',
      group: 'seo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customDomain',
      title: 'Custom Domain Name',
      type: 'string',
      description: 'REQUIRED. The exact domain for this page (e.g., www.cityainsurance.com).',
      group: 'seo',
      validation: (Rule) => Rule.required().custom(async (value, context) => {
          const isUnique = await isUniqueDomain(value, context)
          if (!isUnique) return 'This domain name is already assigned to another page.'
          return true
      }),
    }),
     defineField({
      name: 'slug',
      title: 'Slug (Internal Use Only)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'Used internally, domain is primary for public URL.',
      group: 'seo',
      hidden: true, // Hide if not actively used
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
     /*
     defineField({
        name: 'seoImage',
        title: 'Social Share Image',
        type: 'image',
        description: 'Image used when sharing the page link on social media (e.g., Facebook, Twitter). Recommended size: 1200x630px.',
        group: 'seo',
        options: { hotspot: true }
     }),
     */

    // --- Business Info (RESTORED to Business Info Group) ---
    defineField({
      name: 'businessInfo',
      title: 'Business Information',
      type: 'object',
      group: 'businessInfo', // Ensure this group exists or assign to another like 'content' or 'seo'
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
            name: 'logo',
            title: 'Business Logo',
            type: 'image',
            description: 'Optional: Upload the business logo. It will appear in the header.',
            options: {
                hotspot: true,
            },
        }),
        defineField({ 
            name: 'name', 
            title: 'Business Name', 
            type: 'string',
            description: 'The official name of the business, used in header/footer.',
            validation: Rule => Rule.required()
        }),
        defineField({ 
            name: 'phone', 
            title: 'Primary Business Phone', 
            type: 'string',
            description: 'Main contact phone number.',
        }),
        defineField({ 
            name: 'email', 
            title: 'Primary Business Email', 
            type: 'string',
            description: 'Main contact email address.',
        }),
        defineField({ 
            name: 'address', 
            title: 'Primary Business Address', 
            type: 'text', 
            rows: 3 
        }),
        defineField({
            name: 'hoursOfOperation',
            title: 'Hours of Operation',
            type: 'text',
            rows: 5,
            description: 'Optional: Enter operating hours. Leave blank if not applicable.',
        }),
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
        {name: 'backgroundImage', title: 'Background Image', type: 'image', options: {hotspot: true}},
        {name: 'formTitle', title: 'Form Title', type: 'string', description: "Optional title above the form in the hero."},
        // Removed formPlaceholder as form is complex
      ],
    }),

    // --- Features Section (Page Content Group) - OPTION B IMPLEMENTATION ---
    defineField({
      name: 'mainFeatures',
      title: 'Main Features / Services',
      type: 'array',
      group: 'content',
      description: 'Add features for this page. Choose \'Feature Item\' for unique content or \'Reusable Feature Card\' to use one from the library.',
      of: [
        { 
          title: 'Feature Item',
          type: 'featureItem' // Reference the inline object schema
        },
        {
          title: 'Reusable Feature Card',
          type: 'reference',
          to: [{type: 'featureCard'}] // Reference the separate document type
        }
      ],
      validation: Rule => Rule.max(3).warning('Recommended maximum 3 main features')
    }),

    // --- About Section (Page Content Group) ---
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: true }, 
      fields: [
        {name: 'title', title: 'Title', type: 'string'},
        {name: 'description', title: 'Description', type: 'text'},
        {name: 'image', title: 'Image (also for Social Sharing)', type: 'image', options: {hotspot: true}, description: 'Image for the About Us section. This is also used when sharing the page on social media (e.g., Facebook, Twitter). Recommended size: 1200x630px.'},
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

     // --- Flexible Content Area (Page Content Group) ---
    defineField({
      name: 'extraContentSection',
      title: 'Extra Content Section',
      type: 'array', // Changed to array of blocks for better portable text handling
      of: [
        {
          type: 'block', 
          styles: [ 
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
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
        {
          type: 'image', 
          options: {hotspot: true}
        },
      ],
      group: 'content',
      description: 'Flexible area for additional page-specific content.',
    }),

    // --- Call to Action Block 1 (Page Content Group) ---
    defineField({
      name: 'ctaBlock1',
      title: 'Call to Action Block 1',
      type: 'object',
      group: 'content',
      options: {collapsible: true, collapsed: true},
      fields: [
        {name: 'heading', title: 'Heading', type: 'string'},
        {name: 'subheading', title: 'Subheading', type: 'text'},
        {name: 'buttonText', title: 'Button Text', type: 'string', initialValue: 'Get Started'},
        {
          name: 'buttonAction',
          title: 'Button Action',
          type: 'string',
          options: {
            list: [
              {title: 'Link to Form', value: 'form'},
              {title: 'Link to Phone Number', value: 'phone'},
            ],
            layout: 'radio',
          },
          initialValue: 'form',
        },
      ],
    }),

    defineField({
      name: 'secondaryFeatures',
      title: 'Secondary Features / Benefits',
      type: 'array',
      group: 'content',
      description: 'Add secondary features. Choose \'Feature Item\' for unique content or \'Reusable Feature Card\' to use one from the library.',
      of: [
        { 
          title: 'Feature Item',
          type: 'featureItem' // Reference the inline object schema
        },
        {
          title: 'Reusable Feature Card',
          type: 'reference',
          to: [{type: 'featureCard'}] // Reference the separate document type
        }
      ],
    }),

    // --- Call to Action Block 2 (Page Content Group) ---
    defineField({
      name: 'ctaBlock2',
      title: 'Call to Action Block 2',
      type: 'object',
      group: 'content',
      options: {collapsible: true, collapsed: true},
      fields: [
        {name: 'heading', title: 'Heading', type: 'string'},
        {name: 'subheading', title: 'Subheading', type: 'text'},
        {name: 'buttonText', title: 'Button Text', type: 'string', initialValue: 'Learn More'},
        {
          name: 'buttonAction',
          title: 'Button Action',
          type: 'string',
          options: {
            list: [
              {title: 'Link to Form', value: 'form'},
              {title: 'Link to Phone Number', value: 'phone'},
            ],
            layout: 'radio',
          },
          initialValue: 'phone',
        },
      ],
    }),

    // --- Footer (Page Content Group) ---
    // ... existing code ...

    // --- Map Section (Page Content Group) ---
     defineField({
      name: 'map',
      title: 'Map Section',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'showMap',
          title: 'Show Map Section',
          type: 'boolean',
          description: 'Toggle to show or hide the map section on the page.',
          initialValue: true,
        }),
        defineField({
          name: 'location', 
          title: 'Location Address (for display)', 
          type: 'string', 
          description: 'Optional: Display address text near map.',
          hidden: ({parent}) => !parent?.showMap,
        }),
        defineField({
          name: 'embedUrl', 
          title: 'Google Maps Embed URL', 
          type: 'url', 
          description: 'Paste the full embed URL from Google Maps share options.',
          hidden: ({parent}) => !parent?.showMap,
          validation: Rule => Rule.uri({
            scheme: ['http', 'https']
          })
        }),
      ],
    }),
  ],

  // --- Preview Configuration ---
  preview: {
    select: {
      title: 'title', 
      domain: 'customDomain',
      media: 'hero.backgroundImage',
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