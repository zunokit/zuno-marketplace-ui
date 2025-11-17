/**
 * Apollo Client Wrapper
 *
 * Singleton wrapper for Apollo Client with:
 * - Access token management (in-memory)
 * - Typed query/mutation helpers
 * - Logging integration
 */

import type { ApolloClient, OperationVariables } from '@apollo/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { createApolloClient } from './apollo-client';
import { graphqlLogger } from '@/shared/lib/logger';

class ApolloClientWrapper {
  private client: ApolloClient;
  private accessToken: string | null = null;

  constructor() {
    this.client = createApolloClient(this.accessToken);
    graphqlLogger.debug('Apollo Client wrapper initialized');
  }

  /**
   * Set access token and recreate client with new token
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
    this.client = createApolloClient(this.accessToken);

    if (token) {
      graphqlLogger.debug('Access token set, client recreated');
    } else {
      graphqlLogger.debug('Access token cleared, client recreated');
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
    const opName = operationName || 'GraphQL Query';
    graphqlLogger.group(opName);
    graphqlLogger.debug('Query details', {
      operationName: opName,
      hasAuth: !!this.accessToken,
    });

    try {
      graphqlLogger.time(opName);
      const result = await this.client.query<TResult, TVariables>({
        query: document,
        variables,
        fetchPolicy: 'network-only',
      });
      graphqlLogger.timeEnd(opName);

      if (!result.data) {
        throw new Error('Query returned no data');
      }

      graphqlLogger.debug('Query successful');
      graphqlLogger.groupEnd();

      return result.data;
    } catch (error) {
      graphqlLogger.timeEnd(opName);
      graphqlLogger.error('Query failed', error);
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
    const opName = operationName || 'GraphQL Mutation';
    graphqlLogger.group(opName);
    graphqlLogger.debug('Mutation details', {
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
        throw new Error('Mutation returned no data');
      }

      graphqlLogger.debug('Mutation successful');
      graphqlLogger.groupEnd();

      return result.data;
    } catch (error) {
      graphqlLogger.timeEnd(opName);
      graphqlLogger.error('Mutation failed', error);
      graphqlLogger.groupEnd();
      throw error;
    }
  }
}

// Export singleton instance
export const apolloWrapper = new ApolloClientWrapper();
