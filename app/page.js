import { client } from './sanity/lib/client';
import { groq } from 'next-sanity';
import HomeClient from './HomeClient'; // We'll move the client logic here

// Fetch data from Sanity based on the new schema
async function getData() {
  const landingPageId = process.env.SANITY_LANDING_PAGE_ID || 'YOUR_DEFAULT_LANDING_PAGE_ID_HERE';
  
  console.log(`Fetching data for landing page ID: ${landingPageId}`);
  
  const query = groq`
    *[_type == "landingPage" && _id == $landingPageId][0] {
      _id,
      title, // Internal Title
      customDomain,
      // Settings Reference -> Business Info (REVERTED - Fetch directly)
      businessInfo {
        name,
        phone,
        email,
        address,
        hoursOfOperation
      },
      // SEO Fields
      seoTitle,
      seoDescription,
      seoImage { alt, asset-> },
      // Hero Section
      hero {
        title,
        subtitle,
        backgroundImage { alt, asset-> },
        formTitle
      },
      // Features (Handling both inline and referenced)
      mainFeatures[] {
        _type == 'reference' => @-> {
          _id,
          _type,
          title,
          description,
          iconType,
          icon,
          customIconClass,
          image { alt, asset-> }
        },
        _type == 'featureItem' => {
          _key,
          _type,
          title,
          description,
          iconType,
          icon,
          customIconClass,
          image { alt, asset-> }
        }
      },
      secondaryFeatures[] {
         _type == 'reference' => @-> {
          _id,
          _type,
          title,
          description,
          iconType,
          icon,
          customIconClass,
          image { alt, asset-> }
        },
        _type == 'featureItem' => {
          _key,
          _type,
          title,
          description,
          iconType,
          icon,
          customIconClass,
          image { alt, asset-> }
        }
      },
      // About Section
      about {
        title,
        description,
        image { alt, asset-> }
      },
      // Testimonials (uses testimonialItem object)
      testimonials[] {
        _key,
        quote,
        author,
        position,
        avatar { alt, asset-> }
      },
      // Flexible Content
      extraContentSection,
      // CTAs
      primaryCta {
        title,
        subtitle,
        buttonText,
        backgroundImage { alt, asset-> }
      },
      secondaryCta {
        title,
        subtitle,
        buttonText,
        backgroundImage { alt, asset-> }
      },
      // Map Section
      map {
        location,
        embedUrl
      }
    }
  `;

  const params = { landingPageId };
  const data = await client.fetch(query, params);
  
  if (!data) {
    console.error(`Landing page with ID ${landingPageId} not found.`);
    // Return a default structure or handle the error appropriately
    return { title: 'Page Not Found' }; 
  }
  
  console.log('Fetched Data:', JSON.stringify(data, null, 2)); // Keep this uncommented for now
  console.log('Successfully fetched data for:', data.title);
  return data;
}

export default async function Home() {
  const siteData = await getData();

  return <HomeClient siteData={siteData} />;
} 