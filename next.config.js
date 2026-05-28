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
        // Generic platform: proxy everything under /mentormatch 1:1 to the
        // standalone MentorMatch app (which runs with basePath: /mentormatch).
        // This also serves _next chunks and public assets referenced as
        // /mentormatch/* by every page, including the Sicredi landing.
        { source: '/mentormatch', destination: `${mmUrl}/mentormatch` },
        { source: '/mentormatch/:path*', destination: `${mmUrl}/mentormatch/:path*` },

        // Sicredi tenant.
        // Only the landing maps to the branded route (/mentormatch/sicredi).
        // Every other path goes to the GENERIC app: the active tenant is
        // carried by the `mm-tenant` cookie (set on the landing), not by the
        // URL. Keeping internal routes on the generic app means new/unlisted
        // routes (e.g. /t/:slug/* dashboards, auth, onboarding, api) all
        // resolve correctly instead of 404-ing against the branded path.
        { source: '/sicredi/mentormatch', destination: `${mmUrl}/mentormatch/sicredi` },
        { source: '/sicredi/mentormatch/:path*', destination: `${mmUrl}/mentormatch/:path*` },
      ],
    };
  },
};

module.exports = withBundleAnalyzer(nextConfig);
