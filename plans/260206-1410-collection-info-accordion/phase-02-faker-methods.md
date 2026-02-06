# Phase 02: Faker Methods

**Status**: pending
**Priority**: HIGH
**Effort**: 45 minutes
**Blocked By**: Phase 01

---

## Overview

Extend `collectionFaker` with methods to generate mock data for collection overview and utility content.

---

## Context Links

- **Existing Faker**: `src/shared/utils/mock/fakers/collection.faker.ts`
- **Types**: `src/shared/types/collection-info.types.ts` (from Phase 01)
- **Faker Instance**: `src/shared/utils/mock/faker-instance.ts`

---

## Requirements

### Functional Requirements
1. Create `collectionOverview()` method in collectionFaker
2. Create `collectionUtility()` method in collectionFaker
3. Generate realistic content matching the Meta Racing Pilots theme
4. Support deterministic data generation via seed

### Non-Functional Requirements
1. Follow existing faker patterns
2. Use the shared faker instance
3. Proper TypeScript types

---

## Architecture

### Extend: `src/shared/utils/mock/fakers/collection.faker.ts`

```typescript
import { faker } from "../faker-instance";
import type { CollectionOverviewData, CollectionUtilityData } from "@/shared/types/collection-info";

/**
 * Generate overview section with list items
 */
function overviewSection(title: string, itemCount: number = 3): OverviewSection {
  return {
    title,
    items: Array.from({ length: itemCount }, () => faker.lorem.sentence()),
  };
}

/**
 * Generate collection overview data
 * Content based on Meta Racing Pilots NFT collection
 */
function collectionOverview(): CollectionOverviewData {
  return {
    description: faker.lorem.paragraphs(2),
    roleInGameplay: overviewSection("The Role of Pilots in Gameplay", 3),
    rpgProgression: overviewSection("RPG Progression & Custom Builds", 3),
    flexibleUsage: overviewSection("Flexible Usage & Team Play", 3),
    ecosystem: faker.lorem.paragraph(),
  };
}

/**
 * Generate utility item with label and description
 */
function utilityItem(): UtilityItem {
  const labels = [
    "Necessary Gameplay Asset",
    "Performance Boosts",
    "RPG-Style Progression System",
    "Rarity-Based Progression Depth",
    "Team & Roster Building",
    "Passive Utility via Rental",
  ];
  return {
    label: faker.helpers.arrayElement(labels),
    description: faker.lorem.sentence(),
  };
}

/**
 * Generate collection utility data
 */
function collectionUtility(): CollectionUtilityData {
  return {
    title: "Utility",
    items: Array.from({ length: faker.number.int({ min: 5, max: 8 }) }, utilityItem),
  };
}

// Export in collectionFaker object
export const collectionFaker = {
  // ... existing exports
  collectionOverview,
  collectionUtility,
};
```

---

## Implementation Steps

1. Import types from `@/shared/types/collection-info.types.ts`
2. Create `overviewSection()` helper function
3. Create `collectionOverview()` method
4. Create `utilityItem()` helper function
5. Create `collectionUtility()` method
6. Add to `collectionFaker` export object
7. Verify TypeScript compilation

---

## Related Code Files

**Files to Modify:**
- `src/shared/utils/mock/fakers/collection.faker.ts`

**Files to Reference:**
- `src/shared/utils/mock/fakers/index.ts` - exports collectionFaker
- `src/shared/utils/mock/faker-instance.ts` - faker instance

---

## Success Criteria

- [ ] Methods generate valid `CollectionOverviewData`
- [ ] Methods generate valid `CollectionUtilityData`
- [ ] TypeScript compiles without errors
- [ ] Data structure matches types from Phase 01
- [ ] Faker instance is used (not direct import)

---

## Risk Assessment

**Risk**: Generated content not realistic enough
**Mitigation**: Use curated content arrays for labels/titles, faker for descriptions

---

## Security Considerations

None - mock data generation only

---

## Next Steps

After completion → Phase 03: Build overview accordion component
