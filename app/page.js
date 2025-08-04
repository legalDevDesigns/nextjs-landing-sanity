import { client } from './sanity/lib/client';
import { groq } from 'next-sanity';
import HomeClient from './HomeClient'; // We'll move the client logic here
// Import urlFor if you need it for seoImage in generateMetadata
import { urlFor } from './sanity/lib/client'; // Or wherever it's defined

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
        hoursOfOperation,
        logo { alt, asset-> }
      },
      // SEO Fields
      seoTitle,
      seoDescription,
      googleAnalyticsId,
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
      ctaBlock1 {
        heading,
        subheading,
        buttonText,
        buttonAction,
        backgroundImage { alt, asset-> }
      },
      ctaBlock2 {
        heading,
        subheading,
        buttonText,
        buttonAction,
        backgroundImage { alt, asset-> }
      },
      // Map Section
      map {
        location,
        embedUrl
      },
      // Color Palette
      useDefaultTheme,
      "primaryColorValue": primaryColor.hex,
      "secondaryColorValue": secondaryColor.hex,
      buttonTextColorChoice,
      headerFooterTextColorChoice
    }
  `;

  const params = { landingPageId };
  const data = await client.fetch(query, params);
  
  if (!data) {
    console.error(`Landing page with ID ${landingPageId} not found.`);
    // Return a default structure or handle the error appropriately
    return { title: 'Page Not Found', seoTitle: 'Page Not Found', seoDescription: 'This page could not be found.' }; 
  }
  
  console.log('Fetched Data for generateMetadata:', data.seoTitle); // Specific log for metadata
  return data;
}

// Dynamically generate metadata
export async function generateMetadata() {
  const siteData = await getData();

  // Prepare Open Graph images, checking if about.image and asset exist
  const openGraphImages = [];
  if (siteData.about && siteData.about.image && siteData.about.image.asset) {
    // Assuming urlFor is available in this scope. If not, it needs to be imported.
    // You might need to import { urlFor } from './sanity/lib/client' or './sanity/lib/image'
    // For now, let's assume a helper function or direct URL generation for simplicity if urlFor isn't easily available here.
    // This part might need adjustment based on how urlFor is structured and imported.
    // For a robust solution, ensure urlFor is imported and used correctly.
    // As a placeholder if urlFor is not directly usable or to avoid breaking the build:
    // openGraphImages.push({ url: 'path_to_your_default_image.jpg' }); // Fallback or ensure urlFor is correctly used
     // If you have urlFor imported:
     openGraphImages.push({ url: urlFor(siteData.about.image.asset).width(1200).height(630).url(), alt: siteData.about.image.alt || siteData.seoTitle });
  }


  return {
    title: siteData.seoTitle || siteData.title || 'Your Business Name', // Fallback to internal title or a generic name
    description: siteData.seoDescription || 'Welcome to our page.', // Fallback description
    openGraph: {
      title: siteData.seoTitle || siteData.title || 'Your Business Name',
      description: siteData.seoDescription || 'Welcome to our page.',
      images: openGraphImages.length > 0 ? openGraphImages : [{ url: '/images/1hero.jpg' }], // Fallback OG image
      // Add other OG tags as needed
    },
    // Add other metadata fields like twitter, robots etc. if needed
  };
}


export default async function Home() {
  const siteData = await getData();

  return <HomeClient siteData={siteData} />;
} 