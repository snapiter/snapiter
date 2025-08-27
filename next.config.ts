import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cache.partypieps.nl',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
