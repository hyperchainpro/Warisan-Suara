import type { NextConfig } from "next";

const isPagesDeploy = process.env.DEPLOY_TARGET === "cloudflare-pages";

const nextConfig: NextConfig = {
  // For Cloudflare Pages: static export (frontend only, API via Pages Functions)
  // For local dev: standalone (full Next.js with API routes)
  output: isPagesDeploy ? "export" : "standalone",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Generate static HTML for all routes
  trailingSlash: true,
};

export default nextConfig;
