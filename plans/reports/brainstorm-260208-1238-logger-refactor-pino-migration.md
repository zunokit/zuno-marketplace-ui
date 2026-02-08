# Logger Refactor Brainstorm: Pino Migration

**Date:** 2026-02-08
**Topic:** Production-grade logging system for Next.js 16 + React 19
**Decision:** Migrate to Pino v9

---

## Problem Statement

### Current Issues

1. **Next.js Dev Experience Problems**
   - Errors show in Next.js dev overlay instead of console
   - No clear server/client log distinction
   - Missing structured error information in development

2. **Production Readiness Gaps**
   - Custom logger uses `console.*` methods (not machine-readable)
   - No request correlation IDs for tracing
   - No log sampling for cost control
   - Missing structured JSON format for log aggregation

3. **Maintainability Concerns**
   - 22+ files using raw `console.log` (inconsistent)
   - Pino in devDependencies but unused
   - Manual Sentry integration in logger class

### Requirements (From User)

- Log aggregation ready (Datadog, etc.)
- Environment-based log levels
- Structured JSON logging
- Request correlation IDs
- Fix Next.js dev error display
- Production + development equally important

---

## Evaluated Approaches

### Approach A: Pino Migration (SELECTED)

**Description:** Replace custom Logger class with Pino v9

**Pros:**
- 5-10x faster than Winston
- Native JSON structured logging
- Works in Server Components, API Routes, Edge Runtime
- Built-in redaction for sensitive data
- Pretty printing in dev, JSON in prod
- Industry standard (Vercel Commerce, T3 Stack)

**Cons:**
- Moderate refactoring required
- Need to update all logger imports
- Bundle size ~50KB (acceptable)

**Migration Effort:** Medium (2-3 days)

---

### Approach B: Enhanced Custom Logger (REJECTED)

**Description:** Keep current architecture, add missing features

**Pros:**
- Minimal code changes
- Full control over implementation
- No new dependencies

**Cons:**
- Reinventing the wheel
- Miss out on Pino's performance optimizations
- Maintenance burden long-term
- Edge Runtime compatibility issues

---

### Approach C: Hybrid Strategy (REJECTED)

**Description:** Pino for server, lightweight wrapper for client

**Pros:**
- Optimized bundle size
- Best of both worlds

**Cons:**
- More complex architecture
- Two different APIs to maintain
- Unnecessary for this project size

---

## Final Recommendation: Pino Migration

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Zuno Marketplace                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Client     │  │    Server    │  │    Edge      │       │
│  │  Components  │  │  Components  │  │   Runtime    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                  │               │
│  ┌──────▼─────────────────▼──────────────────▼───────┐       │
│  │              Pino Logger (v9)                     │       │
│  │  ┌─────────────────────────────────────────────┐  │       │
│  │  │  - Structured JSON output                   │  │       │
│  │  │  - Environment-based levels                 │  │       │
│  │  │  - Pretty print in dev                      │  │       │
│  │  │  - Redaction for sensitive data             │  │       │
│  │  │  - Child loggers for namespaces             │  │       │
│  │  └─────────────────────────────────────────────┘  │       │
│  └────────────────────────┬──────────────────────────┘       │
│                           │                                  │
│              ┌────────────┼────────────┐                     │
│              ▼            ▼            ▼                     │
│         ┌────────┐   ┌────────┐   ┌────────┐                │
│         │Sentry  │   │Console │   │External│                │
│         │(errors)│   │(stdout)│   │( drains)│                │
│         └────────┘   └────────┘   └────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

| Feature | Implementation |
|---------|----------------|
| **Structured Logging** | Native Pino JSON format |
| **Log Levels** | `LOG_LEVEL` env var, defaults per environment |
| **Namespaces** | Pino child loggers (`logger.child({ namespace })`) |
| **Request Correlation** | AsyncLocalStorage + middleware |
| **Error Tracking** | Pino transport → Sentry integration |
| **Dev Experience** | `pino-pretty` for readable output |
| **Production** | Raw JSON for log aggregation |

---

## Implementation Considerations

### Files to Modify

| File | Change |
|------|--------|
| `package.json` | Move `pino` to dependencies, upgrade to v9 |
| `src/shared/lib/logger.ts` | Replace with Pino implementation |
| `src/shared/lib/error-handler.ts` | Update to use Pino |
| `src/shared/middleware.ts` | Add request correlation |
| `src/shared/lib/request-context.ts` | New: AsyncLocalStorage context |
| 22+ console.log files | Migrate to logger |

### Environment Variables

```bash
# Logging
LOG_LEVEL=info                    # debug | info | warn | error | fatal
LOG_SAMPLING_INFO_RATE=0.1        # 10% sampling in production
LOG_SAMPLING_DEBUG_RATE=0.0       # No debug in production

# Sentry (existing)
SENTRY_DSN=
SENTRY_ENABLED=true

# Correlation
ENABLE_REQUEST_CORRELATION=true
```

### Code Example

```typescript
// src/shared/lib/logger.ts
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport: isDevelopment
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  base: {
    service: 'zuno-marketplace',
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    env: process.env.NODE_ENV,
  },
  redact: {
    paths: ['req.headers.authorization', 'password', 'token', 'apiKey'],
    censor: '[REDACTED]',
  },
});

// Child loggers for namespaces
export const authLogger = logger.child({ namespace: 'Auth' });
export const graphqlLogger = logger.child({ namespace: 'GraphQL' });
export const blockchainLogger = logger.child({ namespace: 'Blockchain' });

// Usage
logger.info('Server started');
logger.error({ err: error }, 'Transaction failed');
authLogger.debug({ userId }, 'User authenticated');
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes in Pino v9 | High | Test thoroughly in staging |
| Bundle size increase | Low | 50KB is acceptable |
| Migration time | Medium | Plan for 2-3 days |
| Console.log cleanup | Medium | Gradual migration acceptable |

---

## Success Criteria

- [ ] All logs output as structured JSON in production
- [ ] Pretty-printed logs in development
- [ ] Request correlation IDs on all server logs
- [ ] Errors sent to Sentry with full context
- [ ] No sensitive data in logs (redaction)
- [ ] Environment-based log levels working
- [ ] Next.js dev overlay shows errors correctly
- [ ] Zero TypeScript errors
- [ ] All existing tests pass

---

## Next Steps

1. **Create Implementation Plan** - Detailed phases with TODOs
2. **Set up Pino v9** - Install and configure
3. **Migrate logger.ts** - Replace custom implementation
4. **Add request context** - AsyncLocalStorage middleware
5. **Update error handler** - Integrate with Pino
6. **Migrate console.log calls** - Gradual cleanup
7. **Test in staging** - Validate production behavior

---

## Unresolved Questions

1. Current log volume and cost targets for production?
2. Specific compliance requirements (GDPR, CCPA)?
3. Datadog integration timeline?
4. Desired log retention period?
5. Blockchain transaction audit logging requirements?

---

**Decision:** Proceed with Pino migration
**Report Location:** `E:/zuno-marketplace-ui/plans/reports/brainstorm-260208-1238-logger-refactor-pino-migration.md`
