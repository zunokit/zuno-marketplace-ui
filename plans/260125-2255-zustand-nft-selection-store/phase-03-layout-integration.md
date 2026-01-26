---
title: "Phase 3: Layout Integration"
description: "Move BottomActionBar to shared layout with proper fixed positioning for full viewport width"
status: pending
priority: P1
effort: 1.5h
dependencies: [Phase 1, Phase 2]
---

## Context
- **Plan**: [Zustand NFT Selection Store & BottomActionBar Layout Refactor](./plan.md)
- **Prerequisites**: [Phase 1](./phase-01-setup-and-store-creation.md), [Phase 2](./phase-02-marketplace-refactor.md)

## Overview
Create a marketplace-specific layout that renders BottomActionBar with fixed positioning for full viewport width. The bar will consume the Zustand store directly and be visible across all marketplace routes.

## Requirements
### Functional
- Create layout file at `src/app/(marketplace)/layout.tsx`
- Move BottomActionBar to layout
- Use fixed positioning: `bottom-0 left-0 right-0`
- Handle desktop sidebar offset: `lg:left-[52px]`
- Show/hide based on route or selection state
- Consume Zustand store for state

### Non-Functional
- Maintain z-index hierarchy (BottomActionBar: 60)
- No overlap with mobile tab navigation (z-index 50)
- Responsive design maintained
- Full viewport width achieved

## Key Insights
- Current layout structure: No group layout exists
- BottomActionBar currently constrained by marketplace container
- Fixed positioning breaks out of container flow
- Mobile nav has `z-50`, BottomActionBar needs `z-[60]`

## Architecture

### Layout Structure
```typescript
// src/app/(marketplace)/layout.tsx
export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <BottomActionBarWrapper />
    </>
  )
}
```

### BottomActionBarWrapper Component
```typescript
// Uses Zustand store for all state
// Renders BottomActionBar with fixed positioning
// Handles visibility logic (show on marketplace routes)
const BottomActionBarWrapper = () => {
  const { selectedNFTs, sliderValue, actionMode, ... } = useNFTSelectionStore()

  // Visibility logic: show only on marketplace pages or when items selected
  const pathname = usePathname()
  const showBar = pathname.startsWith('/marketplace') || selectedNFTs.length > 0

  if (!showBar) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] lg:left-[52px] lg:w-[calc(100%-52px)]">
      <BottomActionBar {...storeState} />
    </div>
  )
}
```

### Positioning Classes
```css
/* Full viewport width */
fixed bottom-0 left-0 right-0

/* Desktop: offset for sidebar */
lg:left-[52px] lg:w-[calc(100%-52px)]

/* Above mobile navigation */
z-[60]

/* Mobile nav (reference) */
z-50  /* Lower than BottomActionBar */
```

## Related Code Files
### Files to Create
- `src/app/(marketplace)/layout.tsx` - Marketplace group layout
- `src/modules/marketplace/components/BottomActionBarWrapper.tsx` - Wrapper component

### Files to Modify
- `src/modules/marketplace/components/BottomActionBar.tsx` - Update to consume store directly

### Files to Read
- `src/modules/marketplace/components/BottomActionBar.tsx` - Current implementation
- `src/app/(marketplace)/marketplace/[slug]/page.tsx` - Marketplace page structure

## Implementation Steps

1. **Create BottomActionBarWrapper component**
   - Create file: `src/modules/marketplace/components/BottomActionBarWrapper.tsx`
   - Import `useNFTSelectionStore`
   - Import `usePathname` from next/navigation
   - Implement visibility logic
   - Render BottomActionBar with store state

2. **Update BottomActionBar component**
   - Modify props interface (remove callback props)
   - Consume store directly instead of receiving callbacks
   - Keep UI/logic the same
   - Update `onSliderChange` to use store action

3. **Create marketplace group layout**
   - Create file: `src/app/(marketplace)/layout.tsx`
   - Import BottomActionBarWrapper
   - Render children + wrapper
   - Ensure proper stacking context

4. **Test positioning**
   - Mobile: full width, no overflow
   - Desktop: offset for sidebar, no overflow
   - Z-index: above mobile nav

5. **Test visibility logic**
   - Show on `/marketplace/*` routes
   - Hide on other routes (unless items selected)
   - Persist selection across navigation

## Todo List
- [ ] Create `BottomActionBarWrapper.tsx`
- [ ] Implement visibility logic (pathname-based)
- [ ] Update BottomActionBar to consume store
- [ ] Remove callback props from BottomActionBar
- [ ] Create `src/app/(marketplace)/layout.tsx`
- [ ] Add BottomActionBarWrapper to layout
- [ ] Test mobile positioning (full width)
- [ ] Test desktop positioning (sidebar offset)
- [ ] Test z-index (above mobile nav)
- [ ] Test route visibility (show/hide logic)

## Success Criteria
- [ ] BottomActionBar spans full viewport width
- [ ] Fixed positioning works on mobile
- [ ] Desktop sidebar offset correct
- [ ] No z-index conflicts
- [ ] Shows on marketplace routes
- [ ] Hides on non-marketplace routes (optional)
- [ ] Store state properly consumed
- [ ] No TypeScript errors

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Z-index conflict with mobile nav | Medium | High | Use z-[60] (nav is z-50) |
| Sidebar offset incorrect | Low | Medium | Test on desktop viewport |
| Layout file not picked up | Low | High | Verify Next.js route group structure |
| State not persisting | Low | Medium | Zustand persists by default |

## Security Considerations
- No new security concerns (layout change only)
- Store remains client-side

## Next Steps
After completing this phase:
1. Proceed to [Phase 4: Testing & Validation](./phase-04-testing-and-validation.md)
2. Manual testing of all scenarios
3. Consider persist middleware if needed
