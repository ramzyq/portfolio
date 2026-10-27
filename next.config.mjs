/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config, { dev }) => {
    // The filesystem cache's gzip pack fails on this machine's commit limit.
    // HMR stays in memory; production builds keep the default cache.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
