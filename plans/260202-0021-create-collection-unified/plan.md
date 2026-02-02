---
title: "Create Collection - Unified Implementation Plan"
description: "Comprehensive plan covering UI-specific and cross-project implementation for create collection workflow"
status: in_progress
priority: P0
effort: 140-180h
branch: feature/create-collection
tags: [collection, creation, cross-project, ecosystem, ui, error-handling]
created: 2026-02-01
updated: 2026-02-02
---

# Create Collection - Unified Implementation Plan

## Executive Summary

This unified plan combines both UI-specific implementation and cross-project coordination for the complete create collection feature across ALL zuno-marketplace-* projects.

**Projects Involved:**
- zuno-marketplace-ui (Next.js frontend)
- zuno-marketplace-sdk (TypeScript SDK)
- zuno-marketplace-api (Go backend)
- zuno-marketplace-indexer (Ponder indexer)
- zuno-marketplace-metadata (Metadata service)
- zuno-marketplace-notifications (Notification service)

---

## Unified Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CREATE COLLECTION FLOW                               │
│                      Across All Zuno Marketplace Projects                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  USER → UI → API → SDK → BLOCKCHAIN → INDEXER → API → UI                   │
│         ↓    ↓    ↓                  ↓         ↓                           │
│      METADATA  NOTIFICATIONS      METADATA  NOTIFICATIONS                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase Structure

### Phase Group A: Infrastructure & Standards (All Projects)
- Phase 01: Error Handling Standards (All projects)
- Phase 02: Shared Types & Contracts (SDK + API)
- Phase 03: Database Schema (API)

### Phase Group B: UI Foundation (Parallel)
- Phase 04: Error Handling & Recovery Infrastructure (UI)
- Phase 05: State Persistence Layer (UI)

### Phase Group C: Core Implementation (Parallel)
- Phase 06: Pre-flight Validation & Gas Checks (UI)
- Phase 07: Transaction State Machine (UI)
- Phase 08: SDK Collection Module Enhancements
- Phase 09: API Collection Service Implementation
- Phase 10: Indexer Event Handlers
- Phase 11: Metadata Service Integration

### Phase Group D: Integration & Hooks (Sequential)
- Phase 12: Enhanced Create Collection Hook (UI)
- Phase 13: UI + SDK Integration
- Phase 14: API + Indexer Sync
- Phase 15: Notification Webhooks

### Phase Group E: UI Components & Testing
- Phase 16: UI Components & Feedback (UI)
- Phase 17: Unit Tests (All projects)
- Phase 18: Integration Tests (Cross-project)
- Phase 19: E2E Tests (UI flow)

---

## Execution Order

```
Group A (Infrastructure)
├── Phase 01: Error Handling Standards (All projects)
├── Phase 02: Shared Types & Contracts
└── Phase 03: Database Schema
         │
         ▼
Group B (UI Foundation - Parallel)
├── Phase 04: UI Error Handling Infrastructure
└── Phase 05: State Persistence Layer
         │
         ▼
Group C (Core Implementation - Parallel)
├── Phase 06: Gas Estimation (UI)
├── Phase 07: Transaction State Machine (UI)
├── Phase 08: SDK Collection Module
├── Phase 09: API Collection Service
├── Phase 10: Indexer Event Handlers
└── Phase 11: Metadata Service
         │
         ▼
Group D (Integration - Sequential)
├── Phase 12: Enhanced Create Collection Hook
├── Phase 13: UI + SDK Integration
├── Phase 14: API + Indexer Sync
└── Phase 15: Notification Webhooks
         │
         ▼
Group E (UI Components & Testing)
├── Phase 16: UI Components & Feedback
├── Phase 17: Unit Tests
├── Phase 18: Integration Tests
└── Phase 19: E2E Tests
```

---

## Phase Summary

