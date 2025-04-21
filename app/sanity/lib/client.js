import { createClient } from 'next-sanity'

// Define configuration variables directly using environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-08' // Use a recent date
const useCdn = process.env.NODE_ENV === 'production' // Use CDN only in production
const token = process.env.SANITY_API_TOKEN // Needed for server-side fetching

if (!projectId) {
  console.error('Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID');
  // Optionally throw an error during build if critical
  // throw new Error("Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID");
}
if (!token) {
  console.warn('Missing environment variable: SANITY_API_TOKEN. Server-side data fetching might fail.');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion, 
  useCdn, 
  token: token, // Use the token for server-side fetches
  ignoreBrowserTokenWarning: true,
  perspective: 'published', 
  // Uncomment and add configuration if using Presentation Tool
  // stega: {
  //   enabled: process.env.NODE_ENV !== 'production', 
  //   studioUrl: '/studio', 
  // },
})

// Helper function for generating Image URLs with only the asset reference data in your documents.
// Read more: https://www.sanity.io/docs/image-url
import imageUrlBuilder from '@sanity/image-url'

// Initialize the builder by passing the client object
const builder = imageUrlBuilder(client)

export const urlFor = (source) => {
  // Simple check: If the source isn't usable, return undefined.
  // The builder.image() call will handle the specifics.
  if (!source) {
    // Optional: Add a warning if you want to track these cases
    // console.warn('Invalid image source passed to urlFor:', source);
    return undefined;
  }
  // Let the builder handle the source object directly.
  // It can often accept resolved asset objects, references, etc.
  return builder.image(source);
} 