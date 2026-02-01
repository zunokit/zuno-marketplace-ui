---
title: "Phase 04: Transaction State Machine"
description: "Implement state machine for transaction flow with replacement detection"
status: pending
priority: P1
effort: 8-10h
dependencies: ["Phase 01"]
parallel_group: B
---

# Phase 04: Transaction State Machine

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Brainstorm: [brainstorm-260201-1112-create-collection-comprehensive-flow.md](../../reports/brainstorm-260201-1112-create-collection-comprehensive-flow.md)
- Research: [researcher-web3-transaction-patterns-report.md](../../reports/researcher-web3-transaction-patterns-report.md)
- Depends On: [Phase 01: Error Handling](./phase-01-error-handling-infrastructure.md)

## Parallelization Info
- **Can Run Concurrently With:** Phase 03 (Gas Estimation)
- **Must Complete Before:** Phase 05 (Enhanced Hook)
- **File Dependencies:** Phase 01 (error types)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Effort | 8-10 hours |
| Status | pending |
| Review Status | not started |

Implement XState-inspired state machine for collection creation flow with transaction replacement detection.

## Key Insights

1. Explicit state transitions prevent invalid states
2. Transaction replacement (speed up) must be detected
3. Context holds all creation state
4. Event-driven architecture enables flexible recovery

## Requirements

### Functional Requirements
- State machine for all creation steps
- Transaction replacement detection
- Context management for step results
- Event-driven transitions
- Subscribe pattern for UI updates

### Non-Functional Requirements
- Type-safe events and states
- No external state machine library (keep it simple)
- Clear transition rules

## Architecture

```
src/shared/machines/
├── creation-machine.ts           # State machine implementation
└── index.ts                      # Barrel export

src/shared/hooks/
├── use-transaction-state.ts      # Transaction state hook
└── index.ts                      # Update exports
```

## Related Code Files

### Files to Create
1. `src/shared/machines/creation-machine.ts` (NEW)
2. `src/shared/hooks/use-transaction-state.ts` (NEW)

### Files to Modify
1. `src/shared/machines/index.ts` - Create barrel
2. `src/shared/hooks/index.ts` - Add export

## File Ownership

| File | Owner | Purpose |
|------|-------|---------|
| `src/shared/machines/creation-machine.ts` | Phase 04 | Creation state machine |
| `src/shared/hooks/use-transaction-state.ts` | Phase 04 | Transaction state hook |

## Implementation Steps

### Step 1: Create Creation State Machine

Create `src/shared/machines/creation-machine.ts`:

