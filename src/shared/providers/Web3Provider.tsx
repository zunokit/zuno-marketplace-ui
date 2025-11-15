"use client";

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, RainbowKitAuthenticationProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/shared/config/wagmi';
import { ReactNode, useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';
import { authService } from '@/shared/services/auth.service';
import type { AuthenticationStatus } from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient();

interface AuthState {
  status: AuthenticationStatus;
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
  });

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getAccessToken();
      if (token) {
        try {
          // Verify token is still valid by fetching user
          const user = await authService.getMe();
          if (user) {
            setAuthState({ status: 'authenticated' });
            return;
          }
        } catch (error) {
          console.error('Token validation failed:', error);
        }
      }
      setAuthState({ status: 'unauthenticated' });
    };

    checkAuth();

    // Listen for logout events
    const handleLogout = () => {
      setAuthState({ status: 'unauthenticated' });
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const authenticationAdapter = {
    getNonce: async () => {
      try {
        // Get current wallet address from wagmi
        // We need to access this from the hook context
        // For now, we'll use a workaround by storing it temporarily
        const address = (window as any).__siwe_address__;
        if (!address) {
          throw new Error('No wallet address available');
        }

        const { nonce } = await authService.getNonce(address);
        return nonce;
      } catch (error) {
        console.error('Failed to get nonce:', error);
        throw error;
      }
    },

    createMessage: ({ nonce, address, chainId }: { nonce: string; address: string; chainId: number }) => {
      // Store address for getNonce callback
      (window as any).__siwe_address__ = address;

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to Zuno Marketplace',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      return message.prepareMessage();
    },

    getMessageBody: ({ message }: { message: string }) => {
      return message;
    },

    verify: async ({ message, signature }: { message: string; signature: string }) => {
      try {
        setAuthState({ status: 'loading' });

        // Verify the SIWE signature with backend
        const result = await authService.verifySiwe(signature, message);

        if (result.success) {
          setAuthState({ status: 'authenticated' });
          // Clean up temporary storage
          delete (window as any).__siwe_address__;
          return true;
        } else {
          setAuthState({ status: 'unauthenticated' });
          return false;
        }
      } catch (error) {
        console.error('SIWE verification failed:', error);
        setAuthState({ status: 'unauthenticated' });
        return false;
      }
    },

    signOut: async () => {
      authService.logout();
      setAuthState({ status: 'unauthenticated' });
    },
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={authState.status}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
