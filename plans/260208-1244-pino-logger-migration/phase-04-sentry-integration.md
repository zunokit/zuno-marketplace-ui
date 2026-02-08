---
title: "Phase 4: Sentry Integration"
description: "Create Pino transport for automatic Sentry error reporting"
---

# Phase 4: Sentry Integration

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 3: Request Context](./phase-03-request-context.md)

## Overview

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Estimated Effort** | 2 hours |
| **Dependencies** | Phase 3 complete |

Create Pino transport to automatically send errors to Sentry with full context.

## Key Insights

- Pino transport receives log as JSON string
- Parse and check level >= 50 (error) for Sentry
- Use Sentry.withScope to attach log context
- Preserve existing Sentry configuration

## Requirements

### Functional

- Error logs (level >= 50) sent to Sentry
- Log context attached to Sentry events
- Correlation ID linked to Sentry scope
- Sampling support for high-volume scenarios

### Non-Functional

- Non-blocking transport
- Fail silently if Sentry unavailable

## Architecture

```
Pino Logger
    │
    ▼
┌─────────────┐
│  Transport  │───▶ stdout (always)
│  (custom)   │
└─────────────┘───▶ Sentry (errors only, production)
```

## Related Code Files

| Action | File |
|--------|------|
| Create | `src/shared/lib/pino-sentry-transport.ts` |
| Modify | `src/shared/lib/logger.ts` (add transport) |
| Verify | `sentry.config.ts` (existing) |

## Implementation Steps

1. **Create pino-sentry-transport.ts**
   ```typescript
   // src/shared/lib/pino-sentry-transport.ts
   import * as Sentry from '@sentry/nextjs';

   export function createSentryTransport() {
     return {
       write(log: string) {
         // Always output to stdout
         process.stdout.write(log + '\n');

         // Send errors to Sentry in production
         if (process.env.NODE_ENV !== 'production') return;

         try {
           const parsed = JSON.parse(log);

           if (parsed.level >= 50) { // error or fatal
             Sentry.withScope((scope) => {
               scope.setContext('log', parsed);

               if (parsed.correlationId) {
                 scope.setTag('correlationId', parsed.correlationId);
               }

               if (parsed.namespace) {
                 scope.setTag('namespace', parsed.namespace);
               }

               if (parsed.err) {
                 const error = new Error(parsed.err.message);
                 error.name = parsed.err.type || 'Error';
                 error.stack = parsed.err.stack;
                 Sentry.captureException(error);
               } else {
                 Sentry.captureMessage(parsed.msg, 'error');
               }
             });
           }
         } catch {
           // Fail silently on parse error
         }
       }
     };
   }
   ```

2. **Update logger.ts with transport**
   ```typescript
   // src/shared/lib/logger.ts
   import { createSentryTransport } from './pino-sentry-transport';

   const config = {
     ...LOGGER_CONFIG,
     ...(isProduction && !isEdge ? {} : {
       // Use custom transport in production
     }),
   };

   // For production, use custom transport
   export const logger = isProduction && !isEdge
     ? pino(config, createSentryTransport())
     : pino(config);
   ```

3. **Add log sampling config**
   ```typescript
   // src/shared/lib/log-sampling.ts
   export interface SamplingConfig {
     errorSampleRate: number;
     warnSampleRate: number;
     infoSampleRate: number;
     debugSampleRate: number;
   }

   export const productionSampling: SamplingConfig = {
     errorSampleRate: 1.0,   // 100%
     warnSampleRate: 1.0,    // 100%
     infoSampleRate: parseFloat(process.env.LOG_SAMPLING_INFO_RATE || '0.1'),
     debugSampleRate: 0.0,   // 0%
   };

   export function shouldLog(level: number, config: SamplingConfig): boolean {
     const rates: Record<number, number> = {
       60: config.errorSampleRate,  // fatal
       50: config.errorSampleRate,  // error
       40: config.warnSampleRate,   // warn
       30: config.infoSampleRate,   // info
       20: config.debugSampleRate,  // debug
       10: config.debugSampleRate,  // trace
     };
     const rate = rates[level] ?? 1.0;
     return Math.random() < rate;
   }
   ```

## Todo List

- [ ] Create `src/shared/lib/pino-sentry-transport.ts`
- [ ] Create `src/shared/lib/log-sampling.ts`
- [ ] Update logger.ts to use transport in production
- [ ] Test error logging triggers Sentry
- [ ] Verify context attached to Sentry events
- [ ] Test sampling configuration

## Success Criteria

- [ ] Error logs sent to Sentry in production
- [ ] Log context visible in Sentry
- [ ] Correlation ID tagged in Sentry
- [ ] Sampling reduces log volume as configured
- [ ] No errors in transport

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Sentry rate limiting | Medium | Low | Sampling configured |
| Transport errors | Low | Low | Try/catch wrapper |

## Security Considerations

- Sentry already configured with sensitive data redaction
- Transport respects existing Sentry config

## Next Steps

After completion, proceed to [Phase 5: Error Handler Migration](./phase-05-error-handler.md)
