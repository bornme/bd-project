/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Static export for GitHub Pages
  images: { unoptimized: true }, // No server-side image optimization
  basePath: "/bd-project", // Subpath for project site
  assetPrefix: "/bd-project/", // Prefix for static assets
};

module.exports = nextConfig;