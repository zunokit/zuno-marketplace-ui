/**
 * Authentication Service V2
 *
 * Enhanced with better GraphQL client and comprehensive logging
 */

import { graphqlClient } from '@/shared/lib/graphql-client-v2';
import { authLogger } from '@/shared/lib/logger';
import type {
  NonceResponse,
  AuthResponse,
  RefreshResponse,
  AuthUser,
} from '@/shared/types/auth';

class AuthServiceV2 {
  /**
   * Get a nonce for SIWE authentication
   */
  async getNonce(accountId: string, chainId: string, domain: string): Promise<NonceResponse> {
    authLogger.group('Get Nonce');
    authLogger.info('Requesting nonce', { accountId, chainId, domain });

    try {
      const query = `
        query GetNonce($accountId: String!, $chainId: String!, $domain: String!) {
          getNonce(accountId: $accountId, chainId: $chainId, domain: $domain) {
            nonce
            expiresAt
          }
        }
      `;

      const data = await graphqlClient.query<{ getNonce: NonceResponse }>(
        query,
        { accountId, chainId, domain },
        'GetNonce'
      );

      authLogger.info('Nonce retrieved successfully', {
        expiresAt: data.getNonce.expiresAt,
      });
      authLogger.groupEnd();

      return data.getNonce;
    } catch (error) {
      authLogger.error('Failed to get nonce', error, { accountId, chainId, domain });
      authLogger.groupEnd();
      throw error;
    }
  }

  /**
   * Verify SIWE signature and create session
   */
  async verifySiwe(accountId: string, message: string, signature: string): Promise<AuthResponse> {
    authLogger.group('Verify SIWE');
    authLogger.info('Verifying SIWE signature', {
      accountId,
      signatureLength: signature.length,
      messagePreview: message.substring(0, 50) + '...',
    });

    try {
      const mutation = `
        mutation VerifySiwe($accountId: String!, $message: String!, $signature: String!) {
          verifySiwe(accountId: $accountId, message: $message, signature: $signature) {
            accessToken
            refreshToken
            expiresAt
            userId
            address
            chainId
          }
        }
      `;

      const data = await graphqlClient.mutate<{ verifySiwe: AuthResponse }>(
        mutation,
        { accountId, message, signature },
        'VerifySiwe'
      );

      // Store access token
      graphqlClient.setAccessToken(data.verifySiwe.accessToken);

      authLogger.info('SIWE verification successful', {
        userId: data.verifySiwe.userId,
        address: data.verifySiwe.address,
      });

      // Dispatch login event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:login'));
      }

      authLogger.groupEnd();
      return data.verifySiwe;
    } catch (error) {
      authLogger.error('SIWE verification error', error);
      authLogger.groupEnd();
      throw error;
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshSession(refreshToken: string): Promise<RefreshResponse> {
    authLogger.info('Refreshing session');

    try {
      const mutation = `
        mutation RefreshSession($refreshToken: String!) {
          refreshSession(refreshToken: $refreshToken) {
            accessToken
            refreshToken
            expiresAt
            userId
          }
        }
      `;

      const data = await graphqlClient.mutate<{ refreshSession: RefreshResponse }>(
        mutation,
        { refreshToken },
        'RefreshSession'
      );

      graphqlClient.setAccessToken(data.refreshSession.accessToken);
      authLogger.info('Session refreshed successfully');

      return data.refreshSession;
    } catch (error) {
      authLogger.error('Session refresh error', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<AuthUser | null> {
    authLogger.debug('Fetching current user');

    try {
      const query = `
        query Me {
          me {
            id
            status
            createdAt
            profile {
              userId
              username
              displayName
              avatarUrl
              bannerUrl
              bio
              locale
              timezone
              socialsJson
              updatedAt
            }
          }
        }
      `;

      const data = await graphqlClient.query<{ me: AuthUser }>(query, undefined, 'Me');

      authLogger.debug('Current user fetched', {
        userId: data.me.id,
        username: data.me.profile?.username,
      });

      return data.me;
    } catch (error) {
      authLogger.error('Failed to get current user', error);
      return null;
    }
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<boolean> {
    authLogger.info('Revoking session', { sessionId });

    try {
      const mutation = `
        mutation RevokeSession($sessionId: String!) {
          revokeSession(sessionId: $sessionId) {
            success
          }
        }
      `;

      const data = await graphqlClient.mutate<{ revokeSession: { success: boolean } }>(
        mutation,
        { sessionId },
        'RevokeSession'
      );

      authLogger.info('Session revoked', {
        sessionId,
        success: data.revokeSession.success,
      });

      return data.revokeSession.success;
    } catch (error) {
      authLogger.error('Failed to revoke session', error, { sessionId });
      return false;
    }
  }

  /**
   * Logout - clear tokens
   */
  logout() {
    authLogger.info('Logging out');
    graphqlClient.setAccessToken(null);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return graphqlClient.getAccessToken();
  }
}

export const authService = new AuthServiceV2();