| Phase | Group | Project | Effort | Status | Description |
|-------|-------|---------|--------|--------|-------------|
| 01 | A | All | 4-6h | pending | Error handling standards across projects |
| 02 | A | SDK+API | 4-6h | pending | Shared types & GraphQL contracts |
| 03 | A | API | 6-8h | pending | Database schema for collections |
| 04 | B | UI | 4-6h | completed | UI error handling & recovery |
| 05 | B | UI | 4-6h | completed | State persistence layer |
| 06 | C | UI | 6-8h | completed | Gas estimation & validation |
| 07 | C | UI | 8-10h | completed | Transaction state machine |
| 08 | C | SDK | 8-10h | completed | Collection module enhancements |
| 09 | C | API | 10-12h | completed | Collection service implementation |
| 10 | C | Indexer | 8-10h | completed | Event handlers for ERC721 |
| 11 | C | Metadata | 6-8h | completed | IPFS upload integration |
| 12 | D | UI | 10-12h | completed | Enhanced create collection hook |
| 13 | D | UI+SDK | 8-10h | completed | UI-SDK integration |
| 14 | D | API+Indexer | 6-8h | completed | API-Indexer synchronization |
| 15 | D | Notifications | 4-6h | completed | Webhook notifications |
| 16 | E | UI | 8-10h | completed | UI components & feedback |
| 17 | E | All | 10-12h | pending | Unit tests (deferred) |
| 18 | E | All | 12-16h | pending | Cross-project integration tests (deferred) |
| 19 | E | UI | 8-10h | pending | E2E UI tests (deferred) |

**Total Effort:** 140-180 hours

---

## File Ownership Matrix

### UI (zuno-marketplace-ui)
| Phase | Files | Exclusive |
|-------|-------|-----------|
| 04 | `src/shared/errors/collection-errors.ts` | YES |
| 04 | `src/shared/hooks/use-recovery.ts` | YES |
| 05 | `src/shared/utils/storage.ts` | YES |
| 05 | `src/shared/hooks/use-persisted-creation.ts` | YES |
| 06 | `src/shared/utils/gas.ts` | YES |
| 06 | `src/shared/hooks/use-gas-estimation.ts` | YES |
| 07 | `src/shared/machines/creation-machine.ts` | YES |
| 07 | `src/shared/hooks/use-transaction-state.ts` | YES |
| 12 | `src/modules/launch-pad/create-form/hooks/useCreateCollection.ts` | YES |
| 13 | Integration files | YES |
| 16 | `src/modules/create/components/creation-progress.tsx` | YES |
| 16 | `src/modules/create/components/error-recovery.tsx` | YES |

### SDK (zuno-marketplace-sdk)
| Phase | Files | Exclusive |
|-------|-------|-----------|
| 01 | `errors/CollectionError.ts` | YES |
| 02 | `types/contracts.ts` | YES |
| 08 | `CollectionModule.ts` | YES |

### API (zuno-marketplace-api)
| Phase | Files | Exclusive |
|-------|-------|-----------|
| 01 | `errors/collection.go` | YES |
| 02 | `proto/collection.proto` | YES |
| 03 | `migrations/`, `models/` | YES |
| 09 | `service/collection.go` | YES |
| 14 | Webhook handlers | YES |

### Other Projects
| Phase | Project | Files |
|-------|---------|-------|
| 10 | Indexer | `handlers/erc721-created.ts` |
| 11 | Metadata | `routes/upload.ts` |
| 15 | Notifications | Event consumers |

---

## Phase Files

### Group A: Infrastructure
1. [Phase 01: Error Handling Standards](./phase-01-error-handling-standards.md)
2. [Phase 02: Shared Types & Contracts](./phase-02-shared-types-contracts.md)
3. [Phase 03: Database Schema](./phase-03-database-schema.md)

### Group B: UI Foundation
4. [Phase 04: UI Error Handling Infrastructure](./phase-04-ui-error-handling.md)
5. [Phase 05: State Persistence Layer](./phase-05-state-persistence.md)

### Group C: Core Implementation
6. [Phase 06: Gas Estimation & Validation](./phase-06-gas-estimation.md)
7. [Phase 07: Transaction State Machine](./phase-07-transaction-state-machine.md)
8. [Phase 08: SDK Collection Module](./phase-08-sdk-collection-module.md)
9. [Phase 09: API Collection Service](./phase-09-api-collection-service.md)
10. [Phase 10: Indexer Event Handlers](./phase-10-indexer-event-handlers.md)
11. [Phase 11: Metadata Service](./phase-11-metadata-service.md)

