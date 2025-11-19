"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMeLazyQuery, useLogoutMutation } from '@/shared/graphql/hooks';
import { graphqlClient } from '@/shared/lib/graphql-client';
import type { AuthUser } from '@/shared/types/auth';

/**
 * Client-side authentication hook
 *
 * Uses generated GraphQL hooks for type-safe authentication.
 * Apollo handles automatic token refresh via error link.
 *
 * @returns Authentication state and methods
 */
export function useAuth() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use generated lazy query hook
  const [getMe] = useMeLazyQuery({
    fetchPolicy: 'network-only',
  });
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Try to get user data using generated hook
        // If no access token exists, Apollo will automatically:
        // 1. Detect "authentication required" error
        // 2. Attempt to refresh using HTTP-only cookie
        // 3. Retry the request with the new token
        const { data } = await getMe();

        if (data?.me) {
          setUser(data.me as AuthUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Auth check failed (no valid session)
        // This is expected if user is not logged in or refresh token expired
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    const handleLogin = async () => {
      await checkAuth();
    };

    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('auth:login', handleLogin);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('auth:login', handleLogin);
    };
  }, [isConnected, address]);

  const logout = async () => {
    try {
      // Call logout mutation
      await logoutMutation();

      // Clear access token
      graphqlClient.setAccessToken(null);

      setUser(null);
      setIsAuthenticated(false);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if logout call fails
      graphqlClient.setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    address: address || null,
    isWalletConnected: isConnected,
  };
}
