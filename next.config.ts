import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
        pathname: "/**",
      },
    ],
  },
  // Sanity Studio re-exports CSS-in-JS that Next prefers to keep server-only
  // until it gets bundled — this silences the warning.
  serverExternalPackages: ["@sanity/client"],
};

export default nextConfig;
