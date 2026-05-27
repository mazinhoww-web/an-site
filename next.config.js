const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/mentormatch',
          destination: `${process.env.MENTORMATCH_URL || 'https://mentormatch-five.vercel.app'}/mentormatch`,
        },
        {
          source: '/mentormatch/:path*',
          destination: `${process.env.MENTORMATCH_URL || 'https://mentormatch-five.vercel.app'}/mentormatch/:path*`,
        },
      ],
    };
  },
};

module.exports = withBundleAnalyzer(nextConfig);
