# Brainstorm Report: Collection Info Accordion Component

**Date**: 2026-02-06
**Task**: Convert info.txt HTML to shadcn accordion components for collection-media-showcase.tsx

---

## Problem Statement

Convert Mantine-based HTML accordion content from `info.txt` into React components using shadcn/ui Accordion, to be integrated into `collection-media-showcase.tsx`.

---

## Requirements (User Confirmed)

1. **Layout**: Multiple accordions (not single collapsible)
2. **Data Source**: Props-based with faker data support
3. **Styling Priority**: Match original HTML visual appearance
4. **Structure**: Two accordions - "Overview" and "Utility"

---

## Content Analysis

**Original HTML Structure:**
```
- Accordion Item 1 ("Overview")
  - Description paragraph
  - "The Role of Pilots in Gameplay" section
  - 3-item ordered list
  - "RPG Progression & Custom Builds" section
  - 3-item ordered list
  - "Flexible Usage & Team Play" section
  - 3-item ordered list
  - "The Meta Racing Ecosystem" paragraph
  - "Utility" subsection (heading)
  - 8-item ordered list with bold labels
```

**Proposed Split:**
- **Accordion 1**: "Overview" - All descriptive content through "The Meta Racing Ecosystem"
- **Accordion 2**: "Utility" - The utility list items (8 items)

---

## Evaluated Approaches

### Approach 1: Single Component with Hardcoded Content ❌

**Pros:**
- Simplest implementation
- No prop complexity

**Cons:**
- Not reusable (violates user requirement for props-based)
- Hard to maintain
- Can't use faker data

---

### Approach 2: Two Separate Components ✅ **RECOMMENDED**

Create two distinct accordion components:
- `CollectionOverviewAccordion` - Overview content
- `CollectionUtilityAccordion` - Utility list

**Pros:**
- Clean separation of concerns
- Each component focused on single responsibility
- Easier to maintain and test
- Matches "two accordions" requirement
- Can use faker for data

**Cons:**
- More files (but justified by separation)

**Structure:**
```
src/modules/launch-pad/mint-nft/components/
├── collection-overview-accordion.tsx    (Overview accordion)
├── collection-utility-accordion.tsx     (Utility accordion)
└── collection-info-section.tsx          (Wrapper that combines both)
```

---

### Approach 3: Single Dynamic Component with Props ⚠️

**Pros:**
- Most reusable
- Single file

**Cons:**
- Complex prop types (content is structured, not flat)
- Harder to match exact HTML styling
- Over-engineered for two accordions

---

## Recommended Solution: Approach 2

### Component Architecture

```typescript
// Data types
interface UtilityItem {
  label: string;
  description: string;
}

interface CollectionOverviewData {
  description: string;
  roleInGameplay: {
    title: string;
    items: string[];
  };
  rpgProgression: {
    title: string;
    items: string[];
  };
  flexibleUsage: {
    title: string;
    items: string[];
  };
  ecosystem: string;
}

interface CollectionUtilityData {
  title: string;
  items: UtilityItem[];
}

// Components
- CollectionOverviewAccordion(data: CollectionOverviewData)
- CollectionUtilityAccordion(data: CollectionUtilityData)
- CollectionInfoSection() // Wrapper using faker
```

### Implementation Considerations

**Visual Matching Strategy:**
1. Use shadcn Accordion as base
2. Override styles to match Mantine appearance:
   - `!border-primary` → border styling
   - `!bg-transparent` → background
   - `text-brand` for highlighted text
   - Custom chevron rotation
   - Specific padding/margins from HTML

**Key CSS Classes to Replicate:**
```css
/* From original HTML */
.mantine-Accordion-item
  - !border-primary text !bg-transparent !border-0

.mantine-Accordion-control
  - hover:bg-transparent pl-5

.mantine-Accordion-chevron
  - rotate-180 when active

.mantine-Accordion-label
  - text-xl font-bold text-wrap

.text-secondary
  - For content text

.text-brand
  - For highlighted labels (bold)
```

**Data Structure from Faker:**
```typescript
// Extend collectionFaker with:
collectionFaker.collectionOverview() -> CollectionOverviewData
collectionFaker.collectionUtility() -> CollectionUtilityData
```

---

## Integration Point

In `collection-media-showcase.tsx`:
```tsx
// Replace:
{/* The info in here */}

// With:
<CollectionInfoSection />
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Visual mismatch due to Mantine → shadcn differences | MEDIUM | Use custom CSS overrides for critical styles |
| Over-engineering data structure | LOW | Keep types simple, match HTML structure |
| Too many files for simple content | LOW | Only 3 files, justified by separation |

---

## Success Criteria

1. Two functional accordions using shadcn
2. Visual appearance matches original HTML (colors, spacing, typography)
3. Content comes from faker via props
4. Clean integration into collection-media-showcase.tsx
5. Follows project code standards (kebab-case, TypeScript strict)

---

## Next Steps

1. Create data types for overview and utility content
2. Extend `collectionFaker` with `collectionOverview()` and `collectionUtility()` methods
3. Implement `CollectionOverviewAccordion` component
4. Implement `CollectionUtilityAccordion` component
5. Create `CollectionInfoSection` wrapper
6. Integrate into `collection-media-showcase.tsx`
7. Test visual appearance matches original

---

## Implementation Order

1. **Data Layer**: Types + faker methods
2. **Components**: Overview accordion → Utility accordion → Wrapper
3. **Integration**: Add to collection-media-showcase.tsx
4. **Testing**: Visual verification + TypeScript compilation

---

*End of brainstorm report*
