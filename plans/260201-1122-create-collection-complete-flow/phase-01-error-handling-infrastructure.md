---
title: "Phase 01: Error Handling & Recovery Infrastructure"
description: "Create comprehensive error types and recovery mechanisms for collection creation"
status: pending
priority: P0
effort: 4-6h
dependencies: []
parallel_group: A
---

# Phase 01: Error Handling & Recovery Infrastructure

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Brainstorm: [brainstorm-260201-1112-create-collection-comprehensive-flow.md](../../reports/brainstorm-260201-1112-create-collection-comprehensive-flow.md)
- Research: [researcher-error-handling-patterns-report.md](../../reports/researcher-error-handling-patterns-report.md)

## Parallelization Info
- **Can Run Concurrently With:** Phase 02 (State Persistence Layer)
- **Must Complete Before:** Phase 03, Phase 04, Phase 05
- **File Dependencies:** None (creates new files)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Effort | 4-6 hours |
| Status | pending |
| Review Status | not started |

Create comprehensive error handling infrastructure including typed error classes, recovery hooks, and utility functions for the collection creation flow.

## Key Insights

1. Error classification (recoverable vs non-recoverable) is critical for retry logic
2. Step-specific errors allow targeted recovery actions
3. User-friendly messages improve UX significantly
4. Type guards enable proper TypeScript narrowing

## Requirements

### Functional Requirements
- Define error hierarchy for all creation steps
- Implement type guards for error checking
- Create recovery hook with retry logic
- Provide user-friendly error messages

### Non-Functional Requirements
- TypeScript strict mode compliance
- No external dependencies beyond existing
- Tree-shakeable exports

## Architecture

```
src/shared/errors/
├── collection-errors.ts          # Error types and utilities
└── index.ts                      # Barrel export

src/shared/hooks/
├── use-recovery.ts               # Recovery logic hook
└── index.ts                      # Update exports
```

## Related Code Files

### Files to Create
1. `src/shared/errors/collection-errors.ts` (NEW)
2. `src/shared/hooks/use-recovery.ts` (NEW)

### Files to Modify
1. `src/shared/errors/index.ts` - Add exports
2. `src/shared/hooks/index.ts` - Add export

## File Ownership

| File | Owner | Purpose |
|------|-------|---------|
| `src/shared/errors/collection-errors.ts` | Phase 01 | Error type definitions |
| `src/shared/hooks/use-recovery.ts` | Phase 01 | Recovery hook implementation |

## Implementation Steps

### Step 1: Create Error Types

Create `src/shared/errors/collection-errors.ts`:

