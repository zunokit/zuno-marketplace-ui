import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "thread-stream", "pino-pretty", "lokijs", "encoding"],
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
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
      {
        protocol: "https",
        hostname: "zunokit.github.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

// Sentry wrapper for source map uploads and telemetry
export default withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during build
  silent: true,

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Use the SentryWebpackPlugin to inject release information
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Authentication token for Sentry
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Options for `tunnel` package (used to send source maps to Sentry)
  tunnelRoute: "/__sentry__",

  // Webpack-specific options (not supported with Turbopack)
  // See: https://docs.sentry.io/platforms/javascript/guides/nextjs/
  webpack: {
    // Automatically annotate React components with their display names
    reactComponentAnnotation: {
      enabled: true,
    },

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },

    // Enables automatic instrumentation of Vercel Cron Monitors
    automaticVercelMonitors: true,
  },
});
