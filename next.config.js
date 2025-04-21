/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export for production builds
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },
  trailingSlash: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
}

module.exports = nextConfig 