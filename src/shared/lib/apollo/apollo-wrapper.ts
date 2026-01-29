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
import { graphqlLogger } from "@/shared/lib/logger";
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

    graphqlLogger.debug("Apollo Client wrapper initialized");
  }

  /**
   * Handle token refresh (called by Apollo error link)
   */
  private async handleTokenRefresh(): Promise<string | null> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing) {
      graphqlLogger.debug("Token refresh already in progress, waiting...");
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        graphqlLogger.info("Attempting to refresh access token...");

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

        graphqlLogger.info("Access token refreshed successfully");
        return result.data.refreshSession.accessToken;
      } catch (error) {
        graphqlLogger.error("Token refresh failed", error);

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
      graphqlLogger.debug("Access token set");
    } else {
      graphqlLogger.debug("Access token cleared");
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
    graphqlLogger.group(opName);
    graphqlLogger.debug("Query details", {
      operationName: opName,
      hasAuth: !!this.accessToken,
    });

    try {
      graphqlLogger.time(opName);
      const result = await this.client.query<TResult, TVariables>({
        query: document,
        variables,
        fetchPolicy: "network-only",
      });
      graphqlLogger.timeEnd(opName);

      if (!result.data) {
        throw new Error("Query returned no data");
      }

      graphqlLogger.debug("Query successful");
      graphqlLogger.groupEnd();

      return result.data;
    } catch (error) {
      graphqlLogger.timeEnd(opName);
      graphqlLogger.error("Query failed", error);
      graphqlLogger.groupEnd();
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
    graphqlLogger.group(opName);
    graphqlLogger.debug("Mutation details", {
      operationName: opName,
      hasAuth: !!this.accessToken,
    });

    try {
      graphqlLogger.time(opName);
      const result = await this.client.mutate<TResult, TVariables>({
        mutation: document,
        variables,
      });
      graphqlLogger.timeEnd(opName);

      if (!result.data) {
        throw new Error("Mutation returned no data");
      }

      graphqlLogger.debug("Mutation successful");
      graphqlLogger.groupEnd();

      return result.data;
    } catch (error) {
      graphqlLogger.timeEnd(opName);
      graphqlLogger.error("Mutation failed", error);
      graphqlLogger.groupEnd();
      throw error;
    }
  }
}

// Export singleton instance
export const apolloWrapper = new ApolloClientWrapper();
