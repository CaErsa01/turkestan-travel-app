/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["undici", "@google/generative-ai"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/places", destination: "/map", permanent: true },
      { source: "/places/:id", destination: "/map?place=:id", permanent: true },
      { source: "/official", destination: "/help", permanent: false },
    ];
  },
};

export default nextConfig;
