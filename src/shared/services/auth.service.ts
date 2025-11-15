/**
 * Authentication Service
 *
 * Handles all authentication-related API calls:
 * - Getting nonce for SIWE
 * - Verifying SIWE signature
 * - Refreshing sessions
 * - Revoking sessions
 */

import { graphqlClient } from '@/shared/lib/graphql-client';
import type {
  NonceResponse,
  VerifySiweResponse,
  RefreshSessionResponse,
  AuthUser,
} from '@/shared/types/auth';

class AuthService {
  /**
   * Get a nonce for SIWE authentication
   */
  async getNonce(walletAddress: string): Promise<NonceResponse> {
    const data = await graphqlClient.request<{ getNonce: NonceResponse }>(
      `
        query GetNonce($walletAddress: String!) {
          getNonce(walletAddress: $walletAddress) {
            nonce
            expiresAt
          }
        }
      `,
      { walletAddress },
      { skipAuth: true }
    );

    return data.getNonce;
  }

  /**
   * Verify SIWE signature and create session
   */
  async verifySiwe(signature: string, message: string): Promise<VerifySiweResponse> {
    const data = await graphqlClient.request<{ verifySiwe: VerifySiweResponse }>(
      `
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
      `,
      { signature, message },
      { skipAuth: true }
    );

    if (data.verifySiwe.success) {
      // Store access token
      graphqlClient.setAccessToken(data.verifySiwe.accessToken);
    }

    return data.verifySiwe;
  }

  /**
   * Refresh the access token using refresh token cookie
   */
  async refreshSession(): Promise<RefreshSessionResponse> {
    const data = await graphqlClient.request<{ refreshSession: RefreshSessionResponse }>(
      `
        mutation RefreshSession {
          refreshSession {
            success
            accessToken
          }
        }
      `,
      undefined,
      { skipAuth: true, retryOnUnauth: false }
    );

    if (data.refreshSession.success) {
      graphqlClient.setAccessToken(data.refreshSession.accessToken);
    }

    return data.refreshSession;
  }

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<AuthUser | null> {
    try {
      const data = await graphqlClient.request<{ getUser: AuthUser }>(
        `
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
        `
      );

      return data.getUser;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<boolean> {
    const data = await graphqlClient.request<{ revokeSession: { success: boolean } }>(
      `
        mutation RevokeSession($sessionId: String!) {
          revokeSession(sessionId: $sessionId) {
            success
          }
        }
      `,
      { sessionId }
    );

    return data.revokeSession.success;
  }

  /**
   * Logout - clear tokens
   */
  logout() {
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

export const authService = new AuthService();
