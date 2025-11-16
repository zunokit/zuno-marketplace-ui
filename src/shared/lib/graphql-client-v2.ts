/**
 * GraphQL Client v2 - Using graphql-request
 *
 * Benefits over fetch:
 * - Better error handling with typed errors
 * - Automatic retry logic
 * - Request/response middleware
 * - TypeScript support
 * - Smaller bundle size
 * - Better developer experience
 */

import { GraphQLClient, ClientError } from 'graphql-request';
import { graphqlLogger } from './logger';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/graphql';

export class GraphQLClientV2 {
  private client: GraphQLClient;
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    graphqlLogger.info('Initializing GraphQL Client', { url: GRAPHQL_URL });

    this.client = new GraphQLClient(GRAPHQL_URL, {
      credentials: 'include', // Include cookies
      headers: {},
    });

    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      if (this.accessToken) {
        graphqlLogger.debug('Loaded access token from localStorage');
      }
    }
  }

  /**
   * Set the access token for authenticated requests
   */
  setAccessToken(token: string | null) {
    graphqlLogger.debug('Setting access token', { hasToken: !!token });

    this.accessToken = token;

    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }

    // Update client headers
    this.updateHeaders();
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Update client headers with current token
   */
  private updateHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    this.client.setHeaders(headers);
  }

  /**
   * Refresh the access token using refresh token cookie
   */
  private async refreshAccessToken(): Promise<string> {
    graphqlLogger.info('Refreshing access token');

    // If already refreshing, wait for that to complete
    if (this.refreshPromise) {
      graphqlLogger.debug('Token refresh already in progress, waiting...');
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        graphqlLogger.time('Token refresh');

        const mutation = `
          mutation RefreshSession {
            refreshSession {
              success
              accessToken
            }
          }
        `;

        const result: { refreshSession: { success: boolean; accessToken: string } } =
          await this.client.request(mutation);

        if (!result.refreshSession.success) {
          throw new Error('Token refresh failed');
        }

        const newToken = result.refreshSession.accessToken;
        this.setAccessToken(newToken);

        graphqlLogger.timeEnd('Token refresh');
        graphqlLogger.info('Access token refreshed successfully');

        return newToken;
      } catch (error) {
        graphqlLogger.error('Token refresh failed', error);
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Execute a GraphQL query or mutation with automatic retry on auth errors
   */
  async request<T>(
    query: string,
    variables?: Record<string, unknown>,
    options?: {
      skipAuth?: boolean;
      retryOnUnauth?: boolean;
      operationName?: string;
    }
  ): Promise<T> {
    const { skipAuth = false, retryOnUnauth = true, operationName = 'GraphQL Request' } = options || {};

    graphqlLogger.group(operationName);
    graphqlLogger.debug('Request details', {
      operationName,
      variables: variables ? Object.keys(variables) : [],
      hasAuth: !!this.accessToken,
      skipAuth,
    });

    try {
      // Update headers with current token
      if (!skipAuth) {
        this.updateHeaders();
      }

      graphqlLogger.time(operationName);
      const result = await this.client.request<T>(query, variables);
      graphqlLogger.timeEnd(operationName);

      graphqlLogger.debug('Request successful', { operationName });
      graphqlLogger.groupEnd();

      return result;
    } catch (error) {
      graphqlLogger.timeEnd(operationName);

      // Check if it's an authentication error
      if (error instanceof ClientError) {
        const isAuthError =
          error.response.status === 401 ||
          error.response.errors?.some(
            (e) => e.extensions?.code === 'UNAUTHENTICATED' || e.message.includes('401')
          );

        if (isAuthError && retryOnUnauth && !skipAuth) {
          graphqlLogger.warn('Authentication error, attempting token refresh');

          try {
            // Try to refresh the token
            await this.refreshAccessToken();

            // Retry the request with new token
            graphqlLogger.info('Retrying request with new token', { operationName });
            return this.request<T>(query, variables, { ...options, retryOnUnauth: false });
          } catch (refreshError) {
            // Refresh failed, clear tokens and notify
            graphqlLogger.error('Token refresh failed, logging out', refreshError);
            this.setAccessToken(null);

            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:logout'));
            }

            throw error;
          }
        }

        // Not an auth error or retry disabled
        graphqlLogger.error('GraphQL Client Error', error, {
          operationName,
          status: error.response.status,
          errors: error.response.errors,
        });
      } else {
        graphqlLogger.error('Network or unexpected error', error, { operationName });
      }

      graphqlLogger.groupEnd();
      throw error;
    }
  }

  /**
   * Execute a GraphQL query
   */
  async query<T>(
    query: string,
    variables?: Record<string, unknown>,
    operationName?: string
  ): Promise<T> {
    return this.request<T>(query, variables, { operationName });
  }

  /**
   * Execute a GraphQL mutation
   */
  async mutate<T>(
    mutation: string,
    variables?: Record<string, unknown>,
    operationName?: string
  ): Promise<T> {
    return this.request<T>(mutation, variables, { operationName });
  }
}

// Export singleton instance
export const graphqlClient = new GraphQLClientV2();
