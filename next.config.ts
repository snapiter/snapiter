import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
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
