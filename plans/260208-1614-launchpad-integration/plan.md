---
title: "Launchpad Integration with Real Data"
description: "Integrate zuno-marketplace-ui launchpad/mint-nft with real data from zuno-api and zuno-sdk"
status: completed
priority: P1
effort: 16h
branch: feature/integration-launch-pad-with-real-data
tags: [launchpad, sdk, graphql, minting]
created: 2026-02-08
completed: 2026-02-08
---

# Launchpad Integration with Real Data

## Overview

Integrate the zuno-marketplace-ui launchpad/mint-nft module with real data from zuno-api (GraphQL) and zuno-sdk for blockchain minting operations.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LAUNCHPAD INTEGRATION                     │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (GraphQL)        │  Transaction Layer (SDK)     │
│  ─────────────────           │  ─────────────────────       │
│  useGetCollectionQuery       │  useCollection()             │
│  ├─ collection(slug)         │  ├─ batchMintERC721()        │
│  ├─ metadata                 │  └─ batchMintERC1155()       │
│  └─ settings_json            │                              │
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

## Implementation Phases

| Phase | Name | Status | Priority |
|-------|------|--------|----------|
| 1 | [SDK Setup & Provider Configuration](./phase-01-sdk-setup.md) | Completed | High |
| 2 | [GraphQL Integration - Fetch Real Collection Data](./phase-02-graphql-integration.md) | Completed | High |
| 3 | [Metadata Parsing for Accordions](./phase-03-metadata-parsing.md) | Completed | Medium |
| 4 | [SDK Mint Integration](./phase-04-mint-integration.md) | Completed | High |
| 5 | [Error Handling & Edge Cases](./phase-05-error-handling.md) | Completed | Medium |

## Key Files

| File | Purpose |
|------|---------|
| `src/shared/utils/collection.ts` | Replace mock fetch with GraphQL |
| `src/modules/launch-pad/mint-nft/hooks/use-mint-state.ts` | Integrate SDK mint functions |
| `src/modules/launch-pad/mint-nft/components/mint-form.tsx` | Connect real mint |
| `src/modules/launch-pad/mint-nft/components/collection-info-section.tsx` | Parse metadata |
| `src/app/app-wrapper.tsx` | Add ZunoProvider |

## Success Criteria

- [x] Homepage collection click navigates to `/launchpad/{slug}`
- [x] Launchpad displays real collection data from API
- [x] Overview/Utility accordions populated from metadata
- [x] Mint form shows real pricing and stages
- [x] Mint transaction executes via zuno-sdk
- [x] Error handling for all failure modes

## Validation Log

### Session 1 — 2026-02-08
**Trigger:** Initial plan validation before implementation
**Questions asked:** 4

#### Questions & Answers

1. **[API Dependency]** The plan assumes the `settings_json` field needs to be added to the GraphQL API. How should we handle this dependency?
   - Options: Wait for backend team | Use description field temporarily (Recommended) | Skip Phase 3 initially
   - **Answer:** Create backend plan for API team to add settings_json field
   - **Rationale:** Backend change required to expose settings_json field in GraphQL schema

2. **[Allowlist Minting]** For allowlist minting, the plan mentions needing signature/nonce. How should this be handled?
   - Options: SDK handles internally | Separate API endpoint | Skip allowlist for MVP (Recommended)
   - **Answer:** Skip allowlist for MVP (Recommended)
   - **Rationale:** Focus on public mint first, add allowlist in future iteration

3. **[Scope Adjustment]** The plan includes 5 phases with an estimated 16h effort. Should we adjust scope for faster delivery?
   - Options: Full 5 phases | MVP first (Phases 1-2-4) (Recommended) | Minimal viable
   - **Answer:** Full 5 phases
   - **Rationale:** Complete all planned work including error handling and metadata parsing

4. **[Transaction Monitoring]** For transaction monitoring after mint, what approach should we use?
   - Options: SDK callbacks only (Recommended) | Add polling | Skip monitoring
   - **Answer:** Current repo handles it, no need to implement but note in plan
   - **Rationale:** Existing transaction handling in codebase is sufficient

5. **[Allowlist Minting]** For allowlist minting, should we implement full MVP with allowlist support?
   - Options: Skip allowlist for MVP | Full MVP with allowlist (Recommended)
   - **Answer:** Full MVP with allowlist (Recommended)
   - **Rationale:** Reference zuno-mini implementation - use `useIsInAllowlist`, `useIsAllowlistOnly` hooks from SDK

#### Confirmed Decisions
- **Backend Dependency:** Create separate backend plan to add settings_json field to GraphQL API
- **Allowlist Minting:** Skip for MVP, focus on public mint only
- **Scope:** Complete all 5 phases as planned
- **Transaction Monitoring:** Use existing repo handling, no additional implementation needed

#### Action Items
- [ ] Create backend plan for API team (settings_json field)
- [ ] Update Phase 3 to reference backend dependency
- [ ] Update Phase 4 to remove allowlist handling for MVP

#### Impact on Phases
- Phase 3: Add dependency note - requires backend API change for settings_json field
- Phase 4: Remove allowlist signature handling, focus on public mint only

## Unresolved Questions

1. Backend plan: Need to create plan for zuno-marketplace-api to add settings_json field
2. What are specific ZunoProvider configuration options?
3. Should prices display in ETH or USD?
4. Transaction monitoring: Current repo handles it
