import * as Sentry from "@sentry/nextjs";
import {
  isSentryEnabled,
  getSentryEnvironment,
  getTracesSampleRate,
  isDebugEnabled,
} from "./sentry.config";

// Sensitive query parameters to scrub
const SENSITIVE_PARAMS = ["token", "password", "secret", "apiKey", "api_key"];

// Only initialize if Sentry is enabled for this environment
if (isSentryEnabled()) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
    environment: getSentryEnvironment(),

    // Set release from git SHA (Vercel provides this)
    release:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.NEXT_PUBLIC_APP_VERSION ||
      "local",

    // Edge runtime has minimal tracing
    tracesSampleRate: getTracesSampleRate(),

    // Integrations
    integrations: [
      // winterCG fetch integration for Edge runtime and Next.js middleware
      Sentry.winterCGFetchIntegration({
        breadcrumbs: true,
      }),
    ],

    // Filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["x-api-key"];
        delete event.request.headers["cookie"];
      }

      // Scrub sensitive query parameters
      if (event.request?.query_string) {
        const qs = event.request.query_string;
        if (typeof qs === "string") {
          let scrubbed = qs;
          for (const param of SENSITIVE_PARAMS) {
            const regex = new RegExp(`(?:^|&)${param}=[^&]*`, "gi");
            scrubbed = scrubbed.replace(regex, `${param}=[REDACTED]`);
          }
          event.request.query_string = scrubbed;
        } else if (Array.isArray(qs)) {
          // Handle tuple array format [key, value][]
          event.request.query_string = qs.map(([key, value]) =>
            SENSITIVE_PARAMS.includes(key) ? [key, "[REDACTED]"] : [key, value]
          ) as typeof qs;
        }
      }

      return event;
    },

    // Debug mode (development only) - controlled by config
    debug: isDebugEnabled(),

    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      // Random plugins/extensions
      /.*\b(cordova|sencha)\b.*/,
    ],

    // Denoising (group similar errors)
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
    ],
  });
}

export default Sentry;
