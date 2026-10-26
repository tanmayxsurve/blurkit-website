import type { NextConfig } from "next";

// Setup dev platform for Cloudflare Pages local development (optional)
// Uncomment when deploying to Cloudflare Pages
// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
// if (process.env.NODE_ENV === 'development') {
//   setupDevPlatform();
// }

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Optimize for Cloudflare Pages
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Image optimization settings
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
