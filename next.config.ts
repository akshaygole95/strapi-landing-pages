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
  },
};

export default nextConfig;