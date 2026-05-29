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
  // MentorMatch is now a NATIVE module (no proxy to an external app). The old
  // Sicredi entry point is redirected to the native branded landing/routes.
  async redirects() {
    return [
      { source: '/sicredi/mentormatch', destination: '/mentormatch/sicredi', permanent: true },
      { source: '/sicredi/mentormatch/:path*', destination: '/mentormatch/:path*', permanent: true },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
