---
title: "Phase 03: Pre-flight Validation & Gas Checks"
description: "Implement gas estimation and balance validation before contract deployment"
status: pending
priority: P1
effort: 6-8h
dependencies: ["Phase 01"]
parallel_group: B
---

# Phase 03: Pre-flight Validation & Gas Checks

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Brainstorm: [brainstorm-260201-1112-create-collection-comprehensive-flow.md](../../reports/brainstorm-260201-1112-create-collection-comprehensive-flow.md)
- Research: [researcher-web3-transaction-patterns-report.md](../../reports/researcher-web3-transaction-patterns-report.md)
- Depends On: [Phase 01: Error Handling](./phase-01-error-handling-infrastructure.md)

## Parallelization Info
- **Can Run Concurrently With:** Phase 04 (Transaction State Machine)
- **Must Complete Before:** Phase 05 (Enhanced Hook)
- **File Dependencies:** Phase 01 (uses InsufficientFundsError)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Effort | 6-8 hours |
| Status | pending |
| Review Status | not started |

Implement pre-flight gas estimation and balance validation to prevent failed deployments due to insufficient funds.

## Key Insights

1. 25% gas buffer recommended for deployment transactions
2. Chain-specific configurations needed for accurate estimates
3. Simulation before actual transaction prevents wasted gas
4. Clear cost display improves user confidence

## Requirements

### Functional Requirements
- Estimate gas for contract deployment
- Validate user has sufficient balance
- Display estimated cost to user
- Support multiple chains with different gas parameters
- Fallback to default estimates if simulation fails

### Non-Functional Requirements
- Non-blocking UI during estimation
- Cache estimates for short period
- Format values for display

## Architecture

```
src/shared/utils/
├── gas.ts                        # Gas calculation utilities
└── index.ts                      # Update exports

src/shared/hooks/
├── use-gas-estimation.ts         # Gas estimation hook
└── index.ts                      # Update exports
```

## Related Code Files

### Files to Create
1. `src/shared/utils/gas.ts` (NEW)
2. `src/shared/hooks/use-gas-estimation.ts` (NEW)

### Files to Modify
1. `src/shared/utils/index.ts` - Add export
2. `src/shared/hooks/index.ts` - Add export

## File Ownership

| File | Owner | Purpose |
|------|-------|---------|
| `src/shared/utils/gas.ts` | Phase 03 | Gas calculation utilities |
| `src/shared/hooks/use-gas-estimation.ts` | Phase 03 | Gas estimation hook |

## Implementation Steps

### Step 1: Create Gas Utilities

Create `src/shared/utils/gas.ts`:

```typescript
/**
 * Gas Utilities
 * Gas estimation, balance checking, and cost calculations
 */

import { formatEther, parseEther } from 'viem';

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
  1: { bufferPercent: 25, maxFeeMultiplier: 1.5, minGasLimit: 5000000n },
  11155111: { bufferPercent: 25, maxFeeMultiplier: 1.5, minGasLimit: 5000000n },
  137: { bufferPercent: 20, maxFeeMultiplier: 1.3, minGasLimit: 3000000n },
  56: { bufferPercent: 20, maxFeeMultiplier: 1.3, minGasLimit: 3000000n },
  31337: { bufferPercent: 10, maxFeeMultiplier: 1.1, minGasLimit: 2000000n },
};

export const DEFAULT_DEPLOYMENT_GAS = 5000000n;

export function calculateGasWithBuffer(
  baseEstimate: bigint,
  chainId: number
): { estimate: bigint; buffer: bigint; total: bigint } {
  const config = CHAIN_GAS_CONFIG[chainId] ?? CHAIN_GAS_CONFIG[1];
  const buffer = (baseEstimate * BigInt(config.bufferPercent)) / 100n;
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
  const withBuffer = (required * BigInt(100 + bufferPercent)) / 100n;
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
  const costWithBuffer = (cost * 125n) / 100n;

  return {
    cost,
    costWithBuffer,
    formatted: formatEther(costWithBuffer),
  };
}
```

### Step 2: Create Gas Estimation Hook

Create `src/shared/hooks/use-gas-estimation.ts`:

```typescript
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
```

### Step 3: Update Barrel Exports

Update `src/shared/utils/index.ts`:
```typescript
export * from './gas';
```

Update `src/shared/hooks/index.ts`:
```typescript
export { useGasEstimation } from './use-gas-estimation';
```

## Todo List

- [ ] Create `src/shared/utils/gas.ts`
- [ ] Create `src/shared/hooks/use-gas-estimation.ts`
- [ ] Update barrel exports
- [ ] Test with different chains
- [ ] Verify balance validation

## Success Criteria

- [ ] Gas estimation with chain-specific buffers
- [ ] Balance validation with meaningful error messages
- [ ] Support for both simulation and fallback estimates
- [ ] Formatted display values for UI
- [ ] TypeScript compiles without errors

## Conflict Prevention

This phase depends on Phase 01 for `InsufficientFundsError`. Ensure Phase 01 is merged first or coordinate imports.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gas estimation fails | Medium | Low | Fallback to default |
| RPC rate limiting | Medium | Medium | Cache estimates |
| Chain not supported | Low | High | Default config fallback |

## Security Considerations

- No sensitive data in gas estimates
- Public RPC calls are safe

## Next Steps

After completion:
1. Phase 04 can proceed in parallel
2. Phase 05 depends on this phase
3. Review and merge before Phase 05 starts
