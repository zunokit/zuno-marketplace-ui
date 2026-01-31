"use server";

import * as Sentry from "@sentry/nextjs";

/**
 * Debug action to trigger a Sentry error for testing purposes
 */
export async function triggerSentryError(): Promise<{ success: boolean; message: string }> {
  try {
    // Add some debug context
    Sentry.addBreadcrumb({
      message: "Debug: About to trigger intentional error",
      category: "debug",
      level: "info",
      data: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
    });

    // Trigger an intentional error for Sentry testing
    throw new Error("Debug: Intentional Sentry error triggered for testing purposes");
  } catch (error: unknown) {
    // Capture the error
    if (error instanceof Error) {
      Sentry.captureException(error);
    }

    return {
      success: true,
      message: "Error triggered and sent to Sentry",
    };
  }
}

/**
 * Debug action to trigger a Sentry message for testing purposes
 */
export async function triggerSentryMessage(): Promise<{ success: boolean; message: string }> {
  Sentry.captureMessage("Debug: Test message from debug page", "info");

  return {
    success: true,
    message: "Message sent to Sentry",
  };
}

/**
 * Debug action to add a breadcrumb to Sentry
 */
export async function addSentryBreadcrumb(
  message: string
): Promise<{ success: boolean; message: string }> {
  Sentry.addBreadcrumb({
    message: `Debug: ${message}`,
    category: "debug",
    level: "info",
    data: {
      timestamp: new Date().toISOString(),
    },
  });

  return {
    success: true,
    message: "Breadcrumb added to Sentry",
  };
}

/**
 * Debug action to set user context in Sentry
 */
export async function setSentryUser(
  userId: string
): Promise<{ success: boolean; message: string }> {
  Sentry.setUser({ id: userId });

  return {
    success: true,
    message: `User context set to: ${userId}`,
  };
}
