---
title: "Phase 2: GraphQL Integration - Fetch Real Collection Data"
description: "Replace mock collection fetching with real GraphQL queries from zuno-api"
phase: 2
status: completed
priority: High
dependencies: []
---

# Phase 2: GraphQL Integration - Fetch Real Collection Data

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 1: SDK Setup](./phase-01-sdk-setup.md)
- Next Phase: [Phase 3: Metadata Parsing](./phase-03-metadata-parsing.md)
- GraphQL Hooks: `src/shared/graphql/hooks.generated.ts`
- Collection Types: `src/shared/types/collection.ts`
- Current Mock: `src/shared/utils/collection.ts`

## Overview

| Field | Value |
|-------|-------|
| **Priority** | High |
| **Status** | Completed |
| **Description** | Replace mock collection fetching with real GraphQL queries |
| **Estimated Effort** | 4-5 hours |

## Key Insights

- `useGetCollectionQuery` already generated in hooks.generated.ts
- Query supports fetching by `slug`, `id`, or `contractAddress`
- Collection type has `metadata` field with social links
- Need to update `fetchCollectionBySlug` to use Apollo client server-side
- Current implementation uses `collectionFaker` for all data

## Requirements

### Functional Requirements
- Update server-side `fetchCollectionBySlug` to use real GraphQL
- Pass real collection data to MintNFT component
- Handle loading and error states
- Support metadata fields for social links
- Display real collection images, name, description

### Non-Functional Requirements
- Maintain TypeScript strict mode
- Use server components where possible
- Implement proper loading skeletons
- Handle 404 for invalid slugs

## Architecture

```
Server Component (page.tsx)
├── fetchCollectionBySlug(slug) → GraphQL Query
│   └── Returns: Collection with metadata, stats
└── Pass to <MintNFT collection={data} />

Client Component (mint-nft.tsx)
├── Receive collection prop
└── Use instead of faker data
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/shared/utils/collection.ts` | Replace mock with real GraphQL fetch |
| `src/app/(marketplace)/launchpad/[slug]/page.tsx` | Pass data to component |
| `src/modules/launch-pad/mint-nft/components/mint-nft.tsx` | Use real data prop |
| `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts` | Initialize with real data |
| `src/modules/launch-pad/mint-nft/components/mint-form.tsx` | Use real pricing |
| `src/modules/launch-pad/mint-nft/components/collection-gallery.tsx` | Use real images |

## Implementation Steps

1. **Update fetchCollectionBySlug utility**
   - Replace mock implementation with Apollo client query
   - Use `GetCollectionQuery` with slug variable
   - Handle errors and not found cases

2. **Modify launchpad page.tsx**
   - Fetch collection server-side
   - Pass collection data to MintNFT component
   - Handle 404 for invalid slugs

3. **Update MintNFT component**
   - Accept collection as prop
   - Remove faker usage
   - Pass collection to child components

4. **Update useMintState hook**
   - Accept collection in initialization
   - Use real mint price from collection
   - Calculate max supply from collection data

5. **Update mint-form.tsx**
   - Use real mint price from collection
   - Display real max supply

6. **Update collection-gallery.tsx**
   - Use real collection images
   - Remove faker usage

## Todo List

- [x] Update `fetchCollectionBySlug` with real GraphQL query
- [x] Modify `page.tsx` to fetch and pass collection
- [x] Update `MintNFT` component props interface
- [x] Update `useMintState` to use real collection
- [x] Update `mint-form.tsx` with real pricing
- [x] Update `collection-gallery.tsx` with real images
- [x] Add loading skeleton while fetching
- [x] Handle error states (404, network errors)
- [x] Remove all faker imports from launchpad module

## Success Criteria

- [x] Collection data loads from GraphQL API
- [x] All collection fields display correctly (name, image, description)
- [x] Loading state shows skeleton
- [x] 404 page shown for invalid slugs
- [x] No faker data in production
- [x] Social links display from metadata

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| API dependency failures | High | Medium | Implement error boundaries and fallback UI |
| GraphQL schema mismatch | Medium | Low | Regenerate hooks if schema changes |
| Slow API responses | Medium | Medium | Add loading states, consider caching |

## Security Considerations

- Validate slug input (already done in page.tsx)
- Sanitize GraphQL responses before rendering
- Handle malformed API responses gracefully

## Code Snippets

### Updated fetchCollectionBySlug
```typescript
// src/shared/utils/collection.ts
import { getClient } from "@/shared/lib/apollo-client";
import { GetCollectionDocument, GetCollectionQuery } from "@/shared/graphql/hooks.generated";

export async function fetchCollectionBySlug(slug: string) {
  const client = getClient();

  try {
    const { data } = await client.query<GetCollectionQuery>({
      query: GetCollectionDocument,
      variables: { slug },
    });

    if (!data.collection) {
      return null;
    }

    return data.collection;
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return null;
  }
}
```

### Updated Page Component
```typescript
// src/app/(marketplace)/launchpad/[slug]/page.tsx
import { fetchCollectionBySlug } from "@/shared/utils/collection";
import { MintNFT } from "@/modules/launch-pad/mint-nft/components/mint-nft";

interface LaunchpadPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LaunchpadPage({ params }: LaunchpadPageProps) {
  const { slug } = await params;
  const collection = await fetchCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return <MintNFT collection={collection} />;
}
```

### Updated MintNFT Component
```typescript
// src/modules/launch-pad/mint-nft/components/mint-nft.tsx
"use client";

import { GetCollectionQuery } from "@/shared/graphql/hooks.generated";

interface MintNFTProps {
  collection: GetCollectionQuery["collection"];
}

export function MintNFT({ collection }: MintNFTProps) {
  // Use collection data instead of faker
  const { name, description, imageUrl, metadata } = collection;

  return (
    // ... render with real data
  );
}
```

## Next Steps

After completing this phase:
1. Proceed to [Phase 3: Metadata Parsing](./phase-03-metadata-parsing.md)
2. Collection data will be flowing from API
3. Ready to parse rich metadata for accordions

## Unresolved Questions

1. Does the GraphQL schema include all fields we need (stats, metadata)?
2. Should we use React Suspense for data fetching?
3. How should we handle partial API failures?
