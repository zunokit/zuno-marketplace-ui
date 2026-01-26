/**
 * Sentry Instrumentation
 *
 * This file is required for Next.js 15+ with App Router to properly initialize Sentry.
 * It runs before the Next.js server starts and ensures Sentry is configured early.
 *
 * Reference: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 */

import * as Sentry from "@sentry/nextjs";

export async function register() {
  // Check if Sentry should be enabled
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  if (!dsn) {
    return;
  }

  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "false") {
    return;
  }

  // Log that instrumentation is registered (for debugging)
  if (process.env.NODE_ENV === "development") {
    console.log("[Sentry] Instrumentation registered for Next.js");
  }
}

// Capture request errors for better error tracking
export const onRequestError = Sentry.captureRequestError;
