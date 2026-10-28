import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Image optimization settings
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
