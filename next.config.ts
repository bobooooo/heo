import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_BASE;
const normalizedApiBase = apiBase?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!normalizedApiBase) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${normalizedApiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
