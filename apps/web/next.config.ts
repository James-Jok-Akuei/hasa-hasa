import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hasahasa/shared", "@hasahasa/api-client"],
};

export default nextConfig;
