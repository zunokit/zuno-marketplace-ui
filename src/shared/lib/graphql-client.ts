/**
 * GraphQL Client for Zuno Marketplace API
 *
 * This client handles:
 * - GraphQL queries/mutations to the backend
 * - Automatic JWT access token injection
 * - Automatic token refresh on 401
 * - HTTP-only cookie handling for refresh tokens
 */

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/graphql';

export interface GraphQLError {
  message: string;
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

class GraphQLClient {
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  /**
   * Set the access token for authenticated requests
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    if (!this.accessToken && typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
    return this.accessToken;
  }

  /**
   * Refresh the access token using the refresh token cookie
   */
  private async refreshAccessToken(): Promise<string> {
    // If already refreshing, wait for that to complete
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(GRAPHQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for refresh token
          body: JSON.stringify({
            query: `
              mutation RefreshSession {
                refreshSession {
                  success
                  accessToken
                }
              }
            `,
          }),
        });

        const result: GraphQLResponse<{ refreshSession: { success: boolean; accessToken: string } }> =
          await response.json();

        if (result.errors || !result.data?.refreshSession.success) {
          throw new Error('Token refresh failed');
        }

        const newToken = result.data.refreshSession.accessToken;
        this.setAccessToken(newToken);
        return newToken;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Execute a GraphQL query or mutation
   */
  async request<T>(
    query: string,
    variables?: Record<string, unknown>,
    options?: {
      skipAuth?: boolean;
      retryOnUnauth?: boolean;
    }
  ): Promise<T> {
    const { skipAuth = false, retryOnUnauth = true } = options || {};

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if we have a token and not skipping auth
    const token = this.getAccessToken();
    if (token && !skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers,
      credentials: 'include', // Always include cookies
      body: JSON.stringify({ query, variables }),
    });

    const result: GraphQLResponse<T> = await response.json();

    // Check for authentication errors
    if (result.errors) {
      const authError = result.errors.find(
        (error) => error.extensions?.code === 'UNAUTHENTICATED' || error.message.includes('401')
      );

      if (authError && retryOnUnauth && !skipAuth) {
        try {
          // Try to refresh the token
          await this.refreshAccessToken();
          // Retry the request with the new token
          return this.request<T>(query, variables, { ...options, retryOnUnauth: false });
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to auth
          this.setAccessToken(null);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout'));
          }
          throw authError;
        }
      }

      // If it's not an auth error or retry is disabled, throw the first error
      throw new Error(result.errors[0].message);
    }

    if (!result.data) {
      throw new Error('No data returned from GraphQL');
    }

    return result.data;
  }
}

export const graphqlClient = new GraphQLClient();