```typescript
export type CreationState =
  | 'IDLE'
  | 'UPLOADING_MEDIA'
  | 'CREATING_DB_RECORD'
  | 'ADDING_ALLOWLIST'
  | 'DEPLOYING_CONTRACT'
  | 'UPDATING_DB'
  | 'COMPLETED'
  | 'FAILED';

export type CreationEvent =
  | { type: 'START' }
  | { type: 'MEDIA_UPLOADED'; imageUrl: string; bannerUrl?: string }
  | { type: 'MEDIA_FAILED'; error: Error }
  | { type: 'DB_RECORD_CREATED'; collectionId: string }
  | { type: 'DB_RECORD_FAILED'; error: Error }
  | { type: 'ALLOWLIST_ADDED' }
  | { type: 'ALLOWLIST_FAILED'; error: Error }
  | { type: 'CONTRACT_DEPLOYED'; contractAddress: string; txHash: string }
  | { type: 'DEPLOYMENT_FAILED'; error: Error }
  | { type: 'DB_UPDATED' }
  | { type: 'DB_UPDATE_FAILED'; error: Error }
  | { type: 'RETRY' }
  | { type: 'RESET' };

interface StateContext {
  collectionId: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
  contractAddress: string | null;
  txHash: string | null;
  error: Error | null;
  failedAt: CreationState | null;
}

interface StateConfig {
  on: Partial<Record<CreationEvent['type'], CreationState | { target: CreationState; action?: string }>>;
}

const stateConfigs: Record<CreationState, StateConfig> = {
  IDLE: { on: { START: 'UPLOADING_MEDIA' } },
  UPLOADING_MEDIA: {
    on: { MEDIA_UPLOADED: 'CREATING_DB_RECORD', MEDIA_FAILED: 'FAILED' },
  },
  CREATING_DB_RECORD: {
    on: { DB_RECORD_CREATED: 'ADDING_ALLOWLIST', DB_RECORD_FAILED: 'FAILED' },
  },
  ADDING_ALLOWLIST: {
    on: { ALLOWLIST_ADDED: 'DEPLOYING_CONTRACT', ALLOWLIST_FAILED: 'FAILED' },
  },
  DEPLOYING_CONTRACT: {
    on: { CONTRACT_DEPLOYED: 'UPDATING_DB', DEPLOYMENT_FAILED: 'FAILED' },
  },
  UPDATING_DB: {
    on: { DB_UPDATED: 'COMPLETED', DB_UPDATE_FAILED: 'FAILED' },
  },
  COMPLETED: { on: { RESET: 'IDLE' } },
  FAILED: { on: { RETRY: 'UPLOADING_MEDIA', RESET: 'IDLE' } },
};

export class CreationMachine {
  private state: CreationState = 'IDLE';
  private context: StateContext = {
    collectionId: null,
    imageUrl: null,
    bannerUrl: null,
    contractAddress: null,
    txHash: null,
    error: null,
    failedAt: null,
  };
  private listeners = new Set<(state: CreationState, context: StateContext) => void>();

  get currentState(): CreationState { return this.state; }
  get currentContext(): Readonly<StateContext> { return { ...this.context }; }

  subscribe(listener: (state: CreationState, context: StateContext) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state, this.context));
  }

  transition(event: CreationEvent): boolean {
    const config = stateConfigs[this.state];
    const transition = config.on[event.type];

    if (!transition) {
      console.warn(`Invalid transition: ${this.state} -> ${event.type}`);
      return false;
    }

    this.updateContext(event);

    if (this.state !== 'FAILED' && event.type.endsWith('_FAILED')) {
      this.context.failedAt = this.state;
      this.context.error = (event as { error: Error }).error;
    }

    this.state = typeof transition === 'string' ? transition : transition.target;
    this.notify();
    return true;
  }

  private updateContext(event: CreationEvent): void {
    switch (event.type) {
      case 'MEDIA_UPLOADED':
        this.context.imageUrl = event.imageUrl;
        this.context.bannerUrl = event.bannerUrl ?? null;
        break;
      case 'DB_RECORD_CREATED':
        this.context.collectionId = event.collectionId;
        break;
      case 'CONTRACT_DEPLOYED':
        this.context.contractAddress = event.contractAddress;
        this.context.txHash = event.txHash;
        break;
      case 'RESET':
        this.context = {
          collectionId: null,
          imageUrl: null,
          bannerUrl: null,
          contractAddress: null,
          txHash: null,
          error: null,
          failedAt: null,
        };
        break;
    }
  }

  canTransition(eventType: CreationEvent['type']): boolean {
    const config = stateConfigs[this.state];
    return eventType in config.on;
  }

  get isTerminal(): boolean {
    return this.state === 'COMPLETED' || this.state === 'FAILED';
  }

  get isFailed(): boolean {
    return this.state === 'FAILED';
  }

  get canRetry(): boolean {
    return this.state === 'FAILED' && this.context.failedAt !== null;
  }
}
```

### Step 2: Create Transaction State Hook

Create `src/shared/hooks/use-transaction-state.ts`:

```typescript
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
    if (state.status !== 'pending' || !state.nonce || !address || !publicClient) {
      return;
    }

    const checkForReplacement = async () => {
      try {
        const currentNonce = await publicClient.getTransactionCount({ address });

        if (currentNonce > state.nonce) {
          const block = await publicClient.getBlock({ blockTag: 'latest' });

          for (const txHash of block.transactions) {
            const tx = await publicClient.getTransaction({ hash: txHash });
            if (tx?.from === address && tx.nonce === state.nonce) {
              if (txHash !== state.hash) {
                setState(prev => ({ ...prev, status: 'replaced', replacedBy: txHash }));
                if (state.hash) {
                  options.onReplaced?.(state.hash, txHash);
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
```

### Step 3: Update Barrel Exports

Create `src/shared/machines/index.ts`:
```typescript
export * from './creation-machine';
```

Update `src/shared/hooks/index.ts`:
```typescript
export { useTransactionState } from './use-transaction-state';
```

## Todo List

- [ ] Create `src/shared/machines/creation-machine.ts`
- [ ] Create `src/shared/hooks/use-transaction-state.ts`
- [ ] Create `src/shared/machines/index.ts`
- [ ] Update barrel exports
- [ ] Test state transitions
- [ ] Test transaction replacement detection

## Success Criteria

- [ ] State machine handles all creation steps
- [ ] Transaction replacement detection works
- [ ] Proper state transitions enforced
- [ ] Context updates correctly for each event
- [ ] TypeScript compiles without errors

## Conflict Prevention

This phase creates new files only. No conflicts with Phase 03 (different directories).

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| State machine complexity | Medium | Medium | Keep transitions simple |
| Replacement detection misses | Low | Medium | 2-second polling interval |
| Memory leaks from listeners | Low | High | Proper cleanup in useEffect |

## Security Considerations

- No sensitive data in state machine context
- Transaction hashes are public

## Next Steps

After completion:
1. Phase 03 can proceed in parallel
2. Phase 05 depends on this phase
3. Review and merge before Phase 05 starts
