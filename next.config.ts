/** @type {import('next').NextConfig} */

const nextConfig = {
  // images: {
  //   domains: ['d3qactpsv0f67n.cloudfront.net'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3qactpsv0f67n.cloudfront.net',
        pathname: '/**',
      },
    ],
  }

  // i18n: {
  //   locales: ['en', 'es'], // Add all supported locales from Strapi
  //   defaultLocale: 'en'
  // },

};

export default nextConfig;