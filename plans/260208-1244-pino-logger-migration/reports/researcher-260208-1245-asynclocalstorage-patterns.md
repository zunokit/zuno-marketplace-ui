# AsyncLocalStorage Patterns for Request Context in Next.js

**Date:** 2026-02-08
**Researcher:** Claude
**Scope:** Request correlation IDs, middleware integration, async boundaries, logging patterns, Edge Runtime compatibility

---

## 1. Core Implementation Pattern

```typescript
// lib/async-context.ts
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  correlationId: string;
  requestId: string;
  path: string;
  startTime: number;
  [key: string]: unknown;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function withRequestContext<T>(
  handler: () => T,
  context: Partial<RequestContext> = {}
): T {
  const correlationId = context.correlationId ?? crypto.randomUUID();
  return asyncLocalStorage.run(
    { correlationId, requestId: crypto.randomUUID(), startTime: Date.now(), ...context },
    handler
  );
}

export function getRequestContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}
```

---

## 2. Middleware Integration

```typescript
// middleware.ts
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
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)']
};
```

**Note:** Middleware runs in Edge Runtime. Cannot use `AsyncLocalStorage` directly in middleware (see Section 5).

---

## 3. Server Components & Route Handlers

```typescript
// app/api/route.ts
import { withRequestContext, getRequestContext } from '@/lib/async-context';

export async function GET(request: Request) {
  const correlationId = request.headers.get('x-correlation-id')!;

  return withRequestContext(async () => {
    const ctx = getRequestContext();
    // Context available through entire async call chain
    const data = await fetchData();
    return Response.json(data);
  }, { correlationId, path: request.url });
}

async function fetchData() {
  const ctx = getRequestContext(); // Still has context
  console.log(`[${ctx?.correlationId}] Fetching...`);
}
```

---

## 4. Logger Integration

```typescript
// lib/logger.ts
import { asyncLocalStorage } from './async-context';
import pino from 'pino';

const baseLogger = pino({ level: 'info' });

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

**Usage:**
```typescript
logger.info('Processing request'); // Auto-includes correlationId, requestId
```

---

## 5. Edge Runtime Compatibility

| Feature | Node.js Runtime | Edge Runtime |
|---------|----------------|--------------|
| `AsyncLocalStorage` | ✅ Full support | ⚠️ Limited (Next.js 15.1+) |
| `node:async_hooks` | ✅ Available | ❌ Not available |
| `requestAsyncStorage` | ✅ Built-in | ✅ Built-in |

**Edge Runtime Workaround:**
```typescript
// Use headers as fallback for Edge
import { headers } from 'next/headers';

export async function getCorrelationIdEdge(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-correlation-id') ?? 'unknown';
}
```

---

## 6. Best Practices

1. **Always wrap ALS runs in try/finally** for cleanup
2. **Minimize store size** - avoid large objects in context
3. **Use `crypto.randomUUID()`** for correlation IDs
4. **Forward correlation IDs** in outgoing HTTP requests
5. **Test with `asyncLocalStorage.enterWith()`** for mocks
6. **Prefer Next.js built-in APIs** (`headers()`, `cookies()`) when possible

---

## 7. Version Requirements

- **Next.js:** 15.1+ for full Edge Runtime support
- **Node.js:** 18+ minimum
- **React:** 19+ for improved Server Component context

---

## Unresolved Questions

1. Exact performance overhead of ALS in high-throughput scenarios
2. Behavior with React's `unstable_cache` and async context
3. Interaction with Next.js `instrumentation.ts` hook
