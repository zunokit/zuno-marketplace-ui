---
title: "Phase 6: Console.log Cleanup"
description: "Migrate 22+ files from console.log to structured logger"
---

# Phase 6: Console.log Cleanup

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 5: Error Handler](./phase-05-error-handler.md)

## Overview

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Status** | pending |
| **Estimated Effort** | 3 hours |
| **Dependencies** | Phase 5 complete |

Migrate 22+ files using raw `console.*` calls to use the structured Pino logger.

## Key Insights

- 22 files identified with console.log/console.error
- Some are debug UI components (can keep console)
- Others should use logger for consistency
- Gradual migration acceptable

## Files to Migrate

| File | Current | Action |
|------|---------|--------|
| `src/app/error.tsx` | logger.error | ✅ Already uses logger |
| `src/shared/components/error-boundary.tsx` | logger.error | ✅ Already uses logger |
| `src/shared/hooks/use-auth.ts` | console.log | Migrate to authLogger |
| `src/shared/hooks/use-transaction-state.ts` | console.log | Migrate to blockchainLogger |
| `src/shared/api/client.ts` | console.error | Migrate to logger.error |
| `src/shared/lib/apollo/apollo-client.ts` | console.* | Migrate to graphqlLogger |
| `src/modules/marketplace/index.tsx` | console.log | Migrate to logger |
| `src/modules/marketplace/components/*.tsx` | console.log | Migrate to logger |
| `src/modules/auctions/components/*.tsx` | console.log | Migrate to logger |
| `src/modules/nft-detail/components/*.tsx` | console.log | Migrate to logger |
| `src/modules/mint/**/*.ts` | console.log | Migrate to logger |
| `src/modules/profile/components/*.tsx` | console.log | Migrate to logger |
| `src/modules/launch-pad/**/*.ts` | console.log | Migrate to logger |
| `src/app/debug/ui/sections/*.tsx` | console.* | Keep (debug UI) |

## Requirements

### Functional

- Replace console.log with appropriate logger
- Use namespace-specific loggers where applicable
- Preserve log messages and context

### Non-Functional

- No functional changes
- Same log output in development

## Implementation Steps

1. **High Priority (Auth, API, Transactions)**
   ```typescript
   // src/shared/hooks/use-auth.ts
   // BEFORE:
   console.log('User authenticated', user);

   // AFTER:
   import { createLogger } from '@/shared/lib/logger';
   const log = createLogger('Auth');
   log.info('User authenticated', { userId: user.id });
   ```

2. **Medium Priority (Components)**
   ```typescript
   // src/modules/marketplace/components/*.tsx
   import { logger } from '@/shared/lib/logger';

   // BEFORE:
   console.log('Listing created', listingId);

   // AFTER:
   logger.info({ listingId }, 'Listing created');
   ```

3. **Low Priority (Debug UI)**
   - Keep console.log in `src/app/debug/ui/sections/*`
   - These are development tools

## Todo List

- [ ] Migrate use-auth.ts
- [ ] Migrate use-transaction-state.ts
- [ ] Migrate api/client.ts
- [ ] Migrate apollo/apollo-client.ts
- [ ] Migrate marketplace components
- [ ] Migrate auctions components
- [ ] Migrate nft-detail components
- [ ] Migrate mint components
- [ ] Migrate profile components
- [ ] Migrate launch-pad components
- [ ] Verify no console.* in production code

## Success Criteria

- [ ] All production code uses logger
- [ ] Debug UI can keep console.*
- [ ] No regression in functionality
- [ ] TypeScript compiles

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Missed console.log | Low | Medium | ESLint rule |
| Breaking changes | Medium | Low | Test each file |

## Security Considerations

- Ensure no sensitive data in log messages
- Pino redaction will catch most cases

## Next Steps

After completion:
1. Run full test suite
2. Deploy to staging
3. Monitor logs in production
4. Update documentation

## Unresolved Questions

1. Should we add ESLint rule to prevent console.log?
2. Should debug UI use logger instead of console?
