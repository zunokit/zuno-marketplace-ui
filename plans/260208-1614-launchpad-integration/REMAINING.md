# Remaining Work for Comprehensive Implementation

## Completed

- [x] Brainstorm analysis of all three codebases
- [x] Hybrid approach decision (GraphQL + SDK)
- [x] Frontend implementation plan (5 phases)
- [x] Backend API plan for settings_json field
- [x] Validation and decisions recorded

---

## Frontend Implementation (zuno-marketplace-ui)

### Phase 1: SDK Setup & Provider Configuration
**Status:** Pending | **Effort:** 2-3h

Files to create/modify:
- `src/shared/config/zuno-sdk-config.ts` (NEW)
- `src/shared/providers/zuno-sdk-provider.tsx` (NEW)
- `src/app/app-wrapper.tsx` (MODIFY)
- `.env.example` (MODIFY)

Key tasks:
- Install/configure zuno-marketplace-sdk v2.1.2
- Create ZunoProvider wrapper
- Add environment variables
- Test SDK initialization

### Phase 2: GraphQL Integration
**Status:** Pending | **Effort:** 4-5h

Files to modify:
- `src/shared/utils/collection.ts`
- `src/app/(marketplace)/launchpad/[slug]/page.tsx`
- `src/modules/launch-pad/mint-nft/components/mint-nft.tsx`
- `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts`
- `src/modules/launch-pad/mint-nft/components/mint-form.tsx`
- `src/modules/launch-pad/mint-nft/components/collection-gallery.tsx`

Key tasks:
- Replace mock fetchCollectionBySlug with GraphQL
- Pass real collection data to components
- Remove all faker usage
- Add loading/error states

### Phase 3: Metadata Parsing
**Status:** Pending | **Effort:** 3-4h
**Dependency:** Backend API must add settings_json field

Files to create/modify:
- `src/modules/launch-pad/mint-nft/types/metadata.types.ts` (NEW)
- `src/modules/launch-pad/mint-nft/utils/parse-collection-metadata.ts` (NEW)
- `src/modules/launch-pad/mint-nft/components/collection-info-section.tsx` (MODIFY)
- `src/modules/launch-pad/mint-nft/components/collection-overview-accordion.tsx` (MODIFY)
- `src/modules/launch-pad/mint-nft/components/collection-utility-accordion.tsx` (MODIFY)

Key tasks:
- Create Zod schema for metadata validation
- Parse settings_json from API
- Populate accordions with parsed data
- Handle fallback when metadata missing

### Phase 4: SDK Mint Integration
**Status:** Pending | **Effort:** 5-6h

Files to create/modify:
- `src/modules/launch-pad/mint-nft/hooks/use-sdk-mint.ts` (NEW)
- `src/modules/launch-pad/mint-nft/utils/calculate-mint-price.ts` (NEW)
- `src/modules/launch-pad/mint-nft/utils/handle-sdk-error.ts` (NEW)
- `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts` (MODIFY)
- `src/modules/launch-pad/mint-nft/components/mint-form.tsx` (MODIFY)
- `src/modules/launch-pad/mint-nft/components/mint-confirm-dialog.tsx` (MODIFY)

Key tasks:
- Create useSdkMint hook
- Implement batchMintERC721/ERC1155
- Calculate mint price from collection data
- Handle transaction states
- **Skip allowlist for MVP**

### Phase 5: Error Handling & Edge Cases
**Status:** Pending | **Effort:** 3-4h

Files to create/modify:
- `src/modules/launch-pad/mint-nft/utils/error-messages.ts` (NEW)
- `src/modules/launch-pad/mint-nft/components/mint-error-boundary.tsx` (NEW)
- `src/modules/launch-pad/mint-nft/utils/handle-sdk-error.ts` (ENHANCE)
- `src/app/(marketplace)/launchpad/[slug]/page.tsx` (ADD ERROR BOUNDARY)

Key tasks:
- Map SDK errors to user-friendly messages
- Add error boundaries
- Handle edge cases (sold out, mint ended)
- Integrate Sentry logging

---

## Backend Implementation (zuno-marketplace-api)

### Phase 1: Update Proto Definition
**Status:** Pending | **Effort:** 30min

File: `proto/collection.proto`

Add `settings_json` field to Collection message.

### Phase 2: Update Repository
**Status:** Pending | **Effort:** 1h

Files:
- `services/collection-service/internal/repository/collection_repository.go`
- `services/collection-service/internal/converter/collection_converter.go`

Include settings_json in queries and mapping.

### Phase 3: Update GraphQL Schema
**Status:** Pending | **Effort:** 30min

File: `services/graphql-gateway/graph/schemas/collection.graphqls`

Add `settingsJson: String` field to Collection type.

### Phase 4: Update Mappers
**Status:** Pending | **Effort:** 30min

File: `services/graphql-gateway/internal/mapper/collection_mapper.go`

Map settings_json from proto to GraphQL.

### Phase 5: Testing
**Status:** Pending | **Effort:** 1h

Test GraphQL queries with and without settings_json data.

---

## Unresolved Questions

1. **Environment Variables:** Need actual values for:
   - `NEXT_PUBLIC_ZUNO_API_KEY`
   - `NEXT_PUBLIC_DEFAULT_CHAIN_ID`
   - `NEXT_PUBLIC_RPC_URL`

2. **Price Display:** Should prices show in ETH or USD?

3. **SDK Configuration:** Exact ZunoProvider configuration options needed.

4. **Transaction Monitoring:** Current repo handling sufficient - verify during implementation.

---

## Execution Order

### Parallel Tracks

**Track A - Backend (API Team):**
```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
(4h total)
```

**Track B - Frontend (UI Team):**
```
Phase 1 (SDK Setup) → Phase 2 (GraphQL) → Phase 4 (Mint)
                     ↓
                Phase 3 (Metadata) - waits for backend
                     ↓
                Phase 5 (Error Handling)
(16h total)
```

### Recommended Approach

1. Start backend Phase 1-2 immediately
2. Frontend can proceed with Phase 1-2-4 in parallel
3. Frontend Phase 3 blocked until backend Phase 3-4 complete
4. Final integration testing after both tracks complete

---

## Files Created by This Plan

### Frontend Plan
```
plans/260208-1614-launchpad-integration/
├── plan.md
├── phase-01-sdk-setup.md
├── phase-02-graphql-integration.md
├── phase-03-metadata-parsing.md
├── phase-04-mint-integration.md
├── phase-05-error-handling.md
└── REMAINING.md (this file)
```

### Backend Plan
```
plans/260208-1630-add-settings-json-field/
├── plan.md
├── phase-01-update-proto.md
├── phase-02-update-repository.md
├── phase-03-update-graphql.md
├── phase-04-update-mappers.md
└── phase-05-testing.md
```

---

## Next Steps

1. Review both plans with respective teams
2. Assign backend plan to API team
3. Begin frontend implementation with Phase 1
4. Coordinate Phase 3 (metadata) dependency
5. Schedule integration testing

---

**Total Effort Estimate:**
- Frontend: ~16 hours
- Backend: ~4 hours
- Integration/Testing: ~2 hours
- **Total: ~22 hours**
