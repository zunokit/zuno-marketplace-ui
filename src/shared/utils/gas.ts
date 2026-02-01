/**
 * Gas Utilities
 * Gas estimation, balance checking, and cost calculations
 */

import { formatEther } from 'viem';

export interface GasEstimate {
  estimatedGas: bigint;
  gasPrice: bigint;
  maxFeePerGas: bigint;
  totalCost: bigint;
  bufferCost: bigint;
}

export interface ChainGasConfig {
  bufferPercent: number;
  maxFeeMultiplier: number;
  minGasLimit: bigint;
}

export const CHAIN_GAS_CONFIG: Record<number, ChainGasConfig> = {
  1: { bufferPercent: 25, maxFeeMultiplier: 1.5, minGasLimit: BigInt(5000000) },
  11155111: { bufferPercent: 25, maxFeeMultiplier: 1.5, minGasLimit: BigInt(5000000) },
  137: { bufferPercent: 20, maxFeeMultiplier: 1.3, minGasLimit: BigInt(3000000) },
  56: { bufferPercent: 20, maxFeeMultiplier: 1.3, minGasLimit: BigInt(3000000) },
  31337: { bufferPercent: 10, maxFeeMultiplier: 1.1, minGasLimit: BigInt(2000000) },
};

export const DEFAULT_DEPLOYMENT_GAS = BigInt(5000000);

export function calculateGasWithBuffer(
  baseEstimate: bigint,
  chainId: number
): { estimate: bigint; buffer: bigint; total: bigint } {
  const config = CHAIN_GAS_CONFIG[chainId] ?? CHAIN_GAS_CONFIG[1];
  const buffer = (baseEstimate * BigInt(config.bufferPercent)) / BigInt(100);
  return {
    estimate: baseEstimate,
    buffer,
    total: baseEstimate + buffer,
  };
}

export function formatGasCost(wei: bigint, decimals: number = 4): string {
  return `${formatEther(wei)} ETH`;
}

export function hasSufficientBalance(
  balance: bigint,
  required: bigint,
  bufferPercent: number = 10
): boolean {
  const withBuffer = (required * BigInt(100 + bufferPercent)) / BigInt(100);
  return balance >= withBuffer;
}

export function getRecommendedGasSettings(chainId: number) {
  const config = CHAIN_GAS_CONFIG[chainId] ?? CHAIN_GAS_CONFIG[1];
  return {
    maxFeePerGasMultiplier: config.maxFeeMultiplier,
    priorityFeeMultiplier: 1.1,
  };
}

export function calculateDeploymentCost(
  gasEstimate: bigint,
  gasPrice: bigint
): { cost: bigint; costWithBuffer: bigint; formatted: string } {
  const cost = gasEstimate * gasPrice;
  const costWithBuffer = (cost * BigInt(125)) / BigInt(100);

  return {
    cost,
    costWithBuffer,
    formatted: formatEther(costWithBuffer),
  };
}
