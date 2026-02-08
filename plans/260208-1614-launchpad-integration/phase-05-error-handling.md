---
title: "Phase 5: Error Handling & Edge Cases"
description: "Comprehensive error handling for all integration points"
phase: 5
status: completed
priority: Medium
dependencies: ["phase-04-mint-integration"]
---

# Phase 5: Error Handling & Edge Cases

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 4: SDK Mint Integration](./phase-04-mint-integration.md)
- Error Handler: `src/shared/lib/error-handler.ts`
- Logger: `src/shared/lib/logger.ts`
- Mint Components: `src/modules/launch-pad/mint-nft/components/`

## Overview

| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Status** | Completed |
| **Description** | Comprehensive error handling for all integration points |
| **Estimated Effort** | 3-4 hours |

## Key Insights

- SDK errors need transformation to user-friendly messages
- GraphQL errors need handling (network, not found, unauthorized)
- Wallet errors (rejected, insufficient funds) need specific handling
- Need loading states for all async operations
- Sentry integration exists for error tracking
- Edge cases: sold out, mint ended, not whitelisted

## Requirements

### Functional Requirements
- Handle SDK mint errors (user rejected, insufficient funds, contract revert)
- Handle GraphQL errors (network, timeout, not found)
- Handle wallet connection errors
- Implement retry logic for transient failures
- Add error boundaries for component crashes
- Log errors to Sentry
- Handle edge cases (sold out, mint ended, not whitelisted)

### Non-Functional Requirements
- User-friendly error messages
- Consistent error handling patterns
- Proper error logging
- Graceful degradation

## Architecture

```
Error Handling Layers
├── GraphQL Layer
│   ├── Network errors → Retry with backoff
│   ├── Not found → 404 page
│   └── Unauthorized → Login prompt
├── SDK Layer
│   ├── User rejected → Friendly message
│   ├── Insufficient funds → Fund wallet prompt
│   ├── Contract revert → Show revert reason
│   └── Unknown → Generic error + Sentry
└── UI Layer
    ├── Error boundaries → Fallback UI
    └── Toast notifications → User feedback
```

## Related Code Files

### Files to Create
| File | Purpose |
|------|---------|
| `src/modules/launch-pad/mint-nft/components/mint-error-boundary.tsx` | Error boundary |
| `src/modules/launch-pad/mint-nft/utils/error-messages.ts` | Error message mapping |

### Files to Modify
| File | Change |
|------|--------|
| `src/modules/launch-pad/mint-nft/utils/handle-sdk-error.ts` | Enhance error handling |
| `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts` | Add error handling |
| `src/modules/launch-pad/mint-nft/components/mint-form.tsx` | Display errors |
| `src/app/(marketplace)/launchpad/[slug]/page.tsx` | Add error boundary |

## Implementation Steps

1. **Create error message mapping**
   - Map SDK error codes to user-friendly messages
   - Map GraphQL error codes
   - Support i18n if needed

2. **Enhance SDK error handler**
   - Add specific handling for common errors
   - Integrate with Sentry
   - Add error categorization

3. **Create MintErrorBoundary component**
   - Catch component errors
   - Show fallback UI
   - Log to Sentry

4. **Add retry logic for GraphQL**
   - Implement exponential backoff
   - Add retry button
   - Handle network timeouts

5. **Handle edge cases**
   - Sold out detection
   - Mint ended check
   - Not whitelisted handling
   - Insufficient funds check

6. **Integrate Sentry logging**
   - Log SDK errors
   - Log GraphQL errors
   - Add error context

## Todo List

- [x] Create error message mapping utility
- [x] Enhance `handleSdkError` with specific error codes
- [x] Create `MintErrorBoundary` component
- [x] Add retry logic for GraphQL queries
- [x] Integrate Sentry logging for SDK errors
- [x] Add error toast notifications
- [x] Handle "Sold Out" edge case
- [x] Handle "Mint Ended" edge case
- [x] Handle "Not Whitelisted" edge case
- [x] Add "Try Again" functionality
- [x] Add insufficient funds check
- [x] Test all error scenarios

## Success Criteria

