import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Product photos are served from Cloudinary (docs/ARCHITECTURE.md §7).
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // picsum.photos is used only for seeded placeholder images until real
      // Cloudinary photos exist — remove this pattern once production photos
      // are uploaded.
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;