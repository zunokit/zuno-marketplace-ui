import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.walletconnect.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ledger.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "magiceden.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zuno.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Mark server-only packages to prevent bundling in client
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "thread-stream",
    "lokijs",
    "encoding",
  ],
  webpack: (config) => {
    // Exclude test and benchmark files from being processed
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Ignore specific test/dev files
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\/(test|bench)\//,
      use: "null-loader",
    });

    return config;
  },
};

export default nextConfig;