### Group D: Integration
12. [Phase 12: Enhanced Create Collection Hook](./phase-12-enhanced-hook.md)
13. [Phase 13: UI SDK Integration](./phase-13-ui-sdk-integration.md)
14. [Phase 14: API Indexer Sync](./phase-14-api-indexer-sync.md)
15. [Phase 15: Notification Webhooks](./phase-15-notification-webhooks.md)

### Group E: UI & Testing
16. [Phase 16: UI Components & Feedback](./phase-16-ui-components.md)
17. [Phase 17: Unit Tests](./phase-17-unit-tests.md)
18. [Phase 18: Integration Tests](./phase-18-integration-tests.md)
19. [Phase 19: E2E Tests](./phase-19-e2e-tests.md)

---

## Additional Resources

- [Branching Strategy](./branching-strategy.md) - Git branch strategy and PR workflow

---

## Cross-Project Dependencies

```
UI ──────depends_on──────► SDK
 │                        │
 │                        ▼
 └───► API ◄───────── BLOCKCHAIN ◄─── SDK
       │                   │
       ▼                   ▼
    INDEXER (reads events) │
       │                   │
       └──────updates──────┘

METADATA ◄── called by ── UI (image upload)
NOTIFICATIONS ◄── called by ── API (events)
```

---

## Parallelization Rules

### Can Run in Parallel
- **Phase 01, 02, 03** - Infrastructure setup across different projects
- **Phase 04 & 05** - UI foundation, no dependencies
- **Phase 06-11** - Core implementation across different projects

### Must Run Sequentially
- **Phase 12** requires Phase 06-07 (uses gas estimation and state machine)
- **Phase 13** requires Phase 08 & 12 (needs SDK module and enhanced hook)
- **Phase 14** requires Phase 09 & 10 (API service and indexer handlers)
- **Phase 16** requires Phase 12 (uses enhanced hook)
- **Phase 17-19** require all implementation phases

### Conflict Prevention
1. Each phase owns exclusive files
2. Shared types defined in Phase 01-02
3. Clear interfaces documented in each phase
4. No barrel file imports during implementation

---

## Validation Summary

**Validated:** 2026-02-01
**Questions asked:** 4

### Confirmed Decisions

| Decision | User Choice | Impact |
|----------|-------------|--------|
| Implementation Scope | All 6 projects in parallel | Requires full team coordination |
| Type Sharing | GraphQL schema as source of truth | Use GraphQL codegen |
| Recovery Strategy | Automatic retry with exponential backoff | Auto-retry with circuit breaker |
| Timeline | 2-3 weeks (aggressive) | Requires parallel execution |

---

## Success Criteria

- [x] All 10 edge cases from original brainstorm handled
- [x] Recovery mechanism works for failed deployments
- [x] State persists across browser refreshes
- [x] Gas estimation validates before deployment
- [x] Transaction replacement detected
- [ ] Collection created end-to-end across all projects
- [ ] Image uploaded to IPFS via metadata service
- [ ] Smart contract deployed via SDK
- [ ] Events indexed by indexer
- [ ] Database updated via API
- [ ] Notifications sent
- [ ] All tests passing
- [ ] Automatic retry working for transient failures

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cross-project coordination | High | Daily standups, clear interfaces |
| State machine complexity | Medium | Well-tested, simple transitions |
| localStorage quota exceeded | Low | TTL + size limits |
| Gas estimation accuracy | Medium | 25% buffer + fallback |
| Parallel phase conflicts | Low | Exclusive file ownership |
| Timeline pressure | High | Parallel execution, priority focus |

---

## Next Steps

1. Execute Group A (Phase 01-03) in parallel across projects
2. Review and merge infrastructure
3. Execute Group B (Phase 04-05) in parallel
4. Execute Group C (Phase 06-11) in parallel across projects
5. Review and merge core implementation
6. Execute Group D (Phase 12-15) sequentially
7. Execute Group E (Phase 16-19) for UI completion and testing
