"use client";

import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { authService } from '@/shared/services/auth.service';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/useAuth';
import { useState } from 'react';

export function SignInButton() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!address || !chainId) {
      console.error('No wallet connected');
      return;
    }

    try {
      setIsLoading(true);

      // 1. Get nonce from backend
      const { nonce } = await authService.getNonce(address);

      // 2. Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to Zuno Marketplace',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      const preparedMessage = message.prepareMessage();

      // 3. Request signature from wallet
      const signature = await signMessageAsync({
        message: preparedMessage,
      });

      // 4. Verify signature with backend
      const result = await authService.verifySiwe(signature, preparedMessage);

      if (result.success) {
        // Trigger auth state update
        window.dispatchEvent(new CustomEvent('auth:login'));
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
  };

  if (!address) {
    return null; // Only show when wallet is connected
  }

  if (isAuthenticated) {
    return (
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Sign Out
      </Button>
    );
  }

  return (
    <Button variant="default" size="sm" onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}
