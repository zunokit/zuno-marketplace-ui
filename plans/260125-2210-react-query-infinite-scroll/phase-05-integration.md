---
title: "Phase 05: Integration with NFTGrid and Marketplace"
description: "Integrate infinite scroll hook and trigger component into existing components"
status: pending
priority: P1
effort: 2h
branch: feature/marketplace
tags: [integration, nft-grid, marketplace, refactoring]
created: 2026-01-25
---

# Phase 05: Integration with NFTGrid and Marketplace

## Context Links

- **Parent Plan**: [../plan.md](../plan.md)
- **Phase 04**: [./phase-04-scroll-trigger.md](./phase-04-scroll-trigger.md) (must complete first)
- **Existing Code**: [../../../src/modules/marketplace/index.tsx](../../../src/modules/marketplace/index.tsx)

## Overview

**Date**: 2026-01-25
**Priority**: P1 (Critical)
**Status**: pending

Replace the mock `useMyItems` hook with the new infinite query architecture, integrating the hook and scroll trigger into NFTGrid and the parent marketplace component.

## Key Insights

1. **State Lifting**: Move filter state to parent component for query key inclusion
2. **Client-Side Filtering**: Replace with server-side filtering via query params
3. **Gradual Migration**: Keep existing NFTGrid props for backward compatibility
4. **Loading States**: Integrate isFetchingNextPage for seamless UX

## Requirements

### Functional Requirements

- Replace `useMyItems` with `useInfiniteMarketplaceItems`
- Move filter state to parent component (index.tsx)
- Pass infinite query props to NFTGrid
- Add InfiniteScrollTrigger at bottom of grid
- Handle loading and error states

### Non-Functional Requirements

- Maintain backward compatibility where possible
- Preserve existing UI/UX
- No breaking changes to component APIs
- Follow existing code patterns

## Architecture

### Before (Current Implementation)

```
ShopNFTs (index.tsx)
  │
  ├─ useMyItems() → returns { nfts, isLoading }
  │   └─ Mock data generation (no pagination)
  │
  ├─ Client-side filtering/sorting
  │
  └─ NFTGrid
      └─ Static array of NFTs
```

### After (New Implementation)

```
ShopNFTs (index.tsx)
  │
  ├─ Filter State (priceRange, status, sortBy, etc.)
  │
  ├─ useInfiniteMarketplaceItems(contractAddress, filters)
  │   ├─ useInfiniteQuery(queryOptions)
  │   └─ Returns: { items, fetchNextPage, hasNextPage, isFetchingNextPage }
  │
  └─ NFTGrid
      ├─ items (flattened array)
      ├─ InfiniteScrollTrigger
      │   ├─ Intersection Observer
      │   └─ Auto-calls fetchNextPage()
      │
      └─ Loading/Error UI
```

## Related Code Files

### Files to Modify

- `src/modules/marketplace/components/NFTGrid.tsx` - Add infinite scroll support
- `src/modules/marketplace/hooks/useMyItems.ts` - Mark as deprecated (or remove)
- `src/modules/marketplace/index.tsx` - Replace useMyItems with new hook

### Files to Reference

- `src/modules/marketplace/queries/use-infinite-marketplace-items.ts` - New hook
- `src/modules/marketplace/components/InfiniteScrollTrigger.tsx` - Scroll trigger

## Implementation Steps

### Step 1: Update NFTGrid Component

Update `src/modules/marketplace/components/NFTGrid.tsx`:

