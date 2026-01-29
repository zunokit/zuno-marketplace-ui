---
title: "Phase 2: Marketplace Refactor"
description: "Refactor marketplace component to use Zustand store instead of local state"
status: pending
priority: P1
effort: 1h
dependencies: [Phase 1]
---

## Context

- **Plan**: [Zustand NFT Selection Store & BottomActionBar Layout Refactor](./plan.md)
- **Prerequisite**: [Phase 1: Setup & Store Creation](./phase-01-setup-and-store-creation.md)

## Overview

Refactor the marketplace component (`src/modules/marketplace/index.tsx`) to consume the Zustand store instead of managing local `selectedNFTs` state. Remove the local state and hook usage, replacing with store actions.

## Requirements

### Functional

- Remove local `selectedNFTs` useState
- Remove `useNFTSelection` hook usage
- Import and use `useNFTSelectionStore`
- Keep existing functionality intact
- Remove BottomActionBar from component return

### Non-Functional

- Maintain component behavior
- No breaking changes to UI
- Clean code, no dead code left behind

## Key Insights

- Current hook: `useNFTSelection` manages slider + selection
- Store now handles selection, slider comes from store
- BottomActionBar props will change in Phase 3
- Need to keep `onSelectedNFTsChange` for cart event dispatch

## Architecture

### Before (Current)

```typescript
const [selectedNFTs, setSelectedNFTs] = useState<string[]>([])
const { sliderValue, handleSliderChange, ... } = useNFTSelection({...})

// BottomActionBar rendered inside component
<BottomActionBar
  itemCount={selectedNFTs.length}
  sliderValue={sliderValue}
  onSliderChange={handleSliderChange}
  ...
/>
```

### After (Target)

```typescript
const { selectedNFTs, add, remove, clear } = useNFTSelectionStore();

const handleNFTSelection = (id: string) => {
  const isSelected = selectedNFTs.includes(id);
  isSelected ? remove(id) : add(id);
};

// BottomActionBar removed from here (moved to layout)
```

## Related Code Files

### Files to Modify

- `src/modules/marketplace/index.tsx` - Main marketplace component
- `src/modules/marketplace/hooks/useNFTSelection.ts` - May deprecate (keep for now)

### Files to Read First

- `src/modules/marketplace/index.tsx` - Current implementation
- `src/modules/marketplace/components/NFTGrid.tsx` - Selection handler
- `src/modules/marketplace/components/NFTListView.tsx` - Selection handler

## Implementation Steps

1. **Read current implementation**
   - Analyze `selectedNFTs` usage
   - Map `useNFTSelection` hook outputs to store actions

2. **Update imports**

   ```typescript
   import { useNFTSelectionStore } from "@/shared/stores/use-nft-selection-store";
   ```

3. **Replace state initialization**

   ```typescript
   // Remove: const [selectedNFTs, setSelectedNFTs] = useState<string[]>([])
   // Add:
   const { selectedNFTs, add, remove, toggle, clear } = useNFTSelectionStore();
   ```

4. **Update selection handler**

   ```typescript
   const handleNFTSelection = useCallback(
     (id: string) => {
       toggle(id); // or: selectedNFTs.includes(id) ? remove(id) : add(id)
     },
     [toggle, selectedNFTs]
   );
   ```

5. **Remove useNFTSelection hook**
   - Remove hook import
   - Remove hook usage
   - Remove related destructured values

6. **Remove BottomActionBar from return**
   - Find BottomActionBar JSX
   - Remove entire component (moved to Phase 3)
   - Remove related props

7. **Keep cart event dispatch**

   ```typescript
   useEffect(() => {
     window.dispatchEvent(
       new CustomEvent("cartUpdate", {
         detail: { itemCount: selectedNFTs.length },
       })
     );
   }, [selectedNFTs]);
   ```

8. **Test compilation**
   ```bash
   pnpm build
   ```

## Todo List

- [ ] Import `useNFTSelectionStore`
- [ ] Remove `useState` for selectedNFTs
- [ ] Remove `useNFTSelection` hook import
- [ ] Replace with store hook
- [ ] Update `handleNFTSelection` to use store actions
- [ ] Remove `sliderValue` and related state (now in store)
- [ ] Remove `actionMode` and related state (now in store)
- [ ] Remove BottomActionBar from JSX
- [ ] Keep cart update effect
- [ ] Verify compilation
- [ ] Check for TypeScript errors

## Success Criteria

- [ ] No local `selectedNFTs` state
- [ ] Store actions used for selection
- [ ] BottomActionBar removed from component
- [ ] Component still compiles
- [ ] No TypeScript errors
- [ ] Cart events still dispatch

## Risk Assessment

| Risk                               | Probability | Impact | Mitigation                         |
| ---------------------------------- | ----------- | ------ | ---------------------------------- |
| Missing selection functionality    | Medium      | High   | Test selection in NFTGrid/ListView |
| Cart events broken                 | Low         | Medium | Keep useEffect for cart events     |
| Props mismatch in child components | Low         | Medium | Verify NFTGrid/ListView props      |

## Security Considerations

- State remains client-side only
- No new API calls introduced
- Input validation handled by store

## Next Steps

After completing this phase:

1. Proceed to [Phase 3: Layout Integration](./phase-03-layout-integration.md)
2. BottomActionBar will be re-added in layout context
