'use client';

import { useCallback, useState } from 'react';
import { isRecoverableError, CollectionError, CreationStep } from '@/shared/errors/collection-errors';

interface RecoveryState {
  failedStep: CreationStep | null;
  error: CollectionError | null;
  retryCount: number;
  canRetry: boolean;
}

interface UseRecoveryOptions {
  maxRetries?: number;
  onRetry?: (step: CreationStep, attempt: number) => void;
  onExhausted?: (step: CreationStep) => void;
}

export function useRecovery(options: UseRecoveryOptions = {}) {
  const { maxRetries = 3, onRetry, onExhausted } = options;

  const [state, setState] = useState<RecoveryState>({
    failedStep: null,
    error: null,
    retryCount: 0,
    canRetry: false,
  });

  const setFailure = useCallback((error: unknown, step: CreationStep) => {
    const recoverable = isRecoverableError(error);
    const collectionError = error instanceof CollectionError
      ? error
      : new CollectionError(
          error instanceof Error ? error.message : 'Unknown error',
          'UNKNOWN_ERROR',
          step,
          recoverable
        );

    setState({
      failedStep: step,
      error: collectionError,
      retryCount: 0,
      canRetry: recoverable,
    });
  }, []);

  const retry = useCallback(async <T>(
    step: CreationStep,
    operation: () => Promise<T>
  ): Promise<T | null> => {
    if (state.retryCount >= maxRetries) {
      onExhausted?.(step);
      return null;
    }

    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
    }));

    onRetry?.(step, state.retryCount + 1);

    try {
      const result = await operation();
      setState({
        failedStep: null,
        error: null,
        retryCount: 0,
        canRetry: false,
      });
      return result;
    } catch (err) {
      const recoverable = isRecoverableError(err);
      setState(prev => ({
        ...prev,
        canRetry: recoverable && prev.retryCount < maxRetries,
      }));
      throw err;
    }
  }, [state.retryCount, maxRetries, onRetry, onExhausted]);

  const reset = useCallback(() => {
    setState({
      failedStep: null,
      error: null,
      retryCount: 0,
      canRetry: false,
    });
  }, []);

  return {
    ...state,
    setFailure,
    retry,
    reset,
    hasFailed: state.failedStep !== null,
    attemptsRemaining: maxRetries - state.retryCount,
  };
}
