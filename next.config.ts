import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here - trigger dev reload */
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.111.2.194"],
};

export default nextConfig;
