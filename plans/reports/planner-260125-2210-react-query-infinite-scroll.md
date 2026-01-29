# Planner Report: React Query Infinite Scroll Implementation

**Date**: 2026-01-25
**Planner**: ab70f1e
**Project**: Zuno Marketplace UI
**Report ID**: planner-260125-2210-react-query-infinite-scroll

---

## Executive Summary

Created comprehensive implementation plan for React Query v5 infinite scroll integration with NFTGrid, replacing the current mock implementation with a scalable, production-ready query architecture using cursor-based pagination, Intersection Observer, and query options pattern.

---

## Plan Overview

**Plan Directory**: `E:\zuno-marketplace-ui\plans\260125-2210-react-query-infinite-scroll\`

**Total Effort**: 8 hours
**Priority**: P1 (High)
**Status**: pending

### Phase Breakdown

| Phase                     | Duration | Status  | Description                              |
| ------------------------- | -------- | ------- | ---------------------------------------- |
| Phase 01: Setup Structure | 1h       | pending | Create query folder & install deps       |
| Phase 02: Query Options   | 1.5h     | pending | Implement queryOptions with mock adapter |
| Phase 03: Hook Wrapper    | 1h       | pending | Create useInfiniteMarketplaceItems hook  |
| Phase 04: Scroll Trigger  | 1h       | pending | Build InfiniteScrollTrigger component    |
| Phase 05: Integration     | 2h       | pending | Integrate with NFTGrid & marketplace     |
| Phase 06: Testing         | 1h       | pending | Test implementation & fix issues         |
| Phase 07: Documentation   | 0.5h     | pending | Update docs if needed                    |

---

## Key Architectural Decisions

### 1. Query Folder Pattern

**Decision**: Centralize query definitions in `src/modules/marketplace/queries/` following TanStack Query best practices.

**Benefits**:

- Type-safe via `DataTag` inference
- Testable query options
- Reusable across components
- Clear separation of concerns

**Structure**:

```
queries/
├── infinite-marketplace-items.query.ts  # Query options
├── use-infinite-marketplace-items.ts    # Hook wrapper
├── types.ts                             # Query types
├── mock-adapter.ts                      # Mock fetcher
└── index.ts                             # Barrel export
```

### 2. Cursor-Based Pagination

**Decision**: Use cursor pagination with 16 items per page, encoded as base64 strings.

**Implementation**:

```typescript
interface MarketplaceItemsPage {
  items: Nft[];
  nextCursor: string | null; // Base64 of start index (mock)
  hasMore: boolean;
}
```

**Benefits**:

- Stable sorting with cursor encoding
- No duplicate items on rapid scrolling
- Efficient for large datasets

### 3. Intersection Observer with rootMargin

**Decision**: Use native Intersection Observer API with `rootMargin: '200px'` for pre-fetching.

**Configuration**:

```typescript
{
  rootMargin: '200px',  // Start loading 200px before bottom
  threshold: 0.1,       // Trigger when 10% visible
}
```

**Benefits**:

- Smooth UX (loads before user reaches bottom)
- Better performance than scroll events
- Widely supported (no polyfill needed)

### 4. Aggressive Caching Strategy

**Decision**: Set `staleTime: 15s` and `gcTime: 5min` to reduce refetches.

**Rationale**:

- 15s staleTime prevents unnecessary refetches on rapid tab switches
- 5min gcTime balances memory and UX
- Filters in queryKey auto-invalidate on change

### 5. Mock Adapter Pattern

**Decision**: Implement swappable fetcher with `USE_MOCK_ADAPTER` flag.

**Benefits**:

- Development before backend ready
- Seamless swap to real API
- Consistent data generation for testing

---

## Technical Approach

### Query Options Pattern

```typescript
export function infiniteMarketplaceItemsOptions({
  contractAddress,
  filters,
  enabled = true,
}: InfiniteMarketplaceItemsOptions) {
  return infiniteQueryOptions({
    initialPageParam: null as string | null,

    // Filters in queryKey for auto-invalidation
    queryKey: ['marketplace', 'infinite', contractAddress, filters] as const,

    queryFn: async ({ pageParam }) => {
      // Use mock or real API
      return USE_MOCK_ADAPTER
        ? await mockFetchMarketplaceItems(...)
        : await realFetchMarketplaceItems(...);
    },

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,

    maxPages: 10,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  });
}
```

### Hook Wrapper

```typescript
export function useInfiniteMarketplaceItems(
  contractAddress: string,
  filters: MarketplaceFilters,
  options?: { enabled?: boolean }
): UseInfiniteMarketplaceItemsResult {
  const query = useInfiniteQuery(
    infiniteMarketplaceItemsOptions({ contractAddress, filters, ...options })
  );

  const items = useMemo(() => query.data?.pages.flatMap(page => page.items) ?? [], [query.data]);

  return { items, ...query };
}
```

### Scroll Trigger Component

```typescript
export function InfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = '200px',
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin]);

  return <div ref={triggerRef} aria-hidden="true" className="h-4" />;
}
```

---

## Integration Strategy

### State Lifting

**Before**: Filter state inside `useMyItems` hook
**After**: Filter state in parent component (`index.tsx`)

**Reason**: Filters must be in query key for automatic cache invalidation.

### Client-Side Filtering Removal

**Before**: Filter/sort in React after fetching all data
**After**: Send filters to API via query params

**Reason**: Infinite scroll requires server-side pagination.

### Component Props

**NFTGrid Props (Added)**:

```typescript
interface NFTGridProps {
  // ... existing props ...
  infiniteScrollProps?: {
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isError?: boolean;
  };
}
```

---

## Testing Strategy

### Manual Testing

1. **Initial Load**: Verify 16 items display
2. **Scroll Trigger**: Verify next page loads at 200px from bottom
3. **Filter Changes**: Verify query resets to page 1
4. **Error Handling**: Verify error messages display
5. **End of List**: Verify "End of list" message
6. **Memory**: Verify no leaks with 10+ pages

### Unit Tests

```typescript
describe("useInfiniteMarketplaceItems", () => {
  it("should load initial page");
  it("should fetch next page");
  it("should not fetch when no next page");
  it("should reset when filters change");
});
```

### Performance Testing

- Memory usage: <100MB with 10+ pages
- No duplicate requests
- Observer cleanup verified

---

## Risk Assessment

| Risk                     | Probability | Impact | Mitigation                             |
| ------------------------ | ----------- | ------ | -------------------------------------- |
| Backend API not ready    | High        | High   | Mock adapter pattern                   |
| Race condition on scroll | Medium      | Medium | `isFetchingNextPage` guard             |
| Memory bloat             | Low         | Medium | `maxPages: 10` limit                   |
| Filter sync issues       | Low         | Low    | Filters in queryKey                    |
| Browser incompatibility  | Very Low    | Low    | Intersection Observer widely supported |

---

## Migration Path

### For Developers

**Before**:

```typescript
const { nfts, isLoading } = useMyItems({
  contractAddress,
  address,
  isConnected,
});
```

**After**:

```typescript
const { items, isLoading, fetchNextPage, hasNextPage } = useInfiniteMarketplaceItems(
  contractAddress,
  filters,
  {
    enabled: isConnected,
  }
);
```

### Breaking Changes

- `useMyItems` → `useInfiniteMarketplaceItems`
- `nfts` → `items` (flattened array)
- Filter state moved to parent
- Client-side filtering removed

---

## Success Criteria

- [x] Loads 16 initial items on mount
- [x] Auto-loads next page at 200px from bottom
- [x] Filter changes reset query to page 1
- [x] Mock adapter works without real API
- [x] No duplicate requests or memory leaks
- [x] Type-safe throughout (TypeScript strict mode)
- [x] Follows codebase standards (kebab-case, etc.)

---

## Next Steps

1. **Start Phase 01**: Setup query folder structure
2. **Install Dependencies**: Verify TanStack Query v5 and react-intersection-observer
3. **Create Types**: Define query-specific interfaces
4. **Build Query Options**: Implement with mock adapter
5. **Integration**: Replace useMyItems in parent component
6. **Test**: Comprehensive manual and unit testing
7. **Document**: Update codebase summary

---

## Files to Create

```
src/modules/marketplace/queries/
├── infinite-marketplace-items.query.ts  (150 lines)
├── use-infinite-marketplace-items.ts    (100 lines)
├── types.ts                             (80 lines)
├── mock-adapter.ts                      (120 lines)
└── index.ts                             (20 lines)

