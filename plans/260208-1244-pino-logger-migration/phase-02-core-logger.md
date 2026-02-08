---
title: "Phase 2: Core Logger Implementation"
description: "Create Pino logger with dev/prod configs, prefix option, redaction"
---

# Phase 2: Core Logger Implementation

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 1: Setup](./phase-01-setup-dependencies.md)
- Research: [Pino v9 Research](./reports/researcher-260208-1245-pino-v9-nextjs16-integration.md)

## Overview

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Estimated Effort** | 2 hours |
| **Dependencies** | Phase 1 complete |

Replace custom Logger class with Pino implementation supporting all Next.js runtimes.

## Key Insights

- `sync: true` required for React Server Components (prevents request hanging)
- Edge Runtime needs minimal config (no file transports)
- Use Proxy pattern for auto context injection
- Pretty print in dev, JSON in production

## Requirements

### Functional

- Logger works in Server Components, Client Components, Edge Runtime
- Pretty printing in development
- JSON structured output in production
- Namespace support via `[Prefix]` in message
- Log level controlled by `LOG_LEVEL` env var

### Non-Functional

- < 1ms overhead per log call
- Zero errors in all Next.js runtimes

## Architecture

```typescript
// src/shared/lib/logger.ts
┌─────────────────────────────────────────┐
│           Logger Factory                │
├─────────────────────────────────────────┤
│  Runtime Detection                      │
│  ├── Edge: Minimal config               │
│  ├── Server: Full config + sync: true   │
│  └── Client: Browser config             │
├─────────────────────────────────────────┤
│  Environment Config                     │
│  ├── Dev: pino-pretty transport         │
│  └── Prod: JSON stdout + redaction      │
├─────────────────────────────────────────┤
│  Usage Pattern                          │
│  logger.info({prefix:'Auth'}, msg)      │
│  Output: [Auth] message                 │
└─────────────────────────────────────────┘
```

## Related Code Files

| Action | File |
|--------|------|
| Replace | `src/shared/lib/logger.ts` |
| Create | `src/shared/lib/logger-config.ts` |
| Modify | `src/app/error.tsx` (update import) |
| Modify | `src/shared/components/error-boundary.tsx` (update import) |

## Implementation Steps

1. **Create logger-config.ts**
   ```typescript
   // src/shared/lib/logger-config.ts
   export const LOGGER_CONFIG = {
     level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
     sync: true, // Required for RSC
     base: {
       service: 'zuno-marketplace',
       version: process.env.NEXT_PUBLIC_APP_VERSION,
       env: process.env.NODE_ENV,
     },
     redact: {
       paths: [
         'req.headers.authorization',
         'req.headers.cookie',
         'password',
         'token',
         'apiKey',
         'secret',
         '*.password',
         '*.token',
       ],
       censor: '[REDACTED]',
     },
   };
   ```

2. **Replace logger.ts**
   ```typescript
   // src/shared/lib/logger.ts
   import pino from 'pino';
   import { LOGGER_CONFIG } from './logger-config';

   const isEdge = typeof EdgeRuntime !== 'undefined';
   const isDev = process.env.NODE_ENV === 'development';

   const config = {
     ...LOGGER_CONFIG,
     ...(isEdge ? { base: undefined } : {}),
     ...(isDev && !isEdge ? {
       transport: {
         target: 'pino-pretty',
         options: { colorize: true, translateTime: 'HH:MM:ss' }
       }
     } : {}),
   };

   export const logger = pino({
     ...config,
     formatters: {
       log: (obj) => {
         // If prefix exists, prepend it to msg for display
         if (obj.prefix && obj.msg) {
           return { ...obj, msg: `[${obj.prefix}] ${obj.msg}` };
         }
         return obj;
       },
     },
   });

   // Usage:
   // logger.info({ prefix: 'Auth', userId: '123' }, 'User authenticated');
   // Display: [Auth] User authenticated
   // JSON: { "level": 30, "prefix": "Auth", "userId": "123", "msg": "[Auth] User authenticated" }
   ```

3. **Update imports**
   - Update `src/app/error.tsx`
   - Update `src/shared/components/error-boundary.tsx`

## Todo List

- [ ] Create `src/shared/lib/logger-config.ts`
- [ ] Replace `src/shared/lib/logger.ts` with Pino implementation
- [ ] Update error.tsx imports
- [ ] Update error-boundary.tsx imports
- [ ] Test in development (pretty output)
- [ ] Test in production build (JSON output)
- [ ] Verify Edge Runtime compatibility

## Success Criteria

- [ ] Logger outputs pretty format in dev
- [ ] Logger outputs JSON in production
- [ ] String prefixes visible in log output
- [ ] Redaction hides sensitive fields
- [ ] No TypeScript errors
- [ ] Works in Server Components
- [ ] Works in Client Components
- [ ] Works in Edge Runtime

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| `sync: true` performance | Medium | Low | Monitor, can optimize later |
| Edge Runtime errors | High | Low | Test in middleware |

## Security Considerations

- Redaction configured for: passwords, tokens, API keys, authorization headers
- Wallet addresses should NOT be redacted (needed for debugging)

## Next Steps

After completion, proceed to [Phase 3: Request Context & Correlation](./phase-03-request-context.md)