```typescript
"use client";

import { Package } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import { type Nft } from "@/modules/marketplace/types";
import NFTCardSeller from "@/modules/marketplace/components/NFTCardSeller";
import { InfiniteScrollTrigger } from "@/modules/marketplace/components/InfiniteScrollTrigger";
import type { InfiniteScrollTriggerProps } from "@/modules/marketplace/components/InfiniteScrollTrigger";

interface NFTGridProps {
  type: "buyer" | "seller";
  nfts: Nft[];
  view: "grid" | "compact";
  showFilters: boolean;
  isSliding: boolean;
  onSelect: (id: string) => void;
  onCardClick?: (nft: Nft) => void;
  selectedNFTs: string[];

  // NEW: Infinite scroll props
  infiniteScrollProps?: {
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isError?: boolean;
  };
}

export default function NFTGrid({
  type,
  nfts,
  view,
  showFilters,
  isSliding,
  onSelect,
  onCardClick,
  selectedNFTs,
  infiniteScrollProps,
}: NFTGridProps) {
  if (!nfts || nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Package className="h-8 w-8 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-sm font-medium text-foreground">No items to show</p>
        <p className="text-xs text-os-gray-300 mt-1">Adjust filters or check back later.</p>
      </div>
    );
  }

  const commonProps = {
    view: view,
    isSliding: isSliding,
    onClick: onCardClick,
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "grid gap-3 transition-all duration-300 ease-in-out p-3",
          view === "compact"
            ? showFilters
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
            : showFilters
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        )}
      >
        {nfts.map(nft =>
          type === "buyer" ? (
            <NFTCardSeller
              key={nft.id}
              {...commonProps}
              nft={nft}
              onSelect={() => onSelect(nft.id)}
              isSelected={selectedNFTs.includes(nft.id)}
            />
          ) : (
            <NFTCardSeller
              key={nft.id}
              {...commonProps}
              nft={nft}
              onSelect={() => onSelect(nft.id)}
              isSelected={selectedNFTs.includes(nft.id)}
            />
          )
        )}
      </div>

      {/* Loading indicator for next page */}
      {infiniteScrollProps?.isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error message */}
      {infiniteScrollProps?.isError && (
        <div className="text-center py-4">
          <p className="text-sm text-red-500">Failed to load more items. Please try again.</p>
        </div>
      )}

      {/* End of list message */}
      {!infiniteScrollProps?.hasNextPage && nfts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">You've reached the end</p>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {infiniteScrollProps && (
        <InfiniteScrollTrigger
          hasNextPage={infiniteScrollProps.hasNextPage}
          isFetchingNextPage={infiniteScrollProps.isFetchingNextPage}
          fetchNextPage={infiniteScrollProps.fetchNextPage}
          isError={infiniteScrollProps.isError}
        />
      )}
    </div>
  );
}
```

### Step 2: Update Parent Component (index.tsx)

Update `src/modules/marketplace/index.tsx` (partial changes shown):

