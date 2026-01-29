"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useMeLazyQuery, useLogoutMutation, useRefreshSessionMutation } from "@/shared/graphql";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { AuthUser } from "@/shared/types/auth";

// Singleton refresh state to prevent race conditions
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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
  const hasCheckedAuth = useRef(false);

  // Use generated lazy query hook
  const [getMe] = useMeLazyQuery({
    fetchPolicy: "network-only",
  });
  const [logoutMutation] = useLogoutMutation();
  const [refreshSession] = useRefreshSessionMutation();

  // Singleton refresh function to prevent race conditions
  const refreshSessionSingleton = async (): Promise<string | null> => {
    // If already refreshing, wait for the existing promise
    if (isRefreshing && refreshPromise) {
      console.log("[Auth] Refresh already in progress, waiting...");
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const { data } = await refreshSession();

        if (data?.refreshSession?.accessToken) {
          graphqlClient.setAccessToken(data.refreshSession.accessToken);
          console.log("[Auth] Session refreshed successfully");
          return data.refreshSession.accessToken;
        }
        return null;
      } catch (error) {
        console.log("[Auth] No valid refresh token, user needs to sign in");
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  useEffect(() => {
    // Prevent duplicate auth checks
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // First, try to refresh session using singleton
        await refreshSessionSingleton();

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
      hasCheckedAuth.current = false; // Reset so auth check runs on next login
    };

    const handleLogin = async () => {
      // After sign-in, token is already set by SignInButton
      // Just fetch user data without trying to refresh session
      try {
        const { data } = await getMe();
        if (data?.me) {
          setUser(data.me as AuthUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("[Auth] Failed to get user after login:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    window.addEventListener("auth:logout", handleLogout);
    window.addEventListener("auth:login", handleLogin);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
      window.removeEventListener("auth:login", handleLogin);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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