- [x] All errors show user-friendly messages
- [x] SDK errors mapped correctly
- [x] GraphQL errors handled with retry
- [x] Error boundaries prevent app crashes
- [x] Errors logged to Sentry
- [x] Edge cases handled gracefully
- [x] Retry functionality works
- [x] No unhandled promise rejections

## Implementation Summary

### Files Created
1. `src/modules/launch-pad/mint-nft/utils/error-messages.ts` - Error message mapping with categorization
2. `src/modules/launch-pad/mint-nft/components/mint-error-boundary.tsx` - Error boundary component

### Files Modified
1. `src/modules/launch-pad/mint-nft/utils/handle-sdk-error.ts` - Enhanced with error codes, Sentry logging, categorization
2. `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts` - Added error state, retry logic, edge case handling
3. `src/modules/launch-pad/mint-nft/components/mint-form.tsx` - Added error display UI, sold out banner
4. `src/app/(marketplace)/launchpad/[slug]/page.tsx` - Wrapped with MintErrorBoundary

### Key Features Implemented
- **Error Message Mapping**: SDK, GraphQL, and wallet error codes mapped to user-friendly messages
- **Error Categorization**: USER, NETWORK, CONTRACT, WALLET, UNKNOWN categories
- **Retry Logic**: handleRetry function with isRetrying state for transient failures
- **Edge Case Handling**: Sold out, max mint reached, not whitelisted checks
- **Sentry Integration**: Automatic error logging for non-user errors
- **Error Boundary**: Prevents app crashes with fallback UI and refresh button

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Missing edge case | Medium | Medium | Comprehensive testing |
| Error message confusion | Low | Low | Clear, actionable messages |
| Sentry quota exceeded | Low | Low | Filter errors before sending |

## Security Considerations

- Don't expose sensitive error details to users
- Log full errors server-side only
- Validate all error inputs
- Sanitize error messages

## Code Snippets

### Error Message Mapping
```typescript
// src/modules/launch-pad/mint-nft/utils/error-messages.ts
export const SDK_ERROR_MESSAGES: Record<string, string> = {
  USER_REJECTED: "Transaction was cancelled",
  INSUFFICIENT_FUNDS: "Insufficient funds in wallet",
  SALE_NOT_STARTED: "Minting has not started yet",
  SALE_ENDED: "Minting has ended",
  SOLD_OUT: "Collection is sold out",
  NOT_WHITELISTED: "Your address is not on the allowlist",
  MAX_MINT_REACHED: "You have reached the maximum mint limit",
  INVALID_PROOF: "Invalid allowlist proof",
  CONTRACT_REVERT: "Transaction failed. Please try again.",
};

export function getErrorMessage(code: string, fallback = "Something went wrong"): string {
  return SDK_ERROR_MESSAGES[code] || fallback;
}
```

### Error Boundary
```typescript
// src/modules/launch-pad/mint-nft/components/mint-error-boundary.tsx
"use client";

import { Component, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MintErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      extra: errorInfo,
      tags: { component: "MintPage" },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">
            Please refresh the page and try again
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-os-primary"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Retry Logic
```typescript
// src/modules/launch-pad/mint-nft/hooks/use-collection-with-retry.ts
import { useState, useCallback } from "react";

interface RetryConfig {
  maxRetries: number;
  delay: number;
}

export function useCollectionWithRetry() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async (
    fn: () => Promise<void>,
    config: RetryConfig = { maxRetries: 3, delay: 1000 }
  ) => {
    setIsRetrying(true);

    for (let i = 0; i < config.maxRetries; i++) {
      try {
        await fn();
        setRetryCount(0);
        setIsRetrying(false);
        return;
      } catch (error) {
        setRetryCount(i + 1);
        if (i < config.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, config.delay * (i + 1)));
        }
      }
    }

    setIsRetrying(false);
    throw new Error("Max retries exceeded");
  }, []);

  return { retry, retryCount, isRetrying };
}
```

## Completion Criteria

This is the final phase. After completion:
1. Full integration is complete
2. All error scenarios handled
3. Ready for testing and QA
4. Update documentation

## Unresolved Questions

1. Should we add rate limiting for retries?
2. Do we need specific error tracking for mint failures?
3. Should we add user feedback collection for errors?
