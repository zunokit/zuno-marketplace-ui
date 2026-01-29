---
title: "Phase 01: Setup Query Folder Structure"
description: "Create query folder architecture, install dependencies, and setup base structure"
status: pending
priority: P1
effort: 1h
branch: feature/marketplace
tags: [setup, structure, dependencies]
created: 2026-01-25
---

# Phase 01: Setup Query Folder Structure

## Context Links

- **Parent Plan**: [../plan.md](../plan.md)
- **Brainstorming Report**: [../reports/brainstorm-260125-2158-react-query-infinite-scroll.md](../../reports/brainstorm-260125-2158-react-query-infinite-scroll.md)
- **Code Standards**: [../../../docs/code-standards.md](../../../docs/code-standards.md)

## Overview

**Date**: 2026-01-25
**Priority**: P1 (Critical - blocks all other phases)
**Status**: pending

Create the query folder structure following project conventions and ensure all required dependencies are installed.

## Key Insights

1. **Query Folder Pattern**: Centralized query definitions improve testability and reusability
2. **Mock Adapter**: Swappable fetcher enables development before backend is ready
3. **Kebab-case Required**: Project standards mandate kebab-case file naming
4. **Type Safety**: Strict TypeScript mode requires proper type exports

## Requirements

### Functional Requirements

- Create `src/modules/marketplace/queries/` directory
- Create query files with proper exports
- Install TanStack Query v5 if not present
- Install `react-intersection-observer` for scroll detection

### Non-Functional Requirements

- Follow kebab-case naming convention
- Export barrel file (`index.ts`) for clean imports
- Type-safe throughout (no `any` types)
- File structure matches project architecture

## Architecture

### Directory Structure

```
src/modules/marketplace/
├── queries/
│   ├── infinite-marketplace-items.query.ts  # Query options definition
│   ├── use-infinite-marketplace-items.ts    # Hook wrapper
│   ├── types.ts                             # Query-specific types
│   ├── mock-adapter.ts                      # Mock fetcher (dev only)
│   └── index.ts                             # Barrel export
├── components/
│   └── NFTGrid.tsx                          # Existing (will update later)
└── hooks/
    └── useMyItems.ts                        # Existing (will update later)
```

### Import Path Pattern

```typescript
// Clean imports from barrel file
import { useInfiniteMarketplaceItems } from "@/modules/marketplace/queries";

// Direct imports also available
import { infiniteMarketplaceItemsOptions } from "@/modules/marketplace/queries/infinite-marketplace-items.query";
```

## Related Code Files

### Files to Create

- `src/modules/marketplace/queries/index.ts` - Barrel export
- `src/modules/marketplace/queries/types.ts` - Type definitions
- `src/modules/marketplace/queries/mock-adapter.ts` - Mock fetcher

### Files to Check

- `package.json` - Verify TanStack Query v5 installed
- `tsconfig.json` - Ensure strict mode enabled

## Implementation Steps

### Step 1: Verify Dependencies

```bash
# Check if @tanstack/react-query is installed
pnpm list @tanstack/react-query

# If not installed or version < 5
pnpm add @tanstack/react-query@^5.0.0

# Install intersection observer library
pnpm add react-intersection-observer
```

**Expected Versions**:

- `@tanstack/react-query`: ^5.0.0
- `react-intersection-observer`: ^10.0.0

### Step 2: Create Query Directory

```bash
mkdir -p src/modules/marketplace/queries
```

### Step 3: Create Types File

Create `src/modules/marketplace/queries/types.ts`:

```typescript
/**
 * Marketplace infinite query types
 * Follows project TypeScript strict mode standards
 */

import { type Nft } from "@/modules/marketplace/types";

/**
 * API Response shape for paginated marketplace items
 * Matches cursor pagination pattern
 */
export interface MarketplaceItemsPage {
  items: Nft[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Query parameters sent to API
 * Includes pagination and filters
 */
export interface MarketplaceItemsQueryParams {
  contractAddress: string;
  cursor: string | null;
  limit: number;
  priceRange?: [number, number];
  status?: string;
  sortBy?: string;
  search?: string;
  selectedTraits?: string[];
}

/**
 * Options for infinite marketplace items query
 */
export interface InfiniteMarketplaceItemsOptions {
  contractAddress: string;
  filters: MarketplaceFilters;
  enabled?: boolean;
}

/**
 * Filter state from parent component
 * Must match FilterSidebar interface
 */
export interface MarketplaceFilters {
  priceRange: [number, number];
  status: string;
  sortBy: string;
  selectedTraits: string[];
  search?: string;
}
```

### Step 4: Create Mock Adapter

Create `src/modules/marketplace/queries/mock-adapter.ts`:

