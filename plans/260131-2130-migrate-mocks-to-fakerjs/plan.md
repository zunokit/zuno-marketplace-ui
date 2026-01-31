---
title: "Migrate Manual Mocks to Faker.js"
description: "Replace hand-crafted mock data generators with @faker-js/faker for better maintainability and realistic test data"
status: pending
priority: P2
effort: 5h
branch: develop
tags: [refactor, testing, mocks, developer-experience]
created: 2025-01-31
---

# Migrate Manual Mocks to Faker.js

## Overview

Replace ~1,150 lines of manual mock generators across 13 files with Faker.js library. Reduces code volume by ~65%, adds seeding support for deterministic tests, and provides realistic data patterns.

## Context

- **Brainstorm Report**: [brainstorm-260131-2126-migrate-to-fakerjs.md](../reports/brainstorm-260131-2126-migrate-to-fakerjs.md)
- **Current Mock Location**: `src/shared/utils/mock/`
- **Target**: ~400 lines with domain-specific fakers

## Phases

| # | Phase | Status | Effort | Link |
|---|-------|--------|--------|------|
| 1 | Setup Faker.js | Pending | 30m | [phase-01-setup-fakerjs.md](./phase-01-setup-fakerjs.md) |
| 2 | Create Domain Fakers | Pending | 2h | [phase-02-create-domain-fakers.md](./phase-02-create-domain-fakers.md) |
| 3 | Migrate Mock Files | Pending | 2h | [phase-03-migrate-mock-files.md](./phase-03-migrate-mock-files.md) |
| 4 | Validate & Cleanup | Pending | 30m | [phase-04-validate-cleanup.md](./phase-04-validate-cleanup.md) |

## Key Decisions

1. **Backward Compatibility**: Keep existing exports during transition
2. **Files to Migrate**: mockAccount.ts, mockCollection.ts, mockBanner.ts, nft-detail.ts, profile.ts, marketplace.ts, auction.ts, wallet.ts, sidebarData.ts
3. **Files Unchanged**: mockChain.ts, mock-adapter.ts (mostly static)
4. **Seeding Support**: All fakers support seeding for deterministic tests

## Success Criteria

- [ ] All 13 mock files migrated or deprecated
- [ ] Zero TypeScript errors (`pnpm typecheck`)
- [ ] Mock data volume reduced by 50%+
- [ ] New mock data can be seeded for determinism
- [ ] Existing tests pass without modification

## Risks

| Risk | Mitigation |
|------|------------|
| Breaking existing tests | Keep legacy exports during transition |
| Faker.js bundle size | Use tree-shaking imports |
| Data shape changes | Validate against existing TypeScript interfaces |
