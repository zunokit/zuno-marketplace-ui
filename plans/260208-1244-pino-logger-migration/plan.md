---
title: "Pino Logger Migration"
description: "Migrate from custom Logger to Pino v9 with structured logging, correlation IDs, and Sentry integration"
status: pending
priority: P1
effort: 12h
branch: feature/implement-logger
tags: [logging, pino, sentry, observability]
created: 2026-02-08
---

# Pino Logger Migration Plan

## Overview

Migrate the Zuno Marketplace UI from a custom `console.*`-based Logger class to **Pino v9** with production-grade features:

- Structured JSON logging for log aggregation
- Request correlation IDs via AsyncLocalStorage
- Environment-based log levels
- Sentry integration via Pino transport
- Log sampling for cost control
- Sensitive data redaction

## Context

- **Project:** Next.js 16 + React 19 + TypeScript 5.9
- **Current:** Custom Logger class wrapping `console.*` methods
- **Target:** Pino v9 with full Next.js runtime support
- **Reports:**
  - [Brainstorm Report](../reports/brainstorm-260208-1238-logger-refactor-pino-migration.md)
  - [Pino v9 Research](./reports/researcher-260208-1245-pino-v9-nextjs16-integration.md)
  - [AsyncLocalStorage Research](./reports/researcher-260208-1245-asynclocalstorage-patterns.md)

## Phases

| Phase | Description | Status | File |
|-------|-------------|--------|------|
| 1 | Setup & Dependencies | pending | [phase-01-setup-dependencies.md](./phase-01-setup-dependencies.md) |
| 2 | Core Logger Implementation | pending | [phase-02-core-logger.md](./phase-02-core-logger.md) |
| 3 | Request Context & Correlation | pending | [phase-03-request-context.md](./phase-03-request-context.md) |
| 4 | Sentry Integration | pending | [phase-04-sentry-integration.md](./phase-04-sentry-integration.md) |
| 5 | Error Handler Migration | pending | [phase-05-error-handler.md](./phase-05-error-handler.md) |
| 6 | Console.log Cleanup | pending | [phase-06-console-cleanup.md](./phase-06-console-cleanup.md) |

## Key Decisions

1. **Pino v9.9.0+** - Avoids TypeScript regression in v9.8.0
2. **`sync: true`** - Required for React Server Components
3. **AsyncLocalStorage** - For request correlation in Node.js runtime
4. **Headers fallback** - For Edge Runtime compatibility
5. **Proxy pattern** - Auto-inject context into log entries

## Environment Variables

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

## Success Criteria

- [ ] All logs output as structured JSON in production
- [ ] Pretty-printed logs in development
- [ ] Request correlation IDs on all server logs
- [ ] Errors sent to Sentry with full context
- [ ] No sensitive data in logs (redaction)
- [ ] Zero TypeScript errors
- [ ] All existing tests pass

## Risks

| Risk | Mitigation |
|------|------------|
| Pino v9 breaking changes | Use v9.9.0+, test in staging |
| `sync: true` performance | Monitor, adjust if needed |
| Edge Runtime compatibility | Headers fallback pattern |
| Migration time | Phased approach, gradual cleanup |

## Next Steps

1. Review and approve this plan
2. Run `/cook E:/zuno-marketplace-ui/plans/260208-1244-pino-logger-migration/plan.md` to start implementation
