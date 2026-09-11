/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isolate production builds from the live development server cache.
  distDir: process.env.NODE_ENV === "production" ? ".next-prod" : ".next",
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
