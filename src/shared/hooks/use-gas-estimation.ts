'use client';

import { useState, useCallback } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { formatEther } from 'viem';
import {
  calculateGasWithBuffer,
  hasSufficientBalance,
  DEFAULT_DEPLOYMENT_GAS
} from '@/shared/utils/gas';
import { InsufficientFundsError } from '@/shared/errors/collection-errors';

interface GasEstimationState {
  isEstimating: boolean;
  estimatedGas: bigint | null;
  gasPrice: bigint | null;
  totalCost: bigint | null;
  hasEnoughBalance: boolean | null;
  error: Error | null;
}

interface UseGasEstimationOptions {
  chainId: number;
  contractAddress?: `0x${string}`;
  abi?: unknown[];
  functionName?: string;
  args?: unknown[];
}

export function useGasEstimation(options: UseGasEstimationOptions) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const publicClient = usePublicClient({ chainId: options.chainId });

  const [state, setState] = useState<GasEstimationState>({
    isEstimating: false,
    estimatedGas: null,
    gasPrice: null,
    totalCost: null,
    hasEnoughBalance: null,
    error: null,
  });

  const estimateGas = useCallback(async () => {
    if (!publicClient || !address) {
      setState(prev => ({ ...prev, error: new Error('Wallet not connected') }));
      return;
    }

    setState(prev => ({ ...prev, isEstimating: true, error: null }));

    try {
      const gasPrice = await publicClient.getGasPrice();
      let estimatedGas = DEFAULT_DEPLOYMENT_GAS;

      if (options.contractAddress && options.abi && options.functionName) {
        try {
          estimatedGas = await publicClient.estimateContractGas({
            address: options.contractAddress,
            abi: options.abi as [],
            functionName: options.functionName,
            args: options.args ?? [],
            account: address,
          });
        } catch {
          console.warn('Gas estimation failed, using default');
        }
      }

      const { total } = calculateGasWithBuffer(estimatedGas, options.chainId);
      const totalCost = total * gasPrice;

      const hasEnough = balance?.value
        ? hasSufficientBalance(balance.value, totalCost)
        : false;

      setState({
        isEstimating: false,
        estimatedGas,
        gasPrice,
        totalCost,
        hasEnoughBalance: hasEnough,
        error: null,
      });

      if (!hasEnough && balance?.value) {
        const needed = formatEther(totalCost - balance.value);
        const total = formatEther(totalCost);
        throw new InsufficientFundsError(needed, formatEther(balance.value));
      }

      return { estimatedGas, gasPrice, totalCost };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isEstimating: false,
        error: error instanceof Error ? error : new Error('Gas estimation failed'),
      }));
      throw error;
    }
  }, [publicClient, address, balance, options]);

  const reset = useCallback(() => {
    setState({
      isEstimating: false,
      estimatedGas: null,
      gasPrice: null,
      totalCost: null,
      hasEnoughBalance: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    estimateGas,
    reset,
    formattedCost: state.totalCost ? formatEther(state.totalCost) : null,
    formattedBalance: balance?.formatted ?? null,
  };
}
