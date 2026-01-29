# React Query Infinite Scroll Brainstorming Report

## Problem Statement

Implement infinite scroll for `NFTGrid.tsx` using:

- **TanStack Query v5** infinite queries with query options pattern
- **Cursor-based pagination** (12-20 items per page)
- **Server-side filtering/sorting**
- **Auto-scroll detection** with Intersection Observer
- **Very aggressive cache** (15s stale time, 5min gcTime)
- **Split query folder** architecture
- **Mock-friendly** for API-in-progress backend

## Evaluated Approaches

### Approach 1: Direct useInfiniteQuery in NFTGrid

❌ **REJECTED** - Violates separation of concerns, hard to test, can't use queryOptions pattern

### Approach 2: Custom Hook with useInfiniteQuery

⚠️ **ACCEPTABLE** - Better separation but query config still tied to hook, not optimal for query folder

### Approach 3: Query Options Pattern with Split Folder

✅ **RECOMMENDED** - Full queryOptions pattern, clean separation, testable, scalable

## Final Solution Architecture

```
src/modules/marketplace/
├── queries/
│   ├── infinite-marketplace-items.query.ts   # Query options definition
│   ├── use-infinite-marketplace-items.ts     # Hook wrapper
│   └── types.ts                              # Query-specific types
├── components/
│   ├── NFTGrid.tsx                           # Update for infinite scroll
│   └── InfiniteScrollTrigger.tsx             # Intersection Observer
└── hooks/
    └── use-marketplace-filters.ts            # Filter state management
```

## Key Decisions

1. **Query Options Pattern**: Centralized query definitions for testability and reusability
2. **Mock Adapter**: Swappable fetcher for API-in-progress state
3. **Filter Sync**: Include filters in queryKey for auto-reset on change
4. **Memory Mgmt**: 5min gcTime, 200px rootMargin for scroll trigger
5. **Race Condition Guard**: hasNextPage + !isFetchingNextPage check

## Dependencies

- `react-intersection-observer` package
- Backend API with cursor pagination
- Filter state refactored for server-side

## Success Criteria

1. Loads 16 initial items on mount
2. Auto-loads next page at 200px from bottom
3. Filters reset query to page 1
4. Mock adapter works without real API
5. No duplicate requests or memory leaks

## Unresolved Questions

1. **API Response Shape**: What will the real API response look like?
2. **Filter Complexity**: Are there filters that can't be server-side?
3. **Real-time Updates**: Should NFTs update in real-time (WebSocket)?
4. **Error Handling**: What happens when API returns error mid-scroll?

## Time Estimate

6-9 hours total:

- Setup & query options: 2-3 hours
- Components & integration: 2-3 hours
- Testing & refinement: 2-3 hours