```typescript
/**
 * Mock fetcher for development before backend is ready
 * Simulates cursor-based pagination with consistent data
 */

import type { MarketplaceItemsPage, MarketplaceItemsQueryParams } from "./types";
import { NftStatus } from "@/modules/marketplace/types";

// Track mock data state in memory
const MOCK_STATE = new Map<string, { items: any[]; nextId: number }>();

/**
 * Generate consistent mock NFTs
 */
function generateMockNFTs(count: number, contractAddress: string, startId: number): any[] {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    return {
      id: `nft-${id}`,
      tokenId: `${id}`,
      name: `NFT #${id}`,
      description: `Mock NFT ${id}`,
      image: `https://picsum.photos/400/400?random=${id}`,
      contractAddress,
      chainId: "1",
      owner: "0x1234567890123456789012345678901234567890",
      creator: "0x0987654321098765432109876543210987654321",
      status: id % 3 === 0 ? NftStatus.Listed : NftStatus.NotListed,
      mintPrice: (0.01 + Math.random() * 0.09).toFixed(3),
      listPrice: id % 3 === 0 ? (0.02 + Math.random() * 0.08).toFixed(3) : undefined,
      attributes: [
        { trait_type: "Background", value: ["Path", "Orchard", "Library"][id % 3] },
        { trait_type: "Body", value: ["Blue", "Red", "Yellow"][id % 3] },
        { trait_type: "Rarity", value: ["Common", "Rare", "Epic"][id % 3] },
      ],
      createdAt: new Date(Date.now() - id * 1000 * 60).toISOString(),
      updatedAt: new Date(Date.now() - id * 1000 * 30).toISOString(),
    };
  });
}

/**
 * Mock fetcher function
 * Simulates API call with cursor pagination
 */
export async function mockFetchMarketplaceItems({
  queryKey,
}: {
  queryKey: readonly ["marketplace", "infinite", string, MarketplaceItemsQueryParams];
}): Promise<MarketplaceItemsPage> {
  const [, , contractAddress, params] = queryKey;
  const { cursor, limit = 16 } = params;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Initialize or get state
  if (!MOCK_STATE.has(contractAddress)) {
    MOCK_STATE.set(contractAddress, {
      items: generateMockNFTs(100, contractAddress, 1),
      nextId: 101,
    });
  }

  const state = MOCK_STATE.get(contractAddress)!;

  // Parse cursor to get start index
  const startIndex = cursor ? parseInt(Buffer.from(cursor, "base64").toString(), 10) : 0;

  // Get page of items
  const items = state.items.slice(startIndex, startIndex + limit);
  const nextIndex = startIndex + items.length;

  // Create next cursor
  const nextCursor =
    nextIndex < state.items.length ? Buffer.from(nextIndex.toString()).toString("base64") : null;

  return {
    items,
    nextCursor,
    hasMore: nextIndex < state.items.length,
  };
}

/**
 * Flag to enable/disable mock mode
 * Set to false when real API is ready
 */
export const USE_MOCK_ADAPTER = true;
```

### Step 5: Create Barrel Export

Create `src/modules/marketplace/queries/index.ts`:

```typescript
/**
 * Marketplace queries barrel export
 * Provides clean import path for all query exports
 */

// Query options
export { infiniteMarketplaceItemsOptions } from "./infinite-marketplace-items.query";

// Hooks
export { useInfiniteMarketplaceItems } from "./use-infinite-marketplace-items";

// Types
export type {
  MarketplaceItemsPage,
  MarketplaceItemsQueryParams,
  InfiniteMarketplaceItemsOptions,
  MarketplaceFilters,
} from "./types";

// Mock adapter (dev only)
export { mockFetchMarketplaceItems, USE_MOCK_ADAPTER } from "./mock-adapter";
```

### Step 6: Verify TypeScript Compilation

```bash
# Run TypeScript compiler to check for errors
pnpm tsc --noEmit
```

## Todo List

- [ ] Verify `@tanstack/react-query` v5 is installed
- [ ] Install `react-intersection-observer` if needed
- [ ] Create `src/modules/marketplace/queries/` directory
- [ ] Create `types.ts` with all interface definitions
- [ ] Create `mock-adapter.ts` with fetcher function
- [ ] Create `index.ts` barrel export file
- [ ] Run TypeScript compiler to verify no errors
- [ ] Verify project builds successfully

## Success Criteria

- [ ] Query folder exists at `src/modules/marketplace/queries/`
- [ ] All type definitions are strict TypeScript (no `any`)
- [ ] Mock adapter generates consistent NFT data
- [ ] Barrel export provides clean import path
- [ ] TypeScript compiler reports zero errors
- [ ] Project builds without issues

## Risk Assessment

| Risk                         | Probability | Impact | Mitigation                         |
| ---------------------------- | ----------- | ------ | ---------------------------------- |
| TanStack Query not installed | Low         | High   | Check package.json before starting |
| TypeScript type errors       | Medium      | Medium | Use strict mode compiler           |
| Circular dependencies        | Low         | Low    | Barrel export prevents this        |

## Security Considerations

- Mock adapter should be removed or disabled in production
- No sensitive data in mock NFT generation
- Validate cursor decoding (base64) in real implementation

## Next Steps

Once this phase is complete:

1. Move to **Phase 02: Query Options** to implement `infiniteMarketplaceItemsOptions`
2. Query folder structure is ready for query options pattern
3. Mock adapter provides development data backend

## Notes

- Keep `USE_MOCK_ADAPTER` flag for easy toggle
- Mock state uses Map to support multiple contracts
- Cursor encoding: base64 of start index (simple for mock)
