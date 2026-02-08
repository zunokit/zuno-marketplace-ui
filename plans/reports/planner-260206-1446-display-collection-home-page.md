# Implementation Plan: Display Collections on Home Page

**Status:** Ready for Implementation
**Date:** 2026-02-06
**Branch:** feat/display-collection-home-page
**Worktree:** E:\worktrees\zuno-marketplace-ui-display-collection-home-page

---

## Summary

Replace mock data in home page collection carousel with real backend GraphQL data using `GetCollections` query.

---

## Plan Location

```
E:\zuno-marketplace-ui\plans\260206-1446-display-collection-home-page\
├── plan.md                              # Overview & quick reference
├── phase-01-setup.md                    # Environment verification
├── phase-02-implementation.md           # GraphQL query & mapping
├── phase-03-loading-error-empty-states.md  # UI states
└── phase-04-cleanup.md                  # Verification & testing
```

---

## Key Files

### Modify
- `src/modules/product-discovery/collection-carousel/components/collection-carousel.tsx`

### Reference (read-only)
- `src/shared/graphql/hooks.generated.ts` - `useGetCollectionsQuery` (line 1969)
- `src/shared/graphql/schema.generated.ts` - `GetCollectionsQuery` type (line 905)
- `src/shared/graphql/schemas/collection.graphql` - Query definition (line 292)
- `src/shared/types/collection.ts` - UI Collection type (line 21)

---

## Type Mapping Summary

| GraphQL Field | UI Field | Transformation |
|---------------|----------|----------------|
| `slug` (string\|null) | `slug` (string) | `?? ""` |
| `status` (CollectionStatus) | `status` ("live"\|...) | DEPLOYED→live, PENDING→upcoming |
| `mintStartTime` | `mintStartDate` | Rename |
| `allowlistStageEnd` | `mintEndDate` | Rename |
| `mintPricePublic` | `mintPrice` | Rename |
| `imageUrl` (string\|null) | `imageUrl` (string\|undefined) | null→undefined |

---

## GraphQL Query Parameters

```typescript
useGetCollectionsQuery({
  variables: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  }
})
```

---

## Implementation Phases

| Phase | Status | Effort | Focus |
|-------|--------|--------|-------|
| 01 - Setup | pending | 30m | Verify hooks, document type mapping |
| 02 - Implementation | pending | 1h | GraphQL query, mapper function |
| 03 - UI States | pending | 45m | Loading/error/empty states |
| 04 - Cleanup | pending | 45m | Type check, lint, build verification |

**Total Effort:** ~3 hours

---

## Success Criteria

- [ ] Carousel displays real collections from backend
- [ ] Sorted by newest (createdAt desc, limit: 10)
- [ ] Loading skeleton while fetching
- [ ] Error state with retry button
- [ ] Empty state when no collections
- [ ] No mock data imports
- [ ] TypeScript compiles
- [ ] Build succeeds

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| GraphQL fields don't match UI type | Mapper function with fallbacks (`?? ""`, `?? undefined`) |
| Status enum mismatch | Map DEPLOYED→"live", PENDING→"upcoming" |
| Null values | Default values for required fields |

---

## Unresolved Questions

None identified during planning.

---

## Next Steps

1. Switch to worktree: `git worktree add E:\worktrees\zuno-marketplace-ui-display-collection-home-page feat/display-collection-home-page`
2. Follow phases in order: 01 → 02 → 03 → 04
3. Run verification: `pnpm typecheck && pnpm lint && pnpm build`
