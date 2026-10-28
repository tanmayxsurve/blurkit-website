const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Image optimization settings
  images: {
    unoptimized: true,
  },

  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack config to handle path aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/config': path.resolve(__dirname, 'config'),
    };
    return config;
  },
};

module.exports = nextConfig;
