"use client";

import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { authService } from '@/shared/services/auth.service';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/useAuth';
import { useState } from 'react';
import { walletLogger } from '@/shared/lib/logger';

export function SignInButton() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!address || !chainId) {
      walletLogger.error('No wallet connected');
      return;
    }

    walletLogger.group('SIWE Sign In');
    walletLogger.info('Starting SIWE authentication', {
      address,
      chainId,
      domain: window.location.host,
    });

    try {
      setIsLoading(true);

      const domain = window.location.host;
      const accountId = address; // Just the Ethereum address (0x...)
      const chainIdCaip2 = `eip155:${chainId}`; // CAIP-2 format

      // 1. Get nonce from backend
      walletLogger.info('Step 1: Getting nonce from backend');
      const { nonce } = await authService.getNonce(accountId, chainIdCaip2, domain);
      walletLogger.debug('Nonce received', { nonceLength: nonce.length });

      // 2. Create SIWE message
      walletLogger.info('Step 2: Creating SIWE message');
      const message = new SiweMessage({
        domain,
        address,
        statement: 'Sign in to Zuno Marketplace',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      const preparedMessage = message.prepareMessage();
      walletLogger.debug('SIWE message prepared', {
        messageLength: preparedMessage.length,
        messagePreview: preparedMessage.substring(0, 100) + '...',
      });

      // 3. Request signature from wallet
      walletLogger.info('Step 3: Requesting signature from wallet');
      const signature = await signMessageAsync({
        message: preparedMessage,
      });
      walletLogger.debug('Signature received', {
        signatureLength: signature.length,
        signaturePreview: signature.substring(0, 20) + '...',
      });

      // 4. Verify signature with backend
      walletLogger.info('Step 4: Verifying signature with backend');
      const result = await authService.verifySiwe(accountId, preparedMessage, signature);

      walletLogger.info('✅ Sign in successful!', {
        userId: result.userId,
        address: result.address,
      });
      walletLogger.groupEnd();
    } catch (error) {
      walletLogger.error('❌ Sign in error', error);
      walletLogger.groupEnd();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    walletLogger.info('User initiated sign out');
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