```typescript
/**
 * Collection Creation Error Types
 * Comprehensive error hierarchy for create collection flow
 */

import { AppError } from '@/shared/lib/error-handler';

export class CollectionError extends AppError {
  constructor(
    message: string,
    public code: string,
    public step: CreationStep,
    public recoverable: boolean,
    public context?: Record<string, unknown>
  ) {
    super(message, code, undefined, context);
    this.name = 'CollectionError';
  }
}

export type CreationStep =
  | 'UPLOAD_MEDIA'
  | 'CREATE_DB_RECORD'
  | 'ADD_ALLOWLIST'
  | 'DEPLOY_CONTRACT'
  | 'UPDATE_DB';

export class MediaUploadError extends CollectionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'MEDIA_UPLOAD_FAILED', 'UPLOAD_MEDIA', true, context);
    this.name = 'MediaUploadError';
  }
}

export class DatabaseError extends CollectionError {
  constructor(message: string, recoverable: boolean, context?: Record<string, unknown>) {
    super(message, 'DB_OPERATION_FAILED', 'CREATE_DB_RECORD', recoverable, context);
    this.name = 'DatabaseError';
  }
}

export class AllowlistError extends CollectionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ALLOWLIST_OPERATION_FAILED', 'ADD_ALLOWLIST', true, context);
    this.name = 'AllowlistError';
  }
}

export class DeploymentError extends CollectionError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONTRACT_DEPLOYMENT_FAILED', 'DEPLOY_CONTRACT', true, context);
    this.name = 'DeploymentError';
  }
}

export class InsufficientFundsError extends CollectionError {
  constructor(required: string, available: string) {
    super(
      `Insufficient funds. Required: ${required}, Available: ${available}`,
      'INSUFFICIENT_FUNDS',
      'DEPLOY_CONTRACT',
      false,
      { required, available }
    );
    this.name = 'InsufficientFundsError';
  }
}

export class UserRejectionError extends CollectionError {
  constructor() {
    super(
      'Transaction rejected by user',
      'USER_REJECTION',
      'DEPLOY_CONTRACT',
      true
    );
    this.name = 'UserRejectionError';
  }
}

export class NetworkSwitchError extends CollectionError {
  constructor(expectedChain: string, actualChain: string) {
    super(
      `Network switched during creation. Expected: ${expectedChain}, Actual: ${actualChain}`,
      'NETWORK_SWITCH',
      'DEPLOY_CONTRACT',
      true,
      { expectedChain, actualChain }
    );
    this.name = 'NetworkSwitchError';
  }
}

export class ContractVerificationError extends CollectionError {
  constructor(address: string, context?: Record<string, unknown>) {
    super(
      `Contract verification failed for address: ${address}`,
      'CONTRACT_VERIFICATION_FAILED',
      'DEPLOY_CONTRACT',
      true,
      { address, ...context }
    );
    this.name = 'ContractVerificationError';
  }
}

export function isCollectionError(error: unknown): error is CollectionError {
  return error instanceof CollectionError;
}

export function isRecoverableError(error: unknown): boolean {
  if (isCollectionError(error)) {
    return error.recoverable;
  }
  if (error instanceof Error) {
    const retryableCodes = ['TIMEOUT', 'NETWORK_ERROR', 'RATE_LIMITED', 'ECONNRESET'];
    return retryableCodes.some(code => error.message?.includes(code));
  }
  return false;
}

export function getCollectionErrorMessage(error: unknown): string {
  if (error instanceof MediaUploadError) {
    return 'Failed to upload media. Please check your file and try again.';
  }
  if (error instanceof DatabaseError) {
    return 'Failed to save collection data. Please try again.';
  }
  if (error instanceof AllowlistError) {
    return 'Failed to process allowlist. Please check the addresses and try again.';
  }
  if (error instanceof InsufficientFundsError) {
    return error.message;
  }
  if (error instanceof UserRejectionError) {
    return 'Transaction was rejected. You can try again when ready.';
  }
  if (error instanceof NetworkSwitchError) {
    return 'Please switch back to the correct network to continue.';
  }
  if (error instanceof DeploymentError) {
    return 'Contract deployment failed. You can retry this step.';
  }
  return 'An unexpected error occurred. Please try again.';
}
```

### Step 2: Create Recovery Hook

Create `src/shared/hooks/use-recovery.ts`:

```typescript
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
```

### Step 3: Update Barrel Exports

Update `src/shared/errors/index.ts`:
```typescript
export * from './collection-errors';
```

Update `src/shared/hooks/index.ts`:
```typescript
export { useRecovery } from './use-recovery';
```

## Todo List

- [ ] Create `src/shared/errors/collection-errors.ts`
- [ ] Create `src/shared/hooks/use-recovery.ts`
- [ ] Update barrel exports
- [ ] Run TypeScript check
- [ ] Run lint

## Success Criteria

- [ ] All error types defined with proper inheritance
- [ ] Type guards and utility functions implemented
- [ ] Recovery hook handles retry logic correctly
- [ ] User-friendly error messages for all error types
- [ ] TypeScript compiles without errors

## Conflict Prevention

This phase creates new files only. No conflicts with Phase 02 (State Persistence) which also creates new files in different directories.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AppError base class missing | Low | High | Check existing error structure first |
| Circular dependencies | Low | Medium | Keep imports minimal |

## Security Considerations

- No sensitive data in error messages
- Context objects should not include PII
- Error codes are safe to expose to client

## Next Steps

After completion:
1. Phase 02 can proceed in parallel
2. Phase 03 and 04 depend on this phase
3. Review and merge before dependent phases start
