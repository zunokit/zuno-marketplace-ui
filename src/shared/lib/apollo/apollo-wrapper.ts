/**
 * Apollo Client Wrapper
 *
 * Singleton wrapper for Apollo Client with:
 * - Access token management (in-memory)
 * - Automatic token refresh on auth errors
 * - Typed query/mutation helpers
 * - Logging integration
 */

import type { ApolloClient, OperationVariables } from "@apollo/client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  createApolloClient,
  setTokenRefreshCallback,
  setGetAccessTokenCallback,
} from "./apollo-client";
import { logger } from "@/shared/lib/logger";
import { RefreshSessionDocument, type RefreshSessionMutation } from "@/shared/graphql";

class ApolloClientWrapper {
  private client: ApolloClient;
  private accessToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.client = createApolloClient(this.accessToken);

    // Register token getter callback for Apollo authLink
    setGetAccessTokenCallback(() => {
      return this.accessToken;
    });

    // Register token refresh callback for Apollo error link
    setTokenRefreshCallback(async () => {
      return this.handleTokenRefresh();
    });

    logger.debug({ prefix: "GraphQL" }, "Apollo Client wrapper initialized");
  }

  /**
   * Handle token refresh (called by Apollo error link)
   */
  private async handleTokenRefresh(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing) {
      logger.debug({ prefix: "GraphQL" }, "Token refresh already in progress, waiting...");
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        logger.info({ prefix: "GraphQL" }, "Attempting to refresh access token...");

        // Call refreshSession mutation directly (will use HTTP-only cookie)
        const result = await this.client.mutate<RefreshSessionMutation>({
          mutation: RefreshSessionDocument,
          variables: {},
        });

        if (!result.data?.refreshSession) {
          throw new Error("RefreshSession mutation returned no data");
        }

        // Update the access token
        this.setAccessToken(result.data.refreshSession.accessToken);

        logger.info({ prefix: "GraphQL" }, "Access token refreshed successfully");
        return result.data.refreshSession.accessToken;
      } catch (error) {
        logger.error({ prefix: "GraphQL", err: error }, "Token refresh failed");

        // Clear the token on refresh failure
        this.setAccessToken(null);

        // Dispatch logout event to notify the app
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }

        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Set access token (used dynamically by authLink)
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;

    if (token) {
      logger.debug({ prefix: "GraphQL" }, "Access token set");
    } else {
      logger.debug({ prefix: "GraphQL" }, "Access token cleared");
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get Apollo Client instance
   */
  getClient(): ApolloClient {
    return this.client;
  }

  /**
   * Execute typed GraphQL query
   */
  async queryTyped<TResult, TVariables extends OperationVariables>(
    document: TypedDocumentNode<TResult, TVariables>,
    variables: TVariables,
    operationName?: string
  ): Promise<TResult> {
    const opName = operationName || "GraphQL Query";
    logger.debug({ prefix: "GraphQL", operationName: opName, hasAuth: !!this.accessToken }, `Query: ${opName}`);

    try {
      const startTime = Date.now();
      const result = await this.client.query<TResult, TVariables>({
        query: document,
        variables,
        fetchPolicy: "network-only",
      });
      const duration = Date.now() - startTime;

      if (!result.data) {
        throw new Error("Query returned no data");
      }

      logger.debug({ prefix: "GraphQL", duration }, "Query successful");

      return result.data;
    } catch (error) {
      logger.error({ prefix: "GraphQL", err: error }, "Query failed");
      throw error;
    }
  }

  /**
   * Execute typed GraphQL mutation
   */
  async mutateTyped<TResult, TVariables extends OperationVariables>(
    document: TypedDocumentNode<TResult, TVariables>,
    variables: TVariables,
    operationName?: string
  ): Promise<TResult> {
    const opName = operationName || "GraphQL Mutation";
    logger.debug({ prefix: "GraphQL", operationName: opName, hasAuth: !!this.accessToken }, `Mutation: ${opName}`);

    try {
      const startTime = Date.now();
      const result = await this.client.mutate<TResult, TVariables>({
        mutation: document,
        variables,
      });
      const duration = Date.now() - startTime;

      if (!result.data) {
        throw new Error("Mutation returned no data");
      }

      logger.debug({ prefix: "GraphQL", duration }, "Mutation successful");

      return result.data;
    } catch (error) {
      logger.error({ prefix: "GraphQL", err: error }, "Mutation failed");
      throw error;
    }
  }
}

// Export singleton instance
export const apolloWrapper = new ApolloClientWrapper();
