/** @type {import('next').NextConfig} */
const nextConfig = {
  // For static export to S3 + CloudFront
  output: process.env.NEXT_BUILD_MODE === 'static' ? 'export' : undefined,

  // Image optimization disabled for static export
  images: {
    unoptimized: process.env.NEXT_BUILD_MODE === 'static',
  },

  // Transpile UI package
  transpilePackages: ['@backoffice-kit/ui', '@backoffice-kit/shared'],
  reactStrictMode: true,

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
