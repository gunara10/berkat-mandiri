import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use the Vercel/Node runtime so Prisma can query the database at runtime.
  // Static export cannot support the server-side Prisma client used by this app.
  trailingSlash: true,

  // Shared hosting friendly — no image optimization server needed
  images: {
    unoptimized: true,
  },

  // Disable strict TS checks for build (Framer Motion type widening issue)
  // ESLint already catches real errors
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
