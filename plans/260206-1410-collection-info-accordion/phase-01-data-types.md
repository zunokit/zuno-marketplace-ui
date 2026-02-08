# Phase 01: Data Types

**Status**: pending
**Priority**: HIGH
**Effort**: 30 minutes

---

## Overview

Define TypeScript interfaces for collection overview and utility content based on the HTML structure from `info.txt`.

---

## Context Links

- **Source HTML**: `info.txt` (root directory)
- **Related Types**: `src/shared/types/collection.ts`
- **Code Standards**: `docs/code-standards.md` (TypeScript Standards)

---

## Requirements

### Functional Requirements
1. Define types that match the HTML content structure
2. Support reusability across different collections
3. Follow TypeScript strict mode requirements

### Non-Functional Requirements
1. Proper type exports
2. Clear documentation via JSDoc comments
3. Follow existing type patterns in the codebase

---

## Architecture

### New File: `src/shared/types/collection-info.types.ts`

```typescript
/**
 * Collection info content types for accordion components
 * Based on Meta Racing Pilots NFT collection structure
 */

// ============================================================================
// Overview Section Types
// ============================================================================

/**
 * Ordered list items with title and description
 */
export interface OverviewSection {
  title: string;
  items: string[];
}

/**
 * Complete overview content data structure
 */
export interface CollectionOverviewData {
  /** Main description paragraph */
  description: string;

  /** Role in gameplay section */
  roleInGameplay: OverviewSection;

  /** RPG progression section */
  rpgProgression: OverviewSection;

  /** Flexible usage section */
  flexibleUsage: OverviewSection;

  /** Ecosystem description paragraph */
  ecosystem: string;
}

// ============================================================================
// Utility Section Types
// ============================================================================

/**
 * Individual utility item with label and description
 */
export interface UtilityItem {
  label: string;
  description: string;
}

/**
 * Complete utility content data structure
 */
export interface CollectionUtilityData {
  /** Section heading (default: "Utility") */
  title: string;

  /** List of utility items */
  items: UtilityItem[];
}

// ============================================================================
// Combined Types
// ============================================================================

/**
 * Props for overview accordion component
 */
export interface CollectionOverviewProps {
  data: CollectionOverviewData;
  className?: string;
}

/**
 * Props for utility accordion component
 */
export interface CollectionUtilityProps {
  data: CollectionUtilityData;
  className?: string;
}
```

---

## Implementation Steps

1. Create `src/shared/types/collection-info.types.ts`
2. Define `OverviewSection` interface
3. Define `CollectionOverviewData` interface
4. Define `UtilityItem` interface
5. Define `CollectionUtilityData` interface
6. Define component props interfaces
7. Add JSDoc comments for all exports
8. Export all types

---

## Related Code Files

**Files to Create:**
- `src/shared/types/collection-info.types.ts`

**Files to Modify:**
- `src/shared/types/index.ts` - add export for collection-info types

---

## Success Criteria

- [ ] TypeScript compiles without errors
- [ ] All types have proper JSDoc comments
- [ ] Types exported from index
- [ ] No implicit any types

---

## Risk Assessment

**Risk**: Type structure doesn't match actual usage
**Mitigation**: Keep types simple, iterate as needed during component implementation

---

## Security Considerations

None - pure type definitions, no runtime behavior

---

## Next Steps

After completion → Phase 02: Implement faker methods using these types
