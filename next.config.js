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
        // Sicredi tenant landing
        { source: '/sicredi/mentormatch', destination: `${mmUrl}/mentormatch/sicredi` },
        // Internal flow routes (tenant context preserved via cookie set by Sicredi landing)
        { source: '/sicredi/mentormatch/login', destination: `${mmUrl}/mentormatch/login` },
        { source: '/sicredi/mentormatch/register', destination: `${mmUrl}/mentormatch/register` },
        { source: '/sicredi/mentormatch/select-profile', destination: `${mmUrl}/mentormatch/select-profile` },
        { source: '/sicredi/mentormatch/welcome', destination: `${mmUrl}/mentormatch/welcome` },
        { source: '/sicredi/mentormatch/dashboard', destination: `${mmUrl}/mentormatch/dashboard` },
        { source: '/sicredi/mentormatch/forgot-password', destination: `${mmUrl}/mentormatch/forgot-password` },
        { source: '/sicredi/mentormatch/reset-password', destination: `${mmUrl}/mentormatch/reset-password` },
        { source: '/sicredi/mentormatch/admin', destination: `${mmUrl}/mentormatch/admin` },
        { source: '/sicredi/mentormatch/admin/:path*', destination: `${mmUrl}/mentormatch/admin/:path*` },
        { source: '/sicredi/mentormatch/onboarding/:path*', destination: `${mmUrl}/mentormatch/onboarding/:path*` },
        { source: '/sicredi/mentormatch/t/:path*', destination: `${mmUrl}/mentormatch/t/:path*` },
        { source: '/sicredi/mentormatch/api/:path*', destination: `${mmUrl}/mentormatch/api/:path*` },
        // Fallback for static assets / icons / etc
        { source: '/sicredi/mentormatch/:path*', destination: `${mmUrl}/mentormatch/sicredi/:path*` },
      ],
    };
  },
};

module.exports = withBundleAnalyzer(nextConfig);
