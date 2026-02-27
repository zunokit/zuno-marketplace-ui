# Phase 05: Info Section Wrapper Component

**Status**: completed
**Priority**: HIGH
**Effort**: 30 minutes
**Blocked By**: Phase 03, Phase 04

---

## Overview

Create the wrapper component that combines both accordion components and uses faker data.

---

## Context Links

- **Overview Accordion**: `src/modules/launch-pad/mint-nft/components/collection-overview-accordion.tsx`
- **Utility Accordion**: `src/modules/launch-pad/mint-nft/components/collection-utility-accordion.tsx`
- **Faker**: `src/shared/utils/mock/fakers/collection.faker.ts`

---

## Requirements

### Functional Requirements
1. Create wrapper component that renders both accordions
2. Fetch data from collectionFaker
3. Pass data to child components
4. Handle loading state

### Non-Functional Requirements
1. Follow project naming conventions
2. Proper TypeScript types
3. "use client" directive

---

## Implementation Steps

1. Create component file with "use client"
2. Import both accordion components
3. Import collectionFaker
4. Set up state for overview and utility data
5. Use useEffect to populate data on mount
6. Render both accordions in a container
7. Add loading state handling (return null until data loaded)
8. Follow mint-accordions pattern (lg:hidden for mobile-only display)

---

## Related Code Files

**Files Created:**
- `src/modules/launch-pad/mint-nft/components/collection-info-section.tsx`

**Files Modified:**
- `src/modules/launch-pad/mint-nft/components/collection-utility-accordion.tsx` - fixed import to use collection-info.types

---

## Success Criteria

- [x] Component renders without errors
- [x] Both accordions display
- [x] Data loads from faker correctly
- [x] TypeScript compiles
- [x] Follows code standards

---

## Risk Assessment

**Risk**: Minimal - simple composition

**Mitigation**: Follow mint-accordions pattern

---

## Security Considerations

None - mock data only

---

## Next Steps

After completion → Phase 06: Integrate into collection-media-showcase
