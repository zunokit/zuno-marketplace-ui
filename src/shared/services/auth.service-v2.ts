/**
 * Authentication Service V2
 *
 * Enhanced with better GraphQL client and comprehensive logging
 */

import { graphqlClient } from '@/shared/lib/graphql-client-v2';
import { authLogger } from '@/shared/lib/logger';
import type {
  NonceResponse,
  VerifySiweResponse,
  RefreshSessionResponse,
  AuthUser,
} from '@/shared/types/auth';

class AuthServiceV2 {
  /**
   * Get a nonce for SIWE authentication
   */
  async getNonce(walletAddress: string): Promise<NonceResponse> {
    authLogger.group('Get Nonce');
    authLogger.info('Requesting nonce', { walletAddress });

    try {
      const query = `
        query GetNonce($walletAddress: String!) {
          getNonce(walletAddress: $walletAddress) {
            nonce
            expiresAt
          }
        }
      `;

      const data = await graphqlClient.query<{ getNonce: NonceResponse }>(
        query,
        { walletAddress },
        'GetNonce'
      );

      authLogger.info('Nonce retrieved successfully', {
        expiresAt: data.getNonce.expiresAt,
      });
      authLogger.groupEnd();

      return data.getNonce;
    } catch (error) {
      authLogger.error('Failed to get nonce', error, { walletAddress });
      authLogger.groupEnd();
      throw error;
    }
  }

  /**
   * Verify SIWE signature and create session
   */
  async verifySiwe(signature: string, message: string): Promise<VerifySiweResponse> {
    authLogger.group('Verify SIWE');
    authLogger.info('Verifying SIWE signature', {
      signatureLength: signature.length,
      messagePreview: message.substring(0, 50) + '...',
    });

    try {
      const mutation = `
        mutation VerifySiwe($signature: String!, $message: String!) {
          verifySiwe(signature: $signature, message: $message) {
            success
            user {
              id
              walletAddress
              username
              email
              bio
              avatarUrl
              bannerUrl
              isEmailVerified
              createdAt
            }
            accessToken
          }
        }
      `;

      const data = await graphqlClient.mutate<{ verifySiwe: VerifySiweResponse }>(
        mutation,
        { signature, message },
        'VerifySiwe'
      );

      if (data.verifySiwe.success) {
        // Store access token
        graphqlClient.setAccessToken(data.verifySiwe.accessToken);

        authLogger.info('SIWE verification successful', {
          userId: data.verifySiwe.user.id,
          walletAddress: data.verifySiwe.user.walletAddress,
        });

        // Dispatch login event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:login'));
        }
      } else {
        authLogger.warn('SIWE verification failed');
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
   * Refresh the access token using refresh token cookie
   */
  async refreshSession(): Promise<RefreshSessionResponse> {
    authLogger.info('Refreshing session');

    try {
      const mutation = `
        mutation RefreshSession {
          refreshSession {
            success
            accessToken
          }
        }
      `;

      const data = await graphqlClient.mutate<{ refreshSession: RefreshSessionResponse }>(
        mutation,
        undefined,
        'RefreshSession'
      );

      if (data.refreshSession.success) {
        graphqlClient.setAccessToken(data.refreshSession.accessToken);
        authLogger.info('Session refreshed successfully');
      } else {
        authLogger.warn('Session refresh failed');
      }

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
        query GetMe {
          getUser {
            id
            walletAddress
            username
            email
            bio
            avatarUrl
            bannerUrl
            isEmailVerified
            createdAt
          }
        }
      `;

      const data = await graphqlClient.query<{ getUser: AuthUser }>(query, undefined, 'GetMe');

      authLogger.debug('Current user fetched', {
        userId: data.getUser.id,
        walletAddress: data.getUser.walletAddress,
      });

      return data.getUser;
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