```typescript
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/shared/utils/tailwind-utils";
import ControlBar from "@/modules/marketplace/components/ControlBar";
import NFTListView from "@/modules/marketplace/components/NFTListView";
import NFTGrid from "@/modules/marketplace/components/NFTGrid";
import FilterSidebar from "@/modules/marketplace/components/FilterSidebar";
import SellerModal from "@/modules/marketplace/components/SellerModal";
// NEW: Import infinite query hook
import { useInfiniteMarketplaceItems, type MarketplaceFilters } from "@/modules/marketplace/queries";
import { useNFTSelection } from "@/modules/marketplace/hooks/useNFTSelection";
// DEPRECATED: useMyItems - will be removed
// import { useMyItems } from "@/modules/marketplace/hooks/useMyItems";
import HeroHeader from "@/modules/marketplace/components/HeroHeader";
import CollectionNav from "@/modules/marketplace/components/CollectionNav";
import BottomActionBar from "@/modules/marketplace/components/BottomActionBar";
import type { Collection } from "@/shared/utils/mock/collection";
import type { Nft } from "@/modules/marketplace/types";
import { debounce } from "lodash";

// ... existing interfaces and ErrorBoundary ...

interface ShopNFTsProps {
  contractAddress: string;
  initialCollection: Collection;
}

export default function ShopNFTs({ contractAddress, initialCollection }: ShopNFTsProps) {
  const [collection] = useState(initialCollection);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("items");
  const [view, setView] = useState<"grid" | "list" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // NEW: Filter state for infinite query
  const [priceRange, setPriceRange] = useState<[number, number]>([0.001, 0.1]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: Create filters object for query
  const filters: MarketplaceFilters = useMemo(
    () => ({
      priceRange,
      status: statusFilter,
      sortBy,
      selectedTraits,
      search: searchQuery,
    }),
    [priceRange, statusFilter, sortBy, selectedTraits, searchQuery]
  );

  const [selectedNFT, setSelectedNFT] = useState<Nft | null>(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

  const isConnected = true;
  const address = "0x1234567890123456789012345678901234567890";

  // NEW: Use infinite query hook instead of useMyItems
  const {
    items: nfts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteMarketplaceItems(contractAddress, filters, {
    enabled: isConnected && !!address,
  });

  // REMOVED: Client-side filtering/sorting (now server-side via query params)
  // const safeNFTs = useMemo(...)
  // const filterAndSortNFTs = useCallback(...)
  // const [filteredAndSortedNFTs, setFilteredAndSortedNFTs] = useState(...)

  // ... rest of component stays similar ...

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    const [min, max] = range;
    const validPriceRange: [number, number] = [
      isNaN(min) ? 0 : min,
      isNaN(max) ? Infinity : Math.max(min, max),
    ];
    setPriceRange(validPriceRange);
  }, []);

  // ... rest of handlers stay similar ...

  // Update useEffect for cart update to use nfts instead of filteredAndSortedNFTs
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("cartUpdate", {
        detail: { itemCount: selectedNFTs.length },
      })
    );
  }, [selectedNFTs]);

  // ... rest of component ...

  if (!collection) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Collection Found</h3>
          <p className="text-os-gray-300">Collection not available</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "items":
        return (
          <div className="flex transition-all duration-300 ease-in-out h-full">
            {/* Desktop Filter Sidebar - same as before */}
            <div
              className={cn(
                "hidden md:block w-0 h-full shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
                showFilters && "w-[240px] 3xl:w-[390px]"
              )}
            >
              {showFilters && (
                <FilterSidebar
                  onClose={() => setShowFilters(false)}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onStatusChange={setStatusFilter}
                  onSortChange={setSortBy}
                  selectedTraits={selectedTraits}
                  onTraitsChange={setSelectedTraits}
                  isOpen={true}
                />
              )}
            </div>

            {/* Mobile Filter Sheet - same as before */}
            {showFilters && (
              <div className="md:hidden">
                <FilterSidebar
                  onClose={() => setShowFilters(false)}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onStatusChange={setStatusFilter}
                  onSortChange={setSortBy}
                  selectedTraits={selectedTraits}
                  onTraitsChange={setSelectedTraits}
                  isOpen={showFilters}
                />
              </div>
            )}

            <div className="flex-1 min-h-0 transition-all duration-300 ease-in-out min-w-0 flex flex-col h-full overflow-hidden">
              <ControlBar
                view={view}
                setView={setView}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                searchValue={searchQuery}
                onSearch={(value) => setSearchQuery(value)}
                sortValue={sortBy}
                onSort={setSortBy}
                totalItems={nfts.length} // Now uses total loaded items
              />

              <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-hiderelative">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : isError ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Error Loading Items</h3>
                      <p className="text-os-gray-300">Please try refreshing the page.</p>
                    </div>
                  </div>
                ) : view === "list" ? (
                  // NOTE: List view not yet updated for infinite scroll
                  // Keeping existing implementation for now
                  <ErrorBoundary>
                    <NFTListView
                      type="seller"
                      nfts={nfts} // Now uses infinite query items
                      sorting={sorting}
                      setSorting={setSorting}
                      columnFilters={columnFilters}
                      setColumnFilters={setColumnFilters}
                      onSelect={handleNFTSelection}
                      onCardClick={handleNFTCardClick}
                      selectedNFTs={selectedNFTs}
                    />
                  </ErrorBoundary>
                ) : (
                  <NFTGrid
                    type="seller"
                    nfts={nfts} // Now uses infinite query items
                    view={view === "compact" ? "compact" : "grid"}
                    showFilters={showFilters}
                    isSliding={isSliding}
                    onSelect={handleNFTSelection}
                    onCardClick={handleNFTCardClick}
                    selectedNFTs={selectedNFTs}
                    // NEW: Pass infinite scroll props
                    infiniteScrollProps={{
                      hasNextPage,
                      isFetchingNextPage,
                      fetchNextPage,
                      isError,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );

      // ... other tabs stay the same ...
      default:
        return null;
    }
  };

  // ... rest of component unchanged ...
}
```

