import { createClient } from '@sanity/client';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
        statusCode: 405, 
        body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN } = process.env;

    if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
      console.error("Sanity environment variables are not set.");
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Server configuration error: Sanity environment variables are not set." }),
      };
    }

    const client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      token: SANITY_API_TOKEN,
      useCdn: false,
      apiVersion: '2024-03-14',
    });

    const doc = JSON.parse(event.body);

    if (typeof doc !== 'object' || doc === null || !doc._type) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid JSON format. It must be an object with a '_type' property." }),
        };
    }

    const result = await client.createOrReplace(doc);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Document uploaded successfully!', result }),
    };
  } catch (error) {
    console.error("Error uploading document to Sanity:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading document to Sanity', error: error.message }),
    };
  }
}; 