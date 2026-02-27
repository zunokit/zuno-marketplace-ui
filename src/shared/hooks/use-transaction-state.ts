'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import type { Hash } from 'viem';

export type TransactionStatus =
  | 'idle'
  | 'estimating'
  | 'awaiting_signature'
  | 'submitting'
  | 'pending'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'replaced';

interface TransactionState {
  status: TransactionStatus;
  hash: Hash | null;
  nonce: number | null;
  replacedBy: Hash | null;
  error: Error | null;
  confirmations: number;
}

interface UseTransactionStateOptions {
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
  onReplaced?: (originalHash: Hash, newHash: Hash) => void;
  requiredConfirmations?: number;
}

export function useTransactionState(options: UseTransactionStateOptions = {}) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<TransactionState>({
    status: 'idle',
    hash: null,
    nonce: null,
    replacedBy: null,
    error: null,
    confirmations: 0,
  });

  const startTransaction = useCallback((nonce?: number) => {
    setState({
      status: 'awaiting_signature',
      hash: null,
      nonce: nonce ?? null,
      replacedBy: null,
      error: null,
      confirmations: 0,
    });
  }, []);

  const setSubmitted = useCallback((hash: Hash, nonce: number) => {
    setState(prev => ({ ...prev, status: 'pending', hash, nonce }));
  }, []);

  const setConfirmed = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'success',
      confirmations: (options.requiredConfirmations ?? 1),
    }));
    if (state.hash) {
      options.onSuccess?.(state.hash);
    }
  }, [options, state.hash]);

  const setFailed = useCallback((error: Error) => {
    setState(prev => ({ ...prev, status: 'failed', error }));
    options.onError?.(error);
  }, [options]);

  const setCancelled = useCallback(() => {
    setState(prev => ({ ...prev, status: 'cancelled' }));
  }, []);

  const reset = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    setState({
      status: 'idle',
      hash: null,
      nonce: null,
      replacedBy: null,
      error: null,
      confirmations: 0,
    });
  }, []);

  useEffect(() => {
    const nonce = state.nonce;
    if (state.status !== 'pending' || !nonce || !address || !publicClient) {
      return;
    }

    const checkForReplacement = async () => {
      try {
        const currentNonce = await publicClient.getTransactionCount({ address });

        if (currentNonce > nonce) {
          const block = await publicClient.getBlock({ blockTag: 'latest' });

          const currentHash = state.hash;
          for (const txHash of block.transactions) {
            const tx = await publicClient.getTransaction({ hash: txHash });
            if (tx?.from === address && tx.nonce === nonce) {
              if (txHash !== currentHash) {
                setState(prev => ({ ...prev, status: 'replaced', replacedBy: txHash }));
                if (currentHash) {
                  options.onReplaced?.(currentHash, txHash);
                }
              }
              break;
            }
          }
        }
      } catch (error) {
        console.error('Error checking for replacement:', error);
      }
    };

    checkIntervalRef.current = setInterval(checkForReplacement, 2000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [state.status, state.nonce, state.hash, address, publicClient, options]);

  return {
    ...state,
    isPending: state.status === 'pending' || state.status === 'confirming',
    isSuccess: state.status === 'success',
    isFailed: state.status === 'failed' || state.status === 'cancelled',
    isReplaced: state.status === 'replaced',
    startTransaction,
    setSubmitted,
    setConfirmed,
    setFailed,
    setCancelled,
    reset,
  };
}
