---
title: "Create Collection - Cross-Project Implementation"
description: "Comprehensive plan covering all zuno-marketplace-* projects for create collection workflow"
status: pending
priority: P0
effort: 120-150h
branch: feature/create-collection
tags: [collection, creation, cross-project, ecosystem]
created: 2026-02-01
---

# Create Collection - Cross-Project Implementation Plan

## Executive Summary

This plan coordinates create collection implementation across ALL zuno-marketplace-* projects:
- zuno-marketplace-ui (Next.js frontend)
- zuno-marketplace-sdk (TypeScript SDK)
- zuno-marketplace-api (Go backend)
- zuno-marketplace-indexer (Ponder indexer)
- zuno-marketplace-metadata (Metadata service)
- zuno-marketplace-notifications (Notification service)

## Cross-Project Architecture

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

## Project Responsibilities

| Project | Role in Create Collection | Key Files |
|---------|---------------------------|-----------|
| **ui** | Form, GraphQL client, SDK integration | useCreateCollection.ts, CreateCollectionForm.tsx |
| **sdk** | Contract deployment, blockchain calls | CollectionModule.ts, React hooks |
| **api** | GraphQL gateway, collection service | collection.proto, resolvers |
| **indexer** | Event indexing, collection verification | erc721-created.handler.ts |
| **metadata** | IPFS upload, metadata processing | upload service, pinata integration |
| **notifications** | WebSocket, email notifications | collection events notifier |

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

## Phase Structure

### Phase Group A: Infrastructure (All Projects)
- Phase 01: Error Handling Standards (All projects)
- Phase 02: Shared Types & Contracts (SDK + API)
- Phase 03: Database Schema (API)

### Phase Group B: Core Implementation (Parallel)
- Phase 04: SDK Collection Module Enhancements
- Phase 05: API Collection Service Implementation
- Phase 06: Indexer Event Handlers
- Phase 07: Metadata Service Integration

### Phase Group C: Integration (Sequential)
- Phase 08: UI + SDK Integration
- Phase 09: API + Indexer Sync
- Phase 10: Notification Webhooks

### Phase Group D: Testing (All Projects)
- Phase 11: Unit Tests (All)
- Phase 12: Integration Tests (Cross-project)
- Phase 13: E2E Tests (UI flow)

## Phase Files

1. [Phase 01: Error Handling Standards](./phase-01-error-handling-standards.md)
2. [Phase 02: Shared Types & Contracts](./phase-02-shared-types-contracts.md)
3. [Phase 03: Database Schema](./phase-03-database-schema.md)
4. [Phase 04: SDK Collection Module](./phase-04-sdk-collection-module.md)
5. [Phase 05: API Collection Service](./phase-05-api-collection-service.md)
6. [Phase 06: Indexer Event Handlers](./phase-06-indexer-event-handlers.md)
7. [Phase 07: Metadata Service](./phase-07-metadata-service.md)
8. [Phase 08: UI SDK Integration](./phase-08-ui-sdk-integration.md)
9. [Phase 09: API Indexer Sync](./phase-09-api-indexer-sync.md)
10. [Phase 10: Notification Webhooks](./phase-10-notification-webhooks.md)
11. [Phase 11: Unit Tests](./phase-11-unit-tests.md)
12. [Phase 12: Integration Tests](./phase-12-integration-tests.md)
13. [Phase 13: E2E Tests](./phase-13-e2e-tests.md)

## Execution Order

```
Group A (Parallel across projects)
├── Phase 01 (All projects)
├── Phase 02 (SDK + API)
└── Phase 03 (API only)
         │
         ▼
Group B (Parallel)
├── Phase 04 (SDK)
├── Phase 05 (API)
├── Phase 06 (Indexer)
└── Phase 07 (Metadata)
         │
         ▼
Group C (Sequential)
├── Phase 08 (UI + SDK)
├── Phase 09 (API + Indexer)
└── Phase 10 (Notifications)
         │
         ▼
Group D (Testing)
├── Phase 11 (All projects)
├── Phase 12 (Cross-project)
└── Phase 13 (UI E2E)
```

## File Ownership Matrix

| Phase | Project | Files |
|-------|---------|-------|
| 01 | ui | errors/collection-errors.ts |
| 01 | sdk | errors/CollectionError.ts |
| 01 | api | errors/collection.go |
| 02 | sdk | types/contracts.ts |
| 02 | api | proto/collection.proto |
| 03 | api | migrations/, models/ |
| 04 | sdk | CollectionModule.ts |
| 05 | api | service/collection.go |
| 06 | indexer | handlers/erc721-created.ts |
| 07 | metadata | routes/upload.ts |
| 08 | ui | useCreateCollection.ts |
| 09 | api | webhook handlers |
| 10 | notifications | event consumers |

## Validation Summary

**Validated:** 2026-02-01
**Questions asked:** 4

### Confirmed Decisions

| Decision | User Choice | Impact |
|----------|-------------|--------|
| Implementation Scope | All 6 projects in parallel | Requires full team coordination |
| Type Sharing | GraphQL schema as source of truth | Update Phase 02 - use GraphQL codegen instead of protobuf |
| Recovery Strategy | Automatic retry with exponential backoff | Update Phase 01/08 - implement auto-retry with circuit breaker |
| Timeline | 2-3 weeks (aggressive) | Requires parallel execution, minimal blockers |

### Action Items

- [ ] Update Phase 02: Replace protobuf with GraphQL schema approach
- [ ] Update Phase 01: Add automatic retry logic specifications
- [ ] Update Phase 08: Implement exponential backoff in useCreateCollection
- [ ] Ensure all 6 projects have dedicated resources for parallel execution

## Success Criteria

- [ ] Collection created end-to-end across all projects
- [ ] Image uploaded to IPFS via metadata service
- [ ] Smart contract deployed via SDK
- [ ] Events indexed by indexer
- [ ] Database updated via API
- [ ] Notifications sent
- [ ] All tests passing
- [ ] Automatic retry working for transient failures
