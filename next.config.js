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
    const mmUrl = process.env.MENTORMATCH_URL || 'https://mentormatch-five.vercel.app';
    return {
      beforeFiles: [
        { source: '/mentormatch', destination: `${mmUrl}/mentormatch` },
        { source: '/mentormatch/:path*', destination: `${mmUrl}/mentormatch/:path*` },
        { source: '/sicredi/mentormatch', destination: `${mmUrl}/mentormatch/sicredi` },
        { source: '/sicredi/mentormatch/:path*', destination: `${mmUrl}/mentormatch/sicredi/:path*` },
      ],
    };
  },
};

module.exports = withBundleAnalyzer(nextConfig);
