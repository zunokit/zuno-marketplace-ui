"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useMeLazyQuery, useLogoutMutation, useRefreshSessionMutation } from "@/shared/graphql";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { AuthUser } from "@/shared/types/auth";

/**
 * Client-side authentication hook
 *
 * Uses generated GraphQL hooks for type-safe authentication.
 * Automatically refreshes session on mount using HttpOnly refresh token cookie.
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
    fetchPolicy: "network-only",
  });
  const [logoutMutation] = useLogoutMutation();
  const [refreshSession] = useRefreshSessionMutation();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // First, try to refresh session using HttpOnly cookie
        // This will restore the accessToken if user has a valid refresh token
        const refreshPromise = refreshSession().catch((error: unknown) => {
          // Refresh failed - this is okay, user might not have a valid session
          console.log("[Auth] No valid refresh token, user needs to sign in", error);
          return null;
        });

        const refreshResult = await refreshPromise;
        if (refreshResult?.data?.refreshSession?.accessToken) {
          // Store the new access token
          graphqlClient.setAccessToken(refreshResult.data.refreshSession.accessToken);
          console.log("[Auth] Session refreshed successfully");
        }

        // Now try to get user data
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

    window.addEventListener("auth:logout", handleLogout);
    window.addEventListener("auth:login", handleLogin);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
      window.removeEventListener("auth:login", handleLogin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  const logout = async () => {
    try {
      // Call logout mutation
      await logoutMutation();

      // Clear access token
      graphqlClient.setAccessToken(null);

      setUser(null);
      setIsAuthenticated(false);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if logout call fails
      graphqlClient.setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
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
