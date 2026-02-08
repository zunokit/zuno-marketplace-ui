import { toast } from "sonner";
import { ZunoSDKError, ErrorCodes } from "zuno-marketplace-sdk";
import {
  getSdkErrorMessage,
  extractErrorCode,
  categorizeError,
  isRetryableError,
  type ErrorCategory,
} from "./error-messages";

/**
 * Error handler options
 */
interface HandleSdkErrorOptions {
  fallbackMessage?: string;
  showToast?: boolean;
  logToSentry?: boolean;
  context?: Record<string, unknown>;
  onError?: (error: unknown, category: ErrorCategory) => void;
  onRetryable?: (error: unknown) => void;
}

/**
 * Handle SDK errors with user-friendly behavior.
 * Silently ignores user rejections, shows toast for other errors.
 * Enhanced with error categorization and Sentry logging.
 */
export function handleSdkError(
  error: unknown,
  options: HandleSdkErrorOptions | string = {}
): void {
  // Normalize options
  const opts: HandleSdkErrorOptions = typeof options === "string"
    ? { fallbackMessage: options }
    : options;

  const {
    fallbackMessage = "Transaction failed",
    showToast = true,
    logToSentry = true,
    context = {},
    onError,
    onRetryable,
  } = opts;

  // User cancelled - silent, no error needed
  if (isUserRejected(error)) {
    return;
  }

  // Extract error code and categorize
  const errorCode = extractErrorCode(error);
  const category = categorizeError(error);
  const message = getSdkErrorMessage(errorCode, fallbackMessage);

  // Show toast notification
  if (showToast) {
    const description = getErrorDescription(error, category);
    toast.error(message, description ? { description } : undefined);
  }

  // Log to Sentry if enabled and not a user error
  if (logToSentry && category !== "USER" && category !== "WALLET") {
    logErrorToSentry(error, { ...context, errorCode, category });
  }

  // Call error callback
  onError?.(error, category);

  // Handle retryable errors
  if (isRetryableError(error)) {
    onRetryable?.(error);
  }
}

/**
 * Get error description based on category
 */
function getErrorDescription(error: unknown, category: ErrorCategory): string | undefined {
  switch (category) {
    case "NETWORK":
      return "Please check your internet connection and try again.";
    case "CONTRACT":
      return "The smart contract rejected the transaction.";
    case "WALLET":
      return "Please check your wallet balance and try again.";
    default:
      return undefined;
  }
}

/**
 * Log error to Sentry if available
 */
function logErrorToSentry(error: unknown, context: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const sentry = (window as unknown as {
    Sentry?: {
      captureException: (error: unknown, options?: { extra?: Record<string, unknown>; tags?: Record<string, string> }) => void;
    };
  }).Sentry;

  if (sentry) {
    sentry.captureException(error, {
      extra: context,
      tags: { module: "launch-pad", component: "mint" },
    });
  }
}

/**
 * Check if error is user rejection (from SDK or wagmi)
 */
export function isUserRejected(error: unknown): boolean {
  // Check SDK user rejection
  if (error instanceof ZunoSDKError && error.code === ErrorCodes.USER_REJECTED) {
    return true;
  }

  // Check wagmi/user rejection by error message or code
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("user rejected") ||
      message.includes("user denied") ||
      message.includes("action rejected") ||
      message.includes("cancelled by user")
    ) {
      return true;
    }

    // Check wagmi error code (numeric or string)
    const err = error as { code?: number | string };
    if (err.code === 4001 || err.code === "ACTION_REJECTED") {
      return true;
    }
  }

  return false;
}

/**
 * Check if error should be logged (filters out user rejections)
 */
export function shouldLogError(error: unknown): boolean {
  return !isUserRejected(error);
}
