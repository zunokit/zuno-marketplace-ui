/**
 * Apollo Client Configuration
 *
 * Centralized Apollo Client setup with:
 * - Authentication via Bearer token
 * - Cookie credentials for refresh tokens
 * - Automatic token refresh on auth errors
 * - Error handling and logging
 * - TypeScript type safety
 */

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8081/graphql';

/**
 * Callback for token refresh
 * This will be set by the ApolloClientWrapper
 */
let onTokenRefreshCallback: (() => Promise<string | null>) | null = null;

/**
 * Callback to get current access token
 * This allows dynamic token retrieval for the authLink
 */
let getAccessTokenCallback: (() => string | null) | null = null;

export function setTokenRefreshCallback(callback: () => Promise<string | null>) {
  onTokenRefreshCallback = callback;
}

export function setGetAccessTokenCallback(callback: () => string | null) {
  getAccessTokenCallback = callback;
}

/**
 * Create Apollo Client instance
 * Can be called multiple times for SSR (each request gets fresh client)
 */
export function createApolloClient(accessToken?: string | null) {
  // HTTP connection to GraphQL API
  const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
    credentials: 'include', // Send cookies (for refresh token)
  });

  // Auth middleware: Add Bearer token to headers
  // Use dynamic token getter if available, otherwise use the provided token
  const authLink = setContext((_, { headers }) => {
    const token = getAccessTokenCallback ? getAccessTokenCallback() : accessToken;
    return {
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    };
  });

  // Error handling: Automatic token refresh on authentication errors
  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // Check if error is authentication-related
        if (
          err.message === 'authentication required' ||
          err.extensions?.code === 'UNAUTHENTICATED'
        ) {
          // Try to refresh token if callback is available
          if (onTokenRefreshCallback) {
            console.log('[Apollo] Auth error detected, attempting token refresh...');

            return new Promise((resolve, reject) => {
              onTokenRefreshCallback!()
                .then((newToken) => {
                  if (newToken) {
                    console.log('[Apollo] Token refreshed, retrying request');
                    // Token refreshed successfully, retry the operation
                    // Note: The new token will be used automatically because
                    // the wrapper recreates the client with the new token
                    resolve(forward(operation));
                  } else {
                    console.log('[Apollo] Token refresh failed, redirecting to login');
                    reject(new Error('Token refresh failed'));
                  }
                })
                .catch((error) => {
                  console.error('[Apollo] Token refresh error:', error);
                  reject(error);
                });
            });
          }
        }
      }
    }
  });

  // Create and return Apollo Client
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Example: Customize cache behavior per field if needed
            // me: {
            //   merge: true,
            // },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}
