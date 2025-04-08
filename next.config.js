const nextConfig = {
  reactStrictMode: false, // Disable Strict Mode to prevent double rendering
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === "production" ? "/bd-project" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/bd-project/" : "",
};

if (process.env.NODE_ENV === "production") {
  nextConfig.output = "export";
}

module.exports = nextConfig;