import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@phosphor-icons/react"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
}

export default nextConfig
