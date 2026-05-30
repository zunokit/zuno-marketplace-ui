/**
 * Error message mapping for SDK and contract errors
 * Maps error codes to user-friendly messages
 */

export const SDK_ERROR_MESSAGES: Record<string, string> = {
  USER_REJECTED: "Transaction was cancelled",
  INSUFFICIENT_FUNDS: "Insufficient funds in wallet",
  SALE_NOT_STARTED: "Minting has not started yet",
  SALE_ENDED: "Minting has ended",
  SOLD_OUT: "Collection is sold out",
  NOT_WHITELISTED: "Your address is not on the allowlist",
  MAX_MINT_REACHED: "You have reached the maximum mint limit",
  INVALID_PROOF: "Invalid allowlist proof",
  CONTRACT_REVERT: "Transaction failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  TIMEOUT: "Request timed out. Please try again.",
  UNKNOWN: "Something went wrong. Please try again.",
};

/**
 * GraphQL error messages
 */
export const GRAPHQL_ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: "Unable to connect to server. Please check your internet connection.",
  NOT_FOUND: "Collection not found.",
  UNAUTHORIZED: "Please connect your wallet to continue.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  TIMEOUT: "Request timed out. Please try again.",
  UNKNOWN: "Failed to load data. Please try again.",
};

/**
 * Wallet error messages
 */
export const WALLET_ERROR_MESSAGES: Record<string, string> = {
  NOT_CONNECTED: "Please connect your wallet first",
  WRONG_NETWORK: "Please switch to the correct network",
  DISCONNECTED: "Wallet disconnected. Please reconnect.",
  SIGN_REJECTED: "Signature request was rejected",
};

/**
 * Get user-friendly error message for SDK error code
 */
export function getSdkErrorMessage(code: string, fallback = SDK_ERROR_MESSAGES.UNKNOWN): string {
  return SDK_ERROR_MESSAGES[code] || fallback;
}

/**
 * Get user-friendly error message for GraphQL error
 */
export function getGraphqlErrorMessage(code: string, fallback = GRAPHQL_ERROR_MESSAGES.UNKNOWN): string {
  return GRAPHQL_ERROR_MESSAGES[code] || fallback;
}

/**
 * Get user-friendly error message for wallet error
 */
export function getWalletErrorMessage(code: string, fallback = "Wallet error occurred"): string {
  return WALLET_ERROR_MESSAGES[code] || fallback;
}

/**
 * Extract error code from SDK error
 */
export function extractErrorCode(error: unknown): string {
  if (!error) return "UNKNOWN";

  // Check for SDK error with code property
  if (typeof error === "object" && error !== null) {
    const err = error as { code?: string; message?: string };

    if (err.code) {
      return err.code;
    }

    // Check message for known error patterns
    if (err.message) {
      const message = err.message.toLowerCase();

      if (message.includes("insufficient funds")) return "INSUFFICIENT_FUNDS";
      if (message.includes("user rejected") || message.includes("user denied")) return "USER_REJECTED";
      if (message.includes("sale not started")) return "SALE_NOT_STARTED";
      if (message.includes("sale ended") || message.includes("mint ended")) return "SALE_ENDED";
      if (message.includes("sold out") || message.includes("exceeds max supply")) return "SOLD_OUT";
      if (message.includes("not whitelisted") || message.includes("not in allowlist")) return "NOT_WHITELISTED";
      if (message.includes("max mint") || message.includes("mint limit")) return "MAX_MINT_REACHED";
      if (message.includes("invalid proof")) return "INVALID_PROOF";
      if (message.includes("network") || message.includes("fetch")) return "NETWORK_ERROR";
      if (message.includes("timeout")) return "TIMEOUT";
    }
  }

  return "UNKNOWN";
}

/**
 * Categorize error type for analytics/logging
 */
export type ErrorCategory = "USER" | "NETWORK" | "CONTRACT" | "WALLET" | "UNKNOWN";

export function categorizeError(error: unknown): ErrorCategory {
  const code = extractErrorCode(error);

  const userErrors = ["USER_REJECTED", "NOT_WHITELISTED", "MAX_MINT_REACHED"];
  const networkErrors = ["NETWORK_ERROR", "TIMEOUT"];
  const contractErrors = ["SALE_NOT_STARTED", "SALE_ENDED", "SOLD_OUT", "CONTRACT_REVERT", "INVALID_PROOF"];
  const walletErrors = ["INSUFFICIENT_FUNDS"];

  if (userErrors.includes(code)) return "USER";
  if (networkErrors.includes(code)) return "NETWORK";
  if (contractErrors.includes(code)) return "CONTRACT";
  if (walletErrors.includes(code)) return "WALLET";

  return "UNKNOWN";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const category = categorizeError(error);
  return category === "NETWORK" || category === "UNKNOWN";
}
