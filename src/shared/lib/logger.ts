/**
 * Pino Logger
 * Structured logging with prefix support and environment-based configuration
 */

import pino from "pino";
import { createSentryTransport } from "./pino-sentry-transport";

const isEdge = typeof (globalThis as { EdgeRuntime?: string }).EdgeRuntime !== "undefined";
const isDev = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Base configuration
const baseConfig = {
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  sync: true, // Required for React Server Components
  base: {
    service: "zuno-marketplace",
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    env: process.env.NODE_ENV,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "token",
      "apiKey",
      "secret",
      "*.password",
      "*.token",
    ],
    censor: "[REDACTED]",
  },
  formatters: {
    level: (label: string) => ({ level: label }),
    log: (obj: Record<string, unknown>) => {
      // If prefix exists, prepend it to msg for display
      if (obj.prefix && typeof obj.msg === "string") {
        return { ...obj, msg: `[${obj.prefix}] ${obj.msg}` };
      }
      return obj;
    },
  },
};

// Runtime-specific configuration
const config = {
  ...baseConfig,
  ...(isEdge ? { base: undefined } : {}),
  ...(isDev && !isEdge
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
};

// Create logger with Sentry transport in production
export const logger = isProduction && !isEdge
  ? pino(config, createSentryTransport())
  : pino(config);

// Export default for convenience
export default logger;
