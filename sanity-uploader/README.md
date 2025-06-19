# Sanity JSON Uploader

This tool provides a simple, password-protected web interface to upload JSON documents directly to your Sanity project.

## How It Works

1.  **Paste UI**: A simple HTML page (`/public/index.html`) with a textarea to paste a Sanity document in JSON format.
2.  **Netlify Function**: The form submits to a Netlify serverless function (`/netlify/functions/uploadToSanity.js`) that takes the JSON data.
3.  **Sanity Client**: The function uses the official `@sanity/client` to connect to your project and create or replace the document.
4.  **Security**: The entire site is protected with Basic Authentication, configured in the `_headers` file.

## 🛠 Setup & Deployment

Follow these steps to deploy your uploader tool to Netlify.

### 1. Project Setup

This tool is self-contained within the `/sanity-uploader` directory.

### 2. Configure Environment Variables

In your Netlify site dashboard, go to **Site settings > Build & deploy > Environment** and add the following environment variables:

*   `SANITY_PROJECT_ID`: Find this in your `sanity.json` or on [sanity.io/manage](https://sanity.io/manage).
*   `SANITY_DATASET`: The dataset to upload to (e.g., `production`).
*   `SANITY_API_TOKEN`: You need a token with **write permissions**. Create one from your project dashboard at [sanity.io/manage](https://sanity.io/manage) under **API > API tokens**.

### 3. Change a Password

The default password is `admin:supersecret`. You should change this.

1.  Open the `_headers` file.
2.  Modify the line `Basic-Auth: admin:supersecret` to `Basic-Auth: yourusername:yourverysecretpassword`.
3.  Commit and push this change.

### 4. Install Function Dependencies

The Netlify function requires `@sanity/client`. Before deploying you should install it. Navigate to the functions directory and install the dependencies.

```bash
cd sanity-uploader/netlify/functions
npm install
```

### 5. Deployment

You can deploy this tool to Netlify in two ways:

*   **Drag and Drop**: Zip the `sanity-uploader` directory and drag it to the deploy section of your site on Netlify.
*   **Git-based Deployment**: If this directory is part of a Git repository, connect the repository to a new site on Netlify. Configure the "Base directory" to `sanity-uploader` and leave the build command and publish directory empty (as they are set in `netlify.toml`).

### 6. Usage

Once deployed, visit your Netlify site URL. You will be prompted for the username and password you set in the `_headers` file. After logging in, you can paste your Sanity document JSON into the textarea and click "Upload to Sanity". 