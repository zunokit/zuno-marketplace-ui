---
title: "Phase 3: Request Context & Correlation"
description: "Implement AsyncLocalStorage for request correlation IDs"
---

# Phase 3: Request Context & Correlation

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 2: Core Logger](./phase-02-core-logger.md)
- Research: [AsyncLocalStorage Research](./reports/researcher-260208-1245-asynclocalstorage-patterns.md)

## Overview

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Estimated Effort** | 2 hours |
| **Dependencies** | Phase 2 complete |

Implement request correlation IDs using AsyncLocalStorage for tracing requests across Server Components.

## Key Insights

- AsyncLocalStorage works in Node.js runtime (Server Components)
- Edge Runtime uses headers fallback (no AsyncLocalStorage)
- Middleware passes correlation IDs via headers
- Use Proxy pattern to auto-inject context into logs

## Requirements

### Functional

- Generate correlation ID per request
- Propagate context through async boundaries
- Auto-inject correlation ID into all log entries
- Forward correlation ID to downstream services

### Non-Functional

- < 0.1ms overhead per request
- Graceful degradation in Edge Runtime

## Architecture

```
Request Flow:
┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐
│  Middleware │───▶│   Headers   │───▶│  Server Component   │
│ (Edge)      │    │ (x-correlation-id)  │ (withRequestContext)│
└─────────────┘    └─────────────┘    └─────────────────────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │ AsyncLocal   │
                                       │ Storage      │
                                       └──────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
              ┌──────────┐            ┌──────────┐            ┌──────────┐
              │  Logger  │            │  API Call│            │  GraphQL │
              │(auto ctx)│            │(forward) │            │(forward) │
              └──────────┘            └──────────┘            └──────────┘
```

## Related Code Files

| Action | File |
|--------|------|
| Create | `src/shared/lib/request-context.ts` |
| Create | `src/middleware.ts` (or update existing) |
| Modify | `src/shared/lib/logger.ts` (add Proxy) |
| Modify | `src/shared/api/client.ts` (forward headers) |

## Implementation Steps

1. **Create request-context.ts**
   ```typescript
   // src/shared/lib/request-context.ts
   import { AsyncLocalStorage } from 'async_hooks';

   export interface RequestContext {
     correlationId: string;
     requestId: string;
     path: string;
     startTime: number;
     userId?: string;
   }

   const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

   export function withRequestContext<T>(
     handler: () => T,
     context: Partial<RequestContext>
   ): T {
     const correlationId = context.correlationId ?? crypto.randomUUID();
     return asyncLocalStorage.run(
       {
         correlationId,
         requestId: crypto.randomUUID(),
         startTime: Date.now(),
         ...context,
       } as RequestContext,
       handler
     );
   }

   export function getRequestContext(): RequestContext | undefined {
     return asyncLocalStorage.getStore();
   }

   export { asyncLocalStorage };
   ```

2. **Create/update middleware.ts**
   ```typescript
   // src/middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';

   export function middleware(request: NextRequest) {
     const correlationId = request.headers.get('x-correlation-id') ?? crypto.randomUUID();

     const response = NextResponse.next({
       request: { headers: new Headers(request.headers) }
     });
     response.headers.set('x-correlation-id', correlationId);

     return response;
   }

   export const config = {
     matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
   };
   ```

3. **Update logger.ts with Proxy**
   ```typescript
   // Add to src/shared/lib/logger.ts
   import { asyncLocalStorage } from './request-context';

   export const logger = new Proxy(baseLogger, {
     get(target, prop) {
       const context = asyncLocalStorage.getStore();
       if (context && typeof target[prop] === 'function') {
         return target.child(context)[prop];
       }
       return target[prop];
     }
   });
   ```

4. **Update API client to forward correlation ID**
   ```typescript
   // src/shared/api/client.ts
   import { getRequestContext } from '@/shared/lib/request-context';

   export async function apiClient(url: string, options: RequestInit = {}) {
     const context = getRequestContext();
     const headers = new Headers(options.headers);

     if (context?.correlationId) {
       headers.set('x-correlation-id', context.correlationId);
     }

     return fetch(url, { ...options, headers });
   }
   ```

## Todo List

- [ ] Create `src/shared/lib/request-context.ts`
- [ ] Create/update `src/middleware.ts`
- [ ] Update logger.ts with Proxy pattern
- [ ] Update API client to forward correlation ID
- [ ] Test correlation ID propagation
- [ ] Verify Edge Runtime headers fallback

## Success Criteria

- [ ] Correlation ID generated per request
- [ ] Context propagated through async calls
- [ ] Logger auto-includes correlation ID
- [ ] API calls forward correlation ID
- [ ] Works in Server Components
- [ ] Works in Edge Runtime (headers fallback)

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| ALS performance | Low | Low | Minimal overhead |
| Context loss | High | Low | Test async boundaries |

## Security Considerations

- Correlation IDs are non-sensitive (random UUIDs)
- Forwarding prevents injection (only forward our own header)

## Next Steps

After completion, proceed to [Phase 4: Sentry Integration](./phase-04-sentry-integration.md)
