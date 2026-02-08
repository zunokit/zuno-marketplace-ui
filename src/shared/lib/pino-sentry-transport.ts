/**
 * Pino Sentry Transport
 * Send error logs to Sentry in production
 */

import * as Sentry from "@sentry/nextjs";
import { shouldLog } from "./log-sampling";

export function createSentryTransport() {
  return {
    write(log: string) {
      // Always output to stdout
      process.stdout.write(log + "\n");

      // Only process in production
      if (process.env.NODE_ENV !== "production") return;

      try {
        const parsed = JSON.parse(log);

        // Check sampling
        if (!shouldLog(parsed.level)) return;

        // Send errors to Sentry
        if (parsed.level >= 50) {
          // error or fatal
          Sentry.withScope((scope) => {
            scope.setContext("log", parsed);

            if (parsed.correlationId) {
              scope.setTag("correlationId", parsed.correlationId);
            }

            if (parsed.prefix) {
              scope.setTag("prefix", parsed.prefix);
            }

            if (parsed.err) {
              const error = new Error(parsed.err.message);
              error.name = parsed.err.type || "Error";
              error.stack = parsed.err.stack;
              Sentry.captureException(error);
            } else {
              Sentry.captureMessage(parsed.msg, "error");
            }
          });
        }
      } catch {
        // Fail silently on parse error
      }
    },
  };
}
