---
title: "Phase 1: Setup & Store Creation"
description: "Install Zustand and create NFT selection store with TypeScript types"
status: pending
priority: P1
effort: 30m
dependencies: []
---

## Context
- **Plan**: [Zustand NFT Selection Store & BottomActionBar Layout Refactor](./plan.md)
- **Related**: [Brainstorm Report](../../reports/brainstorm-260125-2249-bottomactionbar-state-and-positioning.md)

## Overview
Install Zustand package and create a centralized state management store for NFT selection. This store will handle selected NFT IDs, slider value, and action mode.

## Requirements
### Functional
- Install zustand package via pnpm
- Create typed store with TypeScript
- Implement CRUD operations for selection
- Add action mode toggle (buy/sell)
- Handle slider value synchronization

### Non-Functional
- Follow TypeScript strict mode
- Use consistent naming (kebab-case files)
- Add JSDoc comments for exports
- Ensure type safety throughout

## Key Insights
From brainstorm analysis:
- Zustand chosen over Jotai: simpler API, no providers needed
- Store needs: selected NFTs array, slider value, action mode, max items
- No persist middleware needed initially (can add later)

## Architecture

### Store Structure
```typescript
interface NFTSelectionStore {
  // State
  selectedNFTs: string[]
  maxItems: number
  sliderValue: number
  actionMode: 'buy' | 'sell'

  // Actions
  add: (id: string) => void
  remove: (id: string) => void
  toggle: (id: string) => void
  set: (ids: string[]) => void
  clear: () => void
  setSliderValue: (value: number) => void
  setActionMode: (mode: 'buy' | 'sell') => void
  setMaxItems: (max: number) => void
}
```

### Component Usage
```typescript
// In NFTGrid/NFTListView
const { add, remove, selectedNFTs } = useNFTSelectionStore()

// In BottomActionBar
const { selectedNFTs, sliderValue, actionMode, setSliderValue } = useNFTSelectionStore()
```

## Related Code Files
### Files to Create
- `src/shared/stores/use-nft-selection-store.ts` - Main store definition

### Files to Modify
- `package.json` - Add zustand dependency

## Implementation Steps

1. **Install Zustand**
   ```bash
   pnpm add zustand
   ```

2. **Create stores directory structure**
   ```bash
   mkdir -p src/shared/stores
   ```

3. **Create store file**
   - Define TypeScript interface
   - Create store with create() from zustand
   - Implement all actions
   - Add JSDoc comments

4. **Verify installation**
   ```bash
   pnpm build --dry-run
   ```

## Todo List
- [ ] Run `pnpm add zustand`
- [ ] Create `src/shared/stores/` directory
- [ ] Create `use-nft-selection-store.ts` with interface
- [ ] Implement add/remove/toggle actions
- [ ] Implement set/clear actions
- [ ] Implement slider value action
- [ ] Implement action mode action
- [ ] Add JSDoc comments
- [ ] Verify no TypeScript errors

## Success Criteria
- [ ] Package installed successfully
- [ ] Store file created at correct path
- [ ] TypeScript types valid (no compile errors)
- [ ] All actions implemented
- [ ] Default values set correctly

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Zustand version conflict | Low | Low | Use latest stable version |
| Type definition errors | Medium | Medium | Use strict TypeScript, test early |
| Missing actions | Low | Low | Cross-reference with existing hook |

## Security Considerations
- No auth/data needed (client-side only)
- Input validation for IDs (string type check)

## Next Steps
After completing this phase:
1. Proceed to [Phase 2: Marketplace Refactor](./phase-02-marketplace-refactor.md)
2. Update store if additional state needs identified
