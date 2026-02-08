---
title: "Phase 5: Error Handler Migration"
description: "Update error-handler.ts to use Pino logger"
---

# Phase 5: Error Handler Migration

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 4: Sentry Integration](./phase-04-sentry-integration.md)

## Overview

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Estimated Effort** | 1.5 hours |
| **Dependencies** | Phase 4 complete |

Update error-handler.ts to use Pino logger instead of console.error.

## Key Insights

- Error classes (AppError, APIError, etc.) remain unchanged
- logError function should use Pino
- Preserve error context and stack traces
- Integrate with existing Sentry setup

## Requirements

### Functional

- logError uses Pino logger
- Error context passed to logger
- Stack traces preserved
- Sentry integration maintained

### Non-Functional

- No breaking changes to error classes
- Backward compatible API

## Related Code Files

| Action | File |
|--------|------|
| Modify | `src/shared/lib/error-handler.ts` |
| Verify | All files using error-handler |

## Implementation Steps

1. **Update error-handler.ts**
   ```typescript
   // src/shared/lib/error-handler.ts
   import { logger } from './logger';

   // ... error classes remain unchanged ...

   export function logError(
     error: AppError | Error,
     context?: Record<string, unknown>
   ): void {
     const errorInfo = {
       name: error.name,
       message: error.message,
       stack: error.stack,
       ...(error instanceof AppError && {
         code: error.code,
         statusCode: error.statusCode,
         context: error.context,
       }),
       ...context,
     };

     if (error instanceof AppError && error.code) {
       logger.error(
         { err: errorInfo, code: error.code },
         error.message
       );
     } else {
       logger.error({ err: errorInfo }, error.message);
     }
   }

   // Update withErrorHandling
   export async function withErrorHandling<T>(
     fn: () => Promise<T>,
     onError?: (error: AppError) => void
   ): Promise<T | null> {
     try {
       return await fn();
     } catch (error) {
       const appError = handleError(error);
       logError(appError);
       onError?.(appError);
       return null;
     }
   }
   ```

2. **Verify all usages**
   - Search for imports of error-handler
   - Ensure no direct console.error calls remain

## Todo List

- [ ] Update logError function to use Pino
- [ ] Update withErrorHandling function
- [ ] Verify error context is passed correctly
- [ ] Test error logging in development
- [ ] Test error logging in production

## Success Criteria

- [ ] logError uses Pino logger
- [ ] Error context visible in logs
- [ ] Stack traces preserved
- [ ] No console.error calls in error-handler
- [ ] All existing error handling works

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking changes | High | Low | Keep same API |
| Lost error context | Medium | Low | Test thoroughly |

## Security Considerations

- Error messages may contain sensitive data
- Pino redaction will handle this

## Next Steps

After completion, proceed to [Phase 6: Console.log Cleanup](./phase-06-console-cleanup.md)
