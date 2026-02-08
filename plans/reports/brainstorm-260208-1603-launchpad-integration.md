# Brainstorm Report: Launchpad Integration with Real Data

**Date:** 2026-02-08
**Scope:** Integrate zuno-marketplace-ui launchpad/mint-nft with real data from zuno-api and zuno-sdk
**Reporter:** Brainstorm Agent

---

## Problem Statement

The `zuno-marketplace-ui` launchpad/mint-nft module currently uses mock data (`collectionFaker`). We need to:

1. Fetch real collection data from `zuno-api` GraphQL
2. Handle minting via `zuno-sdk` (like `zuno-mini`)
3. Enable navigation: homepage collection click → launchpad page → display real info → handle mint

---

## Current State Analysis

### zuno-marketplace-ui (UI)
- **Route:** `/launchpad/{slug}` exists but uses mock data
- **GraphQL:** `useGetCollectionQuery` available but unused in mint page
- **Mock sources:** `collectionFaker` in multiple components
- **Mint logic:** `useMintState` hook with mock constants

### zuno-marketplace-api (API)
- **GraphQL endpoint:** `collection(slug)` query available
- **Data available:** Full collection + metadata + stats
- **Schema:** `CollectionMetadata` has JSON fields for extended data
- **Upload:** REST endpoint for media

### zuno-mini (Reference)
- **SDK:** `zuno-marketplace-sdk` v2.1.1
- **Pattern:** Hybrid - GraphQL for data, SDK for minting
- **Key hooks:** `useCollection()`, `useCollectionInfo()`, `useWallet()`
- **Mint flow:** `batchMintERC721` / `batchMintERC1155`

---

## Evaluated Approaches

### Option 1: Full SDK Integration (zuno-mini style)
Use SDK for both data fetching and minting.

**Pros:**
- Consistent with zuno-mini
- Single source of truth for blockchain data
- Built-in caching and error handling

**Cons:**
- Duplicate data layer (SDK + GraphQL)
- SDK may not expose all API fields
- More complex state management

### Option 2: Hybrid Approach (RECOMMENDED)
GraphQL for data fetching, SDK only for minting transactions.

**Pros:**
- Leverages existing GraphQL infrastructure
- Full access to API fields (metadata, stats, etc.)
- SDK focused on blockchain operations only
- Cleaner separation of concerns

**Cons:**
- Two data sources to manage
- Need to sync SDK wallet state with UI

### Option 3: API-Only Approach
Extend API to support minting, no SDK.

**Pros:**
- Single data source
- No external SDK dependency

**Cons:**
- Requires backend changes
- Reinventing SDK functionality
- More development time

---

## Final Recommended Solution

### Architecture: Hybrid Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    zuno-marketplace-ui                      │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (GraphQL)        │  Transaction Layer (SDK)     │
│  ─────────────────           │  ─────────────────────       │
│  useGetCollectionQuery       │  useCollection()             │
│  useGetCollectionsQuery      │  ├─ batchMintERC721()        │
│                              │  └─ batchMintERC1155()       │
└──────────────────────────────┴──────────────────────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   zuno-api (GraphQL)     │    │   zuno-sdk (Blockchain)  │
│   ─────────────────      │    │   ───────────────────    │
│   collection(slug)       │    │   Smart contract calls   │
│   metadata JSON field    │    │   Wallet interactions    │
└──────────────────────────┘    └──────────────────────────┘
```

### Key Decisions

1. **Route:** Keep `/launchpad/{slug}` (existing)
2. **Data:** GraphQL `useGetCollectionQuery` for collection data
3. **Metadata:** Store accordion content in `collection.metadata` JSON field
4. **Minting:** Integrate `zuno-marketplace-sdk` for blockchain operations
5. **Wallet:** Use SDK's wallet hooks or align with existing wagmi setup

### Data Flow

```
Homepage Collection Card
        │
        ▼ click
/launchpad/{slug}
        │
        ├─ Server: fetchCollectionBySlug(slug) → GraphQL
        │
        ▼
MintNFT Component
        │
        ├─ useGetCollectionQuery({ slug }) → Real data
        │
        ├─ Parse metadata JSON → Overview/Utility accordions
        │
        └─ useCollection() from SDK → Mint functions
```

---

## Implementation Considerations

### Files to Modify

| File | Change |
|------|--------|
| `src/app/(marketplace)/launchpad/[slug]/page.tsx` | Replace mock fetch with GraphQL |
| `src/modules/launch-pad/mint-nft/mint-nft.tsx` | Use real collection data |
| `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts` | Integrate SDK mint functions |
| `src/modules/launch-pad/mint-nft/components/mint-form.tsx` | Connect to SDK mint |
| `src/modules/launch-pad/mint-nft/components/collection-info-section.tsx` | Parse metadata JSON |

### SDK Integration Steps

1. **Install SDK:** `npm install zuno-marketplace-sdk`
2. **Configure SDK:** Create `src/lib/config/zuno-sdk.ts`
3. **Provider Setup:** Wrap app with `ZunoProvider`
4. **Mint Hook:** Use `useCollection()` for mint functions
5. **Error Handling:** Adapt `handleSdkError` from zuno-mini

### Metadata Structure

Proposed JSON schema for `collection.metadata`:

```json
{
  "overview": {
    "description": "...",
    "roleInGameplay": "...",
    "rpgProgression": "...",
    "rarityAndValue": "..."
  },
  "utility": [
    { "label": "In-Game Currency", "description": "..." },
    { "label": "Exclusive Access", "description": "..." }
  ],
  "social": {
    "discord": "...",
    "twitter": "...",
    "website": "..."
  }
}
```

### Environment Variables Required

```bash
# Existing
NEXT_PUBLIC_BACKEND_URL=http://localhost:4080

# New for SDK
NEXT_PUBLIC_ZUNO_API_KEY=...
NEXT_PUBLIC_DEFAULT_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=...
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| SDK version mismatch | High | Pin SDK version, test with API version |
| Metadata schema changes | Medium | Version metadata JSON, validate schema |
| Wallet state conflicts | Medium | Single wallet provider (wagmi or SDK) |
| GraphQL vs SDK data inconsistency | Low | Use GraphQL as source of truth |

---

## Success Criteria

- [ ] Clicking collection on homepage navigates to `/launchpad/{slug}`
- [ ] Launchpad page displays real collection data (name, image, description)
- [ ] Overview/Utility accordions populated from API metadata
- [ ] Mint form shows real mint price and stages
- [ ] Mint transaction executes via zuno-sdk
- [ ] Error handling for failed mints
- [ ] Loading states during data fetch

---

## Next Steps

1. **Create implementation plan** with detailed phases
2. **Set up SDK configuration** and providers
3. **Integrate GraphQL queries** for collection data
4. **Implement SDK mint functions**
5. **Update metadata structure** in API if needed
6. **Test end-to-end flow**

---

## Unresolved Questions

1. What SDK version should we use? (zuno-mini uses v2.1.1)
2. Should we add metadata JSON validation on API side?
3. Do we need to handle allowlist checking before mint?
4. What is the deployment status flow for collections?

---

*Ready to proceed with implementation planning?*