---
title: "React Query Infinite Scroll Integration for NFTGrid"
description: "Implement TanStack Query v5 infinite scroll with cursor pagination for marketplace NFT grid"
status: pending
priority: P1
effort: 8h
branch: feature/marketplace
tags: [tanstack-query, infinite-scroll, pagination, nft-marketplace]
created: 2026-01-25
---

# React Query Infinite Scroll Implementation Plan

## Overview

Implement production-ready infinite scroll for NFTGrid component using TanStack Query v5 with cursor-based pagination, replacing the current mock implementation with a scalable query architecture.

## Phase Summary

| Phase | Status | Duration | Description |
|-------|--------|----------|-------------|
| [Phase 01: Setup Structure](./phase-01-setup-structure.md) | pending | 1h | Create query folder & install deps |
| [Phase 02: Query Options](./phase-02-query-options.md) | pending | 1.5h | Implement queryOptions with mock adapter |
| [Phase 03: Hook Wrapper](./phase-03-hook-wrapper.md) | pending | 1h | Create useInfiniteMarketplaceItems hook |
| [Phase 04: Scroll Trigger](./phase-04-scroll-trigger.md) | pending | 1h | Build InfiniteScrollTrigger component |
| [Phase 05: Integration](./phase-05-integration.md) | pending | 2h | Integrate with NFTGrid & marketplace |
| [Phase 06: Testing](./phase-06-testing.md) | pending | 1h | Test implementation & fix issues |
| [Phase 07: Documentation](./phase-07-documentation.md) | pending | 0.5h | Update docs if needed |

## Key Requirements

- **TanStack Query v5** infinite queries with queryOptions pattern
- **Cursor-based pagination** (16 items per page)
- **Server-side filtering/sorting** support
- **Auto-scroll detection** with Intersection Observer (200px rootMargin)
- **Aggressive caching** (15s staleTime, 5min gcTime)
- **Mock-friendly** architecture for API-in-progress backend
- Follow project code standards (kebab-case, TypeScript strict mode)

## Related Reports

- [Brainstorming Report](../reports/brainstorm-260125-2158-react-query-infinite-scroll.md)
- [TanStack Query Research](./research/researcher-tanstack-query.md)
- [Infinite Scroll Research](./research/researcher-infinite-scroll.md)

## Files to Create

```
src/modules/marketplace/queries/
├── infinite-marketplace-items.query.ts
├── use-infinite-marketplace-items.ts
├── types.ts
└── index.ts

src/modules/marketplace/components/
└── InfiniteScrollTrigger.tsx
```

## Files to Modify

- `src/modules/marketplace/components/NFTGrid.tsx`
- `src/modules/marketplace/hooks/useMyItems.ts`
- `src/modules/marketplace/index.tsx`

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  ShopNFTs (Parent)                  │
│  ┌───────────────────────────────────────────────┐  │
│  │     Filter State (priceRange, status, etc.)   │  │
│  └───────────────────────────────────────────────┘  │
│                       │                              │
│                       ▼                              │
│  ┌───────────────────────────────────────────────┐  │
│  │    useInfiniteMarketplaceItems Hook           │  │
│  │  - useInfiniteQuery(queryOptions)             │  │
│  │  - Returns: data, hasNextPage, fetchNextPage  │  │
│  └───────────────────────────────────────────────┘  │
│                       │                              │
│                       ▼                              │
│  ┌───────────────────────────────────────────────┐  │
│  │         NFTGrid Component                     │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  NFT Cards (data.pages.flatMap)         │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  InfiniteScrollTrigger                  │  │  │
│  │  │  - Intersection Observer (200px margin) │  │  │
│  │  │  - Calls fetchNextPage()                │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│            infiniteMarketplaceItemsOptions          │
│  ┌───────────────────────────────────────────────┐  │
│  │  queryKey: ['marketplace', contract, filters] │  │
│  │  queryFn: fetchMarketplaceItems              │  │
│  │  getNextPageParam: extract nextCursor        │  │
│  │  staleTime: 15000, gcTime: 300000            │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Success Criteria

- [x] Loads 16 initial items on mount
- [x] Auto-loads next page at 200px from bottom
- [x] Filter changes reset query to page 1
- [x] Mock adapter works without real API
- [x] No duplicate requests or memory leaks
- [x] Type-safe throughout (TypeScript strict mode)
- [x] Follows codebase standards (kebab-case, etc.)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backend API not ready | High | Mock adapter pattern for seamless swap |
| Race condition on scroll | Medium | `isFetchingNextPage` guard + throttling |
| Memory bloat (many pages) | Medium | `maxPages: 10` limit in query config |
| Filter sync issues | Low | Filters in queryKey for auto-reset |

## Next Steps

1. Begin with **Phase 01: Setup Structure**
2. Ensure TanStack Query is installed
3. Create query folder structure
4. Implement mock adapter for API-in-progress state

## Validation Summary

**Validated:** 2026-01-25
**Questions asked:** 5

### Confirmed Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Cursor Format** | ID-based cursor | Most stable, works with any sorting method |
| **Filter Strategy** | Full server-side | Required for infinite scroll with pagination |
| **List View Support** | Include in Phase 05 | Consistent UX across both view modes |
| **Total Items Display** | Total count from API | Shows full count, requires API to provide totalCount |
| **Real-time Updates** | No real-time needed | 15s cache is acceptable, keep it simple |

### Action Items Based on Validation

1. **[API Required]** Backend must return `totalCount` field in response for ControlBar display
2. **[Phase 05 Update]** Add NFTListView infinite scroll integration to Phase 05 tasks
3. **[Types Update]** Add `totalCount?: number` to `MarketplaceItemsPage` interface
4. **[Mock Update]** Update mock adapter to include `totalCount` in responses
5. **[Cursor Field]** Use `id` (or `_id`) as cursor field in mock adapter

### Updated API Response Shape

```typescript
interface MarketplaceItemsPage {
  items: Nft[];
  nextCursor: string | null;  // ID of last item for next page
  hasMore: boolean;
  totalCount: number;  // NEW: Total items matching filters
}
```

### Unresolved Questions

1. **Real API Response Shape**: Finalize API contract with backend team
2. **Error Recovery**: What should happen on scroll failure? (Retry or show error?)
