"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { authService } from '@/shared/services/auth.service';
import type { AuthUser } from '@/shared/types/auth';

export function useAuth() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // ✅ FIX: Check auth independently of wallet connection
        // User can be authenticated even if wallet temporarily disconnected
        // Silent session restore via refresh token cookie happens in getMe()
        const userData = await authService.getMe();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth events
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
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
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
