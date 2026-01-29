# BottomActionBar: Position & State Management

## Problem Statement

1. **Position Issue**: `BottomActionBar` constrained by marketplace container width, not full-width like true footer
2. **State Sharing**: `selectedNFTs` state needs to be shared across components for reuse
3. **Reusability**: Component should be usable elsewhere in the app with shared state

---

## Evaluated Approaches

### 1. React Context + Lift Component

**Pros:**

- No new dependencies
- Built-in React solution
- Simple for this use case

**Cons:**

- Provider wrapping required
- Re-renders all consumers on any state change
- Not ideal for frequent updates

### 2. React Portal + State Library (Jotai/Zustand)

**Pros:**

- Portal breaks out of all containers naturally
- State library provides clean external state
- Jotai: atomic, composable, minimal boilerplate
- Zustand: simpler API, no providers needed

**Cons:**

- New dependency (but lightweight: ~3KB Jotai, ~1KB Zustand)
- Portal adds slight complexity

### 3. CSS Fixed Positioning + Props Drilling

**Pros:**

- No new dependencies
- Simplest solution

**Cons:**

- Props drilling for state sharing
- Not scalable for future reuse

---

## Brutal Honest Assessment

### Jotai vs Zustand vs Context for THIS project:

**You DON'T need Jotai** if:

- Only sharing `selectedNFTs` between 2-3 components
- Simple CRUD operations
- No derived/computed state complexity

**You SHOULD use Zustand** if:

- Want no provider boilerplate
- Need simple, clean API
- State will grow over time
- Want TypeScript support out of box

**You COULD use Context** if:

- State scope is truly local to marketplace
- Don't want ANY new dependencies

### My Honest Recommendation:

**Zustand** - not Jotai. Here's why:

1. **Zustand is simpler** for this use case:

   ```ts
   // One file, no providers, no atoms
   import { create } from "zustand";

   const useNFTSelection = create(set => ({
     selectedNFTs: [],
     add: id => set(state => ({ selectedNFTs: [...state.selectedNFTs, id] })),
     remove: id => set(state => ({ selectedNFTs: state.selectedNFTs.filter(x => x !== id) })),
   }));
   ```

2. **Jotai is overkill** for simple array state - you'd need multiple atoms, writeable getters, more boilerplate

3. **Zustand = 1KB** vs **Jotai = 3KB** (both small, but Zustand wins)

4. **Zustand needs no Provider wrapper** - just use the hook anywhere

---

## Recommended Solution

### Architecture:

```
src/shared/stores/
└── use-nft-selection-store.ts  # Zustand store
```

### Component Placement:

1. **Move `BottomActionBar` to shared layout** (not inside marketplace component)
2. **Use React Portal** OR **fixed positioning with `left-0 right-0`**
3. **Control visibility via Zustand store** (`showBottomActionBar` flag)

### Data Flow:

```
┌─────────────────────────────────────────────────┐
│  App Layout                                      │
│  ┌──────────────────────────────────────────┐  │
│  │  MarketPlace (NFTGrid, NFTListView)      │  │
│  │  → usesNFTSelectionStore.add/remove()    │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  BottomActionBar (fixed bottom-0)        │  │
│  │  → useNFTSelectionStore()                │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Install Zustand

```bash
pnpm add zustand
```

### Phase 2: Create Shared Store

`src/shared/stores/use-nft-selection-store.ts`

```ts
import { create } from "zustand";

interface NFTSelectionStore {
  selectedNFTs: string[];
  maxItems: number;
  sliderValue: number;
  actionMode: "buy" | "sell";
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
  clear: () => void;
  setSliderValue: (value: number) => void;
  setActionMode: (mode: "buy" | "sell") => void;
}
```

### Phase 3: Move BottomActionBar to Layout

- Place in parent layout component
- Use `fixed bottom-0 left-0 right-0` for full width
- Desktop: adjust `lg:left-[52px]` for sidebar

### Phase 4: Update Marketplace Component

- Remove local `selectedNFTs` state
- Use store hook instead
- Remove BottomActionBar from marketplace return

---

## Risks & Mitigation

| Risk                    | Mitigation                                           |
| ----------------------- | ---------------------------------------------------- |
| Zustand learning curve  | Simple CRUD, docs clear                              |
| State persistence lost  | Add `persist` middleware if needed                   |
| Mobile nav overlap      | Adjust z-index (BottomActionBar: 60, mobile nav: 50) |
| Desktop sidebar overlap | Already handled with `lg:left-[52px]`                |

---

## Success Criteria

- [ ] BottomActionBar spans full viewport width
- [ ] Selection state shared between NFTGrid and BottomActionBar
- [ ] Works on mobile without overlapping tab navigation
- [ ] Reusable in other pages (collection detail, wallet, etc.)
- [ ] TypeScript types correct

---

## Unresolved Questions

1. Should BottomActionBar be **always visible** or **only when NFTs selected**?
2. Does it need to persist across route navigation?
3. Should maxItems be dynamic (based on current view) or fixed?

---

## Next Steps

If you agree with Zustand approach:

1. Run `/plan` with this summary as context
2. Implement store + component relocation
3. Test width positioning and state sync

If you prefer Jotai or Context:

- Let me know reasoning - can adapt approach

---

**Final note**: Jotai is great for **atomic, granular state**. Zustand wins for **simple global stores**. For NFT selection array, Zustand is the pragmatic choice (YAGNI principle).
