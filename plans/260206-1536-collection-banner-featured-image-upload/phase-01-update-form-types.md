---
title: "Phase 01: Update Form Types"
description: "Add bannerImage and featuredImage fields to form types and validation"
status: completed
priority: P2
effort: 30m
completed: 2026-02-06
---

## Overview

Add `bannerImage` and `featuredImage` File fields to `MintTerminalCreateFormSchema` in the mint types file.

## Context Links

- Parent: [plan.md](./plan.md)
- Related: `src/shared/types/mint.ts`

## Requirements

### Functional Requirements

1. Add `bannerImage?: File` field to schema (optional)
2. Add `featuredImage?: File` field to schema (optional)
3. Apply same `FileSchema` validation as `collectionImage`

### Non-Functional Requirements

- TypeScript strict mode compliance
- Optional fields (not required for form submission)

## Related Code Files

| File | Action |
|------|--------|
| `src/shared/types/mint.ts` | Modify |

## Implementation Steps

1. Open `src/shared/types/mint.ts`
2. Locate `MintTerminalCreateFormSchema` (line ~117)
3. Add new fields after `collectionImage` (line ~123):

```typescript
bannerImage: FileSchema.optional(), // Banner image: 1500x500px recommended
featuredImage: FileSchema.optional(), // Featured image: 1200x800px recommended
```

4. Verify `MintTerminalCreateForm` type includes new fields (auto-inferred)

## Todo List

- [ ] Add `bannerImage` field to schema
- [ ] Add `featuredImage` field to schema
- [ ] Run `pnpm typecheck` to verify

## Success Criteria

- TypeScript compiles without errors
- Form type includes `bannerImage?: File`
- Form type includes `featuredImage?: File`