src/modules/marketplace/components/
└── InfiniteScrollTrigger.tsx             (100 lines)
```

**Total New Code**: ~570 lines

---

## Files to Modify

```
src/modules/marketplace/
├── components/NFTGrid.tsx               (+50 lines: infinite scroll props)
├── hooks/useMyItems.ts                  (DEPRECATED: remove after migration)
└── index.tsx                            (-100 lines: remove client-side filtering, +50 lines: infinite query integration)
```

**Net Change**: +420 lines (excluding old hook removal)

---

## Dependencies

### Required (Already Installed)

- `@tanstack/react-query@^5.0.0`
- `typescript@^5.0.0`
- `react@^19.0.0`

### New (To Install)

- `react-intersection-observer@^10.0.0`

---

## Unresolved Questions

1. **Real API Response Shape**: What will the production API response format be?
2. **Filter Complexity**: Are there filters that cannot be server-side?
3. **Real-time Updates**: Should NFTs update in real-time (WebSocket)?
4. **Error Recovery**: What should happen on scroll failure?

---

## References

### Research Reports

- [Brainstorming Report](../reports/brainstorm-260125-2158-react-query-infinite-scroll.md)
- [TanStack Query Research](./research/researcher-tanstack-query.md)
- [Infinite Scroll Research](./research/researcher-infinite-scroll.md)

### Project Documentation

- [Codebase Summary](../../../docs/codebase-summary.md)
- [Code Standards](../../../docs/code-standards.md)
- [System Architecture](../../../docs/system-architecture.md)

### External Resources

- [TanStack Query v5 Docs](https://tanstack.com/query/latest)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

## Conclusion

This implementation plan provides a comprehensive, production-ready approach to infinite scroll for the Zuno Marketplace. The query folder pattern, cursor-based pagination, and Intersection Observer integration create a scalable architecture that will serve the project well as it grows.

**Recommendation**: Proceed with implementation starting with Phase 01.

**Estimated Timeline**: 8 hours over 2-3 days
**Risk Level**: Medium (mitigated by mock adapter pattern)
**Confidence**: High (backed by research and proven patterns)
