import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_MAPTILER_KEY: process.env.NEXT_PUBLIC_MAPTILER_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.snapiter.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
