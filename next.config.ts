import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://cdn.supportsnap.com/**')],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