### Step 3: Verify Imports

Check that all imports are correct:

```typescript
import { useInfiniteMarketplaceItems, type MarketplaceFilters } from "@/modules/marketplace/queries";
import { InfiniteScrollTrigger } from "@/modules/marketplace/components/InfiniteScrollTrigger";
```

### Step 4: Update useNFTSelection Hook (if needed)

Ensure `useNFTSelection` works with infinite query items:

```typescript
// Update the hook to accept items from infinite query
const {
  sliderValue,
  isSliding,
  handleSliderChange,
  handleItemCountChange,
  handleIndividualSelection,
} = useNFTSelection({
  initialNFTs: nfts, // Now from infinite query
  onVisibleNFTsChange: () => {}, // Not needed with infinite query
  onSelectedNFTsChange,
});
```

### Step 5: Remove Client-Side Filtering

Remove or comment out client-side filtering logic:

```typescript
// REMOVED: No longer needed with server-side filtering
// const filterAndSortNFTs = useCallback(...)
// useEffect(() => { const filtered = filterAndSortNFTs(safeNFTs); ... })
```

### Step 6: Test Build

```bash
pnpm build
```

## Todo List

- [ ] Add `InfiniteScrollTrigger` import to NFTGrid
- [ ] Add `infiniteScrollProps` to NFTGridProps interface
- [ ] Add loading indicator in NFTGrid
- [ ] Add error message in NFTGrid
- [ ] Add end-of-list message in NFTGrid
- [ ] Add InfiniteScrollTrigger component at bottom
- [ ] Import `useInfiniteMarketplaceItems` in index.tsx
- [ ] Replace `useMyItems` with `useInfiniteMarketplaceItems`
- [ ] Create `filters` object for query params
- [ ] Remove client-side filtering/sorting logic
- [ ] Update `totalItems` to use infinite query items
- [ ] Pass `infiniteScrollProps` to NFTGrid
- [ ] Verify all imports are correct
- [ ] Run TypeScript compiler
- [ ] Test build successfully

## Success Criteria

- [ ] `useInfiniteMarketplaceItems` replaces `useMyItems`
- [ ] Filters in query key trigger cache invalidation
- [ ] InfiniteScrollTrigger placed at bottom of grid
- [ ] Loading indicator shows during `isFetchingNextPage`
- [ ] Error message displays on error
- [ ] End-of-list message when `!hasNextPage`
- [ ] Client-side filtering removed
- [ ] TypeScript compiler reports zero errors
- [ ] Project builds successfully
- [ ] Existing UI/UX preserved

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing functionality | Medium | High | Keep backward compatibility |
| Filter state sync issues | Medium | Medium | Filters in queryKey handle this |
| List view not updated | Low | Low | Keep existing implementation |
| Performance regression | Low | Medium | Test with 100+ items |

## Security Considerations

- No new security issues introduced
- Filters validated by query options
- Error messages don't expose sensitive data

## Next Steps

After completing this phase:
1. Move to **Phase 06: Testing** to verify implementation
2. Test infinite scroll behavior
3. Verify filter changes reset query
4. Check for memory leaks

## Notes

- List view not yet updated (can be Phase 08)
- Keep `useMyItems` for now, mark as deprecated
- Client-side filtering removed (now server-side)
- Total items now shows loaded items count, not total count

## Migration Checklist

- [ ] Backup current implementation
- [ ] Create feature branch
- [ ] Update NFTGrid component
- [ ] Update parent component
- [ ] Remove client-side filtering
- [ ] Test locally
- [ ] Run TypeScript compiler
- [ ] Test build
- [ ] Create PR for review

## Unresolved Questions

1. Should we show "Loading X more items" in ARIA live region?
2. Should `totalItems` in ControlBar show loaded or total count?
3. Should we add a "Load More" button as fallback?
