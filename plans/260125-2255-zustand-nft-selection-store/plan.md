---
title: "Zustand NFT Selection Store & BottomActionBar Layout Refactor"
description: "Implement Zustand store for NFT selection state and move BottomActionBar to shared layout for proper full-width positioning"
status: pending
priority: P2
effort: 4h
branch: feature/marketplace
tags: [state-management, zustand, layout-refactor, marketplace]
created: 2025-01-25
---

## Overview

Implement Zustand-based state management for NFT selection and refactor BottomActionBar positioning to achieve full viewport width by moving it from the marketplace component to a shared layout.

**Current Issues:**

1. BottomActionBar constrained by marketplace container width
2. Local `selectedNFTs` state not shareable across components
3. Component reusability limited by prop drilling

**Solution:**

1. Install Zustand for global state
2. Create shared store at `src/shared/stores/use-nft-selection-store.ts`
3. Move BottomActionBar to layout with fixed positioning
4. Update marketplace component to consume store

## Phases

| Phase                                                                     | Status  | Dependencies              |
| ------------------------------------------------------------------------- | ------- | ------------------------- |
| [Phase 1: Setup & Store Creation](./phase-01-setup-and-store-creation.md) | pending | None                      |
| [Phase 2: Marketplace Refactor](./phase-02-marketplace-refactor.md)       | pending | Phase 1                   |
| [Phase 3: Layout Integration](./phase-03-layout-integration.md)           | pending | Phase 1, Phase 2          |
| [Phase 4: Testing & Validation](./phase-04-testing-and-validation.md)     | pending | Phase 1, Phase 2, Phase 3 |

## Related Reports

- [Brainstorm Report](../../reports/brainstorm-260125-2249-bottomactionbar-state-and-positioning.md)

## Success Criteria

- [ ] Zustand store created with TypeScript types
- [ ] BottomActionBar spans full viewport width (fixed positioning)
- [ ] Selection state shared between NFTGrid/NFTListView and BottomActionBar
- [ ] No props drilling for selection state
- [ ] Mobile compatibility maintained (no overlap with tab navigation)
- [ ] Desktop sidebar offset handled correctly
- [ ] All tests passing

## Risks

- **Risk**: Zustand learning curve for team
  **Mitigation**: Simple CRUD operations, well-documented implementation

- **Risk**: State persistence lost on navigation
  **Mitigation**: Add persist middleware if needed (Phase 4)

- **Risk**: Z-index conflicts with mobile navigation
  **Mitigation**: BottomActionBar z-index 60, mobile nav z-index 50

## Unresolved Questions

1. Should selection persist across route navigation? → Addressed in Phase 4
2. Need to show/hide BottomActionBar based on route? → Handled in Phase 3

## Architecture

```
Before:
┌─────────────────────────────────────┐
│  Marketplace Component              │
│  ┌─────────────────┐                │
│  │  NFTGrid        │                │
│  │  (local state)  │                │
│  └─────────────────┘                │
│  ┌─────────────────────────┐        │
│  │  BottomActionBar         │◄─────┐
│  │  (constrained width)     │      │
│  └─────────────────────────┘      │ Props
└─────────────────────────────────────┘ drilled

After:
┌─────────────────────────────────────┐
│  App Layout                         │
│  ┌─────────────────────────────────┐│
│  │  Marketplace Component          ││
│  │  ┌─────────────────┐            ││
│  │  │  NFTGrid        │──┐         ││
│  │  │  (uses store)   │  │         ││
│  │  └─────────────────┘  │         ││
│  │                       │ Zustand │
│  └───────────────────────┼─────────││
│  ┌─────────────────────┐ │ Store   ││
│  │  BottomActionBar    │◜┘         ││
│  │  (fixed, full-width)│           ││
│  └─────────────────────┘           ││
└─────────────────────────────────────┘
```

## Next Steps

1. Review and approve Phase 1 implementation
2. Execute phases sequentially
3. Test after each phase completion
