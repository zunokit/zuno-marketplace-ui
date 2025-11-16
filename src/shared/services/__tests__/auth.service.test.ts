/**
 * Authentication Service Unit Tests
 *
 * Tests for the authentication service methods including:
 * - getNonce
 * - verifySiwe
 * - refreshSession
 * - getMe
 * - revokeSession
 * - logout
 * - getAccessToken
 */

import { authService } from '../auth.service';
import { graphqlClient } from '@/shared/lib/graphql-client';
import type {
  GetNonceQuery,
  VerifySiweMutation,
  RefreshSessionMutation,
  MeQuery,
} from '@/shared/graphql/generated';

// Mock the GraphQL client
jest.mock('@/shared/lib/graphql-client', () => ({
  graphqlClient: {
    queryTyped: jest.fn(),
    mutateTyped: jest.fn(),
    setAccessToken: jest.fn(),
    getAccessToken: jest.fn(),
  },
}));

// Mock the logger
jest.mock('@/shared/lib/logger', () => ({
  authLogger: {
    group: jest.fn(),
    groupEnd: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear custom events
    if (typeof window !== 'undefined') {
      window.dispatchEvent = jest.fn();
    }
  });

  describe('getNonce', () => {
    it('should successfully get a nonce', async () => {
      // Arrange
      const mockNonce: GetNonceQuery['getNonce'] = {
        nonce: 'test-nonce-123',
        expiresAt: new Date().toISOString(),
      };

      (graphqlClient.queryTyped as jest.Mock).mockResolvedValue({
        getNonce: mockNonce,
      });

      const accountId = '0x1234567890abcdef';
      const chainId = 'eip155:1';
      const domain = 'localhost:3000';

      // Act
      const result = await authService.getNonce(accountId, chainId, domain);

      // Assert
      expect(result).toEqual(mockNonce);
      expect(graphqlClient.queryTyped).toHaveBeenCalledWith(
        expect.anything(),
        { accountId, chainId, domain },
        'GetNonce'
      );
    });

    it('should handle errors when getting nonce fails', async () => {
      // Arrange
      const error = new Error('Network error');
      (graphqlClient.queryTyped as jest.Mock).mockRejectedValue(error);

      const accountId = '0x1234567890abcdef';
      const chainId = 'eip155:1';
      const domain = 'localhost:3000';

      // Act & Assert
      await expect(
        authService.getNonce(accountId, chainId, domain)
      ).rejects.toThrow('Network error');
    });
  });

  describe('verifySiwe', () => {
    it('should successfully verify SIWE signature and create session', async () => {
      // Arrange
      const mockVerifyResult: VerifySiweMutation['verifySiwe'] = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        userId: 'user-123',
        address: '0x1234567890abcdef',
        chainId: 'eip155:1',
      };

      (graphqlClient.mutateTyped as jest.Mock).mockResolvedValue({
        verifySiwe: mockVerifyResult,
      });

      const accountId = '0x1234567890abcdef';
      const message = 'localhost:3000 wants you to sign in with your Ethereum account...';
      const signature = '0xsignature123';

      // Mock window.dispatchEvent
      const mockDispatchEvent = jest.fn();
      global.window.dispatchEvent = mockDispatchEvent;

      // Act
      const result = await authService.verifySiwe(accountId, message, signature);

      // Assert
      expect(result).toEqual(mockVerifyResult);
      expect(graphqlClient.mutateTyped).toHaveBeenCalledWith(
        expect.anything(),
        { accountId, message, signature },
        'VerifySiwe'
      );
      expect(graphqlClient.setAccessToken).toHaveBeenCalledWith('new-access-token');
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth:login',
        })
      );
    });

    it('should handle verification errors', async () => {
      // Arrange
      const error = new Error('Invalid signature');
      (graphqlClient.mutateTyped as jest.Mock).mockRejectedValue(error);

      const accountId = '0x1234567890abcdef';
      const message = 'Sign in message';
      const signature = '0xbadsignature';

      // Act & Assert
      await expect(
        authService.verifySiwe(accountId, message, signature)
      ).rejects.toThrow('Invalid signature');
    });
  });

  describe('refreshSession', () => {
    it('should successfully refresh session with new access token', async () => {
      // Arrange
      const mockRefreshResult: RefreshSessionMutation['refreshSession'] = {
        accessToken: 'refreshed-access-token',
        refreshToken: 'refreshed-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        userId: 'user-123',
      };

      (graphqlClient.mutateTyped as jest.Mock).mockResolvedValue({
        refreshSession: mockRefreshResult,
      });

      const refreshToken = 'old-refresh-token';
      const userAgent = 'Mozilla/5.0';
      const ipAddress = '192.168.1.1';

      // Act
      const result = await authService.refreshSession(refreshToken, userAgent, ipAddress);

      // Assert
      expect(result).toEqual(mockRefreshResult);
      expect(graphqlClient.mutateTyped).toHaveBeenCalledWith(
        expect.anything(),
        { refreshToken, userAgent, ipAddress },
        'RefreshSession'
      );
      expect(graphqlClient.setAccessToken).toHaveBeenCalledWith('refreshed-access-token');
    });

    it('should handle refresh errors', async () => {
      // Arrange
      const error = new Error('Refresh token expired');
      (graphqlClient.mutateTyped as jest.Mock).mockRejectedValue(error);

      const refreshToken = 'expired-refresh-token';

      // Act & Assert
      await expect(
        authService.refreshSession(refreshToken)
      ).rejects.toThrow('Refresh token expired');
    });
  });

  describe('getMe', () => {
    it('should successfully get current authenticated user', async () => {
      // Arrange
      const mockUser: MeQuery['me'] = {
        id: 'user-123',
        status: 'active',
        createdAt: new Date().toISOString(),
        profile: {
          userId: 'user-123',
          username: 'testuser',
          displayName: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
          bio: 'Test bio',
        },
      };

      (graphqlClient.queryTyped as jest.Mock).mockResolvedValue({
        me: mockUser,
      });

      // Act
      const result = await authService.getMe();

      // Assert
      expect(result).toEqual(mockUser);
      expect(graphqlClient.queryTyped).toHaveBeenCalledWith(
        expect.anything(),
        {},
        'Me'
      );
    });

    it('should return null when user is not authenticated', async () => {
      // Arrange
      const error = new Error('Unauthenticated');
      (graphqlClient.queryTyped as jest.Mock).mockRejectedValue(error);

      // Act
      const result = await authService.getMe();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when query fails', async () => {
      // Arrange
      (graphqlClient.queryTyped as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      // Act
      const result = await authService.getMe();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('revokeSession', () => {
    it('should successfully revoke a session', async () => {
      // Arrange
      (graphqlClient.mutateTyped as jest.Mock).mockResolvedValue({
        revokeSession: true,
      });

      const sessionId = 'session-123';

      // Act
      const result = await authService.revokeSession(sessionId);

      // Assert
      expect(result).toBe(true);
      expect(graphqlClient.mutateTyped).toHaveBeenCalledWith(
        expect.anything(),
        { sessionId },
        'RevokeSession'
      );
    });

    it('should return false when session revocation fails', async () => {
      // Arrange
      const error = new Error('Session not found');
      (graphqlClient.mutateTyped as jest.Mock).mockRejectedValue(error);

      const sessionId = 'invalid-session';

      // Act
      const result = await authService.revokeSession(sessionId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear access token and dispatch logout event', () => {
      // Arrange
      const mockDispatchEvent = jest.fn();
      global.window.dispatchEvent = mockDispatchEvent;

      // Act
      authService.logout();

      // Assert
      expect(graphqlClient.setAccessToken).toHaveBeenCalledWith(null);
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth:logout',
        })
      );
    });

    it('should not throw when window is undefined (SSR)', () => {
      // Arrange
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      // Act & Assert
      expect(() => authService.logout()).not.toThrow();
      expect(graphqlClient.setAccessToken).toHaveBeenCalledWith(null);

      // Cleanup
      global.window = originalWindow;
    });
  });

  describe('getAccessToken', () => {
    it('should return the current access token', () => {
      // Arrange
      const mockToken = 'current-access-token';
      (graphqlClient.getAccessToken as jest.Mock).mockReturnValue(mockToken);

      // Act
      const result = authService.getAccessToken();

      // Assert
      expect(result).toBe(mockToken);
      expect(graphqlClient.getAccessToken).toHaveBeenCalled();
    });

    it('should return null when no token exists', () => {
      // Arrange
      (graphqlClient.getAccessToken as jest.Mock).mockReturnValue(null);

      // Act
      const result = authService.getAccessToken();

      // Assert
      expect(result).toBeNull();
    });
  });
});
