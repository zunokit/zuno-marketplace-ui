/**
 * Apollo Client Configuration
 *
 * Centralized Apollo Client setup with:
 * - Authentication via Bearer token
 * - Cookie credentials for refresh tokens
 * - Error handling and logging
 * - TypeScript type safety
 */

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8081/graphql';

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
  const authLink = setContext((_, { headers }) => {
    const token = accessToken;
    return {
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    };
  });

  // Create and return Apollo Client
  return new ApolloClient({
    link: from([authLink, httpLink]),
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
