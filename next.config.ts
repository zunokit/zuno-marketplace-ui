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
  webpack: (config) => {
    // Handle missing optional dependencies from web3 libraries
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
      lokijs: false,
      encoding: false,
    };

    // Ignore node-specific and optional dependencies
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        "pino-pretty": "commonjs pino-pretty",
        lokijs: "commonjs lokijs",
        encoding: "commonjs encoding",
      });
    }

    return config;
  },
};

export default nextConfig;
