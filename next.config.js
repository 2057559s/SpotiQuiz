/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isolate production builds from the live development server cache.
  // Vercel's Next.js runtime requires the conventional .next output folder.
  // Keep a separate production cache only when building locally.
  distDir: process.env.NODE_ENV === "production" && !process.env.VERCEL ? ".next-prod" : ".next",
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
