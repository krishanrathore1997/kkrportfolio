import type { NextConfig } from "next";

let r2Hostname: string | null = null;
if (process.env.R2_PUBLIC_URL) {
  try {
    const url = new URL(process.env.R2_PUBLIC_URL);
    r2Hostname = url.hostname;
  } catch (error) {
    console.warn("Invalid R2_PUBLIC_URL format in next.config.ts:", error);
  }
}

const nextConfig: NextConfig = {
  /* config options here - trigger dev reload */
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.111.2.194"],
  images: {
    remotePatterns: r2Hostname
      ? [
          {
            protocol: "https",
            hostname: r2Hostname,
            pathname: "/**",
          },
        ]
      : [],
  },
};

export default nextConfig;

