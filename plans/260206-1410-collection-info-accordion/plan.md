# Implementation Plan: Collection Info Accordion Components

**Status**: pending
**Created**: 2026-02-06
**Branch**: `feature/improve-launch-pad-panel`
**Related Brainstorm**: `plans/reports/brainstorm-260206-collection-info-accordion.md`

---

## Overview

Convert Mantine-based HTML accordion content from `info.txt` into React components using shadcn/ui Accordion for the Launch Pad mint-nft module.

### Scope

- Create data types for collection overview and utility content
- Extend `collectionFaker` with new faker methods
- Create two accordion components (Overview, Utility)
- Create wrapper component that uses faker data
- Integrate into `collection-media-showcase.tsx`

### Out of Scope

- Backend API integration (data is faker-based for now)
- Animations beyond shadcn defaults
- Responsive design beyond existing patterns

---

## Phase Status

| Phase | Status |
|-------|--------|
| [Phase 01: Data Types](./phase-01-data-types.md) | pending |
| [Phase 02: Faker Methods](./phase-02-faker-methods.md) | pending |
| [Phase 03: Overview Accordion](./phase-03-overview-accordion.md) | pending |
| [Phase 04: Utility Accordion](./phase-04-utility-accordion.md) | pending |
| [Phase 05: Info Section Wrapper](./phase-05-info-section-wrapper.md) | pending |
| [Phase 06: Integration](./phase-06-integration.md) | pending |

---

## Architecture

```
src/modules/launch-pad/mint-nft/components/
├── collection-overview-accordion.tsx     # Phase 03
├── collection-utility-accordion.tsx      # Phase 04
└── collection-info-section.tsx           # Phase 05

src/shared/types/
└── collection-info.types.ts              # Phase 01

src/shared/utils/mock/fakers/
└── collection-info.faker.ts              # Phase 02
```

### Component Flow

```
collection-media-showcase.tsx
    |
    v
collection-info-section.tsx (wrapper)
    |
    +-- collectionFaker.collectionOverview()
    |       |
    |       v
    +-- collection-overview-accordion.tsx
    |
    +-- collectionFaker.collectionUtility()
            |
            v
            collection-utility-accordion.tsx
```

---

## Key Design Decisions

### 1. Two Separate Accordion Components
**Rationale**: Single responsibility, easier to maintain, matches user's "two accordions" requirement.

### 2. Props-Based with Faker Data
**Rationale**: Reusable for different collections, testable, follows existing patterns.

### 3. Visual Matching Over Pure shadcn
**Rationale**: User explicitly requested matching original HTML appearance. Will use custom CSS overrides.

### 4. Type Safety First
**Rationale**: Project uses TypeScript strict mode. All data structures will have proper types.

---

## Dependencies

- `@/shared/components/ui/accordion` - shadcn accordion component
- `@/shared/utils/mock/fakers/collection.faker` - existing faker patterns
- `@/shared/utils/tailwind-utils` - `cn()` utility

---

## Success Criteria

1. TypeScript compiles without errors
2. Two functional accordions render correctly
3. Visual appearance matches original HTML (spacing, colors, typography)
4. Content comes from faker via props
5. ESLint passes
6. Integration works in `collection-media-showcase.tsx`

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Visual mismatch due to Mantine → shadcn differences | MEDIUM | Use CSS overrides for critical styles |
| Data structure over-engineering | LOW | Keep types simple, match HTML structure |
| File proliferation | LOW | Only 3 new component files |

---

## Next Steps

1. Execute Phase 01: Define data types
2. Execute Phase 02: Implement faker methods
3. Execute Phase 03-05: Build components
4. Execute Phase 06: Integrate and test

---

## Context Links

- **Brainstorm Report**: `plans/reports/brainstorm-260206-collection-info-accordion.md`
- **Target Component**: `src/modules/launch-pad/mint-nft/components/collection-media-showcase.tsx`
- **Reference Component**: `src/modules/launch-pad/mint-nft/components/mint-accordions.tsx`
- **shadcn Accordion**: `src/shared/components/ui/accordion.tsx`
