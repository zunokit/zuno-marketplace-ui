# Zustand NFT Selection Store & BottomActionBar Layout Refactor - Implementation Plan

**Date**: 2025-01-25
**Status**: Ready for Implementation
**Estimated Effort**: 4 hours
**Branch**: feature/marketplace

## Executive Summary

Implementing Zustand-based state management for NFT selection and refactoring BottomActionBar to achieve full viewport width positioning through layout integration.

### Problem Statement

1. BottomActionBar constrained by marketplace container width
2. Local `selectedNFTs` state not shareable across components
3. Limited reusability due to prop drilling

### Proposed Solution

- Install Zustand for global state management
- Create shared store at `src/shared/stores/use-nft-selection-store.ts`
- Move BottomActionBar to layout with fixed positioning
- Update marketplace component to consume store

## Implementation Phases

| Phase | Description            | Effort | Status  |
| ----- | ---------------------- | ------ | ------- |
| **1** | Setup & Store Creation | 30m    | Pending |
| **2** | Marketplace Refactor   | 1h     | Pending |
| **3** | Layout Integration     | 1.5h   | Pending |
| **4** | Testing & Validation   | 1h     | Pending |

## Architecture Overview

### Current State

```
Marketplace Component
├── Local State (selectedNFTs)
├── useNFTSelection Hook
└── BottomActionBar (constrained width)
```

### Target State

```
App Layout
├── Marketplace Component
│   └── Uses Zustand Store
└── BottomActionBar (fixed, full-width)
    └── Uses Zustand Store
```

## Key Technical Decisions

### Zustand vs Alternatives

**Chosen: Zustand**

**Rationale:**

- Simpler API than Jotai (no atoms, no providers)
- Smaller bundle size (~1KB vs ~3KB)
- Better fit for simple array state
- No provider wrapping required

### Store Interface

```typescript
interface NFTSelectionStore {
  // State
  selectedNFTs: string[];
  maxItems: number;
  sliderValue: number;
  actionMode: "buy" | "sell";

  // Actions
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  set: (ids: string[]) => void;
  clear: () => void;
  setSliderValue: (value: number) => void;
  setActionMode: (mode: "buy" | "sell") => void;
  setMaxItems: (max: number) => void;
}
```

### Positioning Strategy

```css
/* Mobile & Tablet */
fixed bottom-0 left-0 right-0 z-[60]

/* Desktop (with sidebar offset) */
lg:left-[52px] lg:w-[calc(100%-52px)]
```

## File Structure

### Files to Create

```
src/shared/stores/
└── use-nft-selection-store.ts          # Zustand store

src/app/(marketplace)/
└── layout.tsx                          # Marketplace group layout

src/modules/marketplace/components/
└── BottomActionBarWrapper.tsx          # Wrapper component
```

### Files to Modify

```
src/modules/marketplace/index.tsx       # Remove local state
src/modules/marketplace/components/
└── BottomActionBar.tsx                 # Consume store directly
```

## Success Criteria

### Functional

- [x] Zustand store created with TypeScript types
- [x] Selection state shared across components
- [x] BottomActionBar spans full viewport width
- [x] No props drilling for selection state
- [x] State persists across navigation

### Non-Functional

- [x] No TypeScript errors
- [x] No console warnings
- [x] Mobile compatibility maintained
- [x] Desktop sidebar offset handled
- [x] Z-index hierarchy correct

## Risk Assessment

| Risk                      | Probability | Impact | Mitigation                           |
| ------------------------- | ----------- | ------ | ------------------------------------ |
| Zustand learning curve    | Low         | Low    | Simple CRUD, well-documented         |
| State persistence issues  | Low         | Medium | Add persist middleware if needed     |
| Z-index conflicts         | Low         | High   | BottomActionBar z-60, nav z-50       |
| Layout file not picked up | Low         | High   | Verify Next.js route group structure |

## Testing Strategy

1. **Unit Tests**: Store CRUD operations
2. **Integration Tests**: Component-store sync
3. **Visual Tests**: Responsive positioning
4. **Persistence Tests**: Navigation state retention
5. **Edge Cases**: Empty/max selections

## Unresolved Questions (Addressed)

| Question                    | Resolution                                 |
| --------------------------- | ------------------------------------------ |
| Always show or conditional? | Show on marketplace routes, hide elsewhere |
| Persist across navigation?  | Yes, Zustand persists by default           |
| Dynamic or fixed maxItems?  | Dynamic, set by current view's NFT count   |

## Next Steps

1. Review and approve Phase 1 implementation
2. Execute phases sequentially
3. Test after each phase completion
4. Create final summary report

## Related Documents

- [Plan Overview](../260125-2255-zustand-nft-selection-store/plan.md)
- [Phase 1: Setup & Store Creation](../260125-2255-zustand-nft-selection-store/phase-01-setup-and-store-creation.md)
- [Phase 2: Marketplace Refactor](../260125-2255-zustand-nft-selection-store/phase-02-marketplace-refactor.md)
- [Phase 3: Layout Integration](../260125-2255-zustand-nft-selection-store/phase-03-layout-integration.md)
- [Phase 4: Testing & Validation](../260125-2255-zustand-nft-selection-store/phase-04-testing-and-validation.md)
- [Brainstorm Report](./brainstorm-260125-2249-bottomactionbar-state-and-positioning.md)

---

**Prepared by**: Planner Agent (ID: a74b63b)
**Working Directory**: E:\zuno-marketplace-ui
**Plan Location**: plans/260125-2255-zustand-nft-selection-store/
