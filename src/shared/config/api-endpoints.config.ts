/**
 * API Configuration
 *
 * Centralized API endpoint configuration.
 * Uses NEXT_PUBLIC_* env vars which work in both browser and server.
 */

/**
 * Backend API base URL
 */
export const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4080";

/**
 * GraphQL API endpoint URL
 * Priority: NEXT_PUBLIC_GRAPHQL_URL > NEXT_PUBLIC_BACKEND_URL + /graphql
 */
export const GRAPHQL_URL = `${BACKEND_URL}/graphql`;
