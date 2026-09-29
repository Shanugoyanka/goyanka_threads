import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "abovffewvfdlhvvqcvxy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/**": ["./src/generated/prisma/*.node"],
    "/admin/**": ["./src/generated/prisma/*.node"],
  },
};

export default nextConfig;
