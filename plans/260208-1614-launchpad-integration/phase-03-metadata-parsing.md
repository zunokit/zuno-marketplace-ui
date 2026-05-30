---
title: "Phase 3: Metadata Parsing for Accordions"
description: "Parse settings_json field from collection metadata to populate Overview and Utility accordions"
phase: 3
status: completed
priority: Medium
dependencies: ["phase-02-graphql-integration"]
---

# Phase 3: Metadata Parsing for Accordions

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [Phase 2: GraphQL Integration](./phase-02-graphql-integration.md)
- Next Phase: [Phase 4: SDK Mint Integration](./phase-04-mint-integration.md)
- Accordion Components: `src/modules/launch-pad/mint-nft/components/collection-overview-accordion.tsx`
- Utility Accordion: `src/modules/launch-pad/mint-nft/components/collection-utility-accordion.tsx`
- Types: `src/shared/types/collection-info.types.ts`

## Overview

| Field | Value |
|-------|-------|
| **Priority** | Medium |
| **Status** | Completed |
| **Description** | Parse `settings_json` field from collection metadata to populate Overview and Utility accordions |
| **Estimated Effort** | 3-4 hours |

## Key Insights

- Collection metadata structure exists but `settings_json` field not in current GraphQL schema
- Accordion components expect `CollectionOverviewData` and `CollectionUtilityData` types
- Need to either: (1) Add settings_json to API, or (2) Parse from description field temporarily
- Current types expect specific structure: description, roleInGameplay, rpgProgression, etc.
- API has `settings_json` JSONB column in database but not exposed in GraphQL

## Requirements

### Functional Requirements
- Parse rich metadata for Overview accordion
- Parse utility items for Utility accordion
- Handle missing/invalid metadata gracefully
- Type-safe parsing with validation
- Support fallback when metadata is missing

### Non-Functional Requirements
- Use Zod for schema validation
- Maintain TypeScript strict mode
- Keep parser utility testable
- Handle malformed JSON gracefully

## Architecture

```
Collection Metadata (from API)
├── description (basic)
└── settings_json (rich content - NEW FIELD)
    ├── overview
    │   ├── description
    │   ├── roleInGameplay { title, items[] }
    │   ├── rpgProgression { title, items[] }
    │   ├── flexibleUsage { title, items[] }
    │   └── ecosystem
    └── utility
        ├── title
        └── items[] { label, description }
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/shared/types/collection.ts` | Add settings_json type |
| `src/shared/graphql/hooks.generated.ts` | Add to query (regenerate) |
| `src/modules/launch-pad/mint-nft/components/collection-info-section.tsx` | Use parser |
| `src/modules/launch-pad/mint-nft/components/collection-overview-accordion.tsx` | Update props |
| `src/modules/launch-pad/mint-nft/components/collection-utility-accordion.tsx` | Update props |

### Files to Create
| File | Purpose |
|------|---------|
| `src/modules/launch-pad/mint-nft/utils/parse-collection-metadata.ts` | Parser utility |
| `src/modules/launch-pad/mint-nft/types/metadata.types.ts` | Metadata types |

## Implementation Steps

1. **Add settings_json to GraphQL schema (API change)**
   - Coordinate with backend team
   - Add `settingsJson` field to Collection type
   - Regenerate GraphQL hooks

2. **Create metadata parser utility**
   - Define Zod schema for validation
   - Parse settings_json into typed structure
   - Handle missing/invalid data gracefully

3. **Create metadata types**
   - Define TypeScript types for parsed metadata
   - Export for use in components

4. **Update CollectionInfoSection**
   - Import parser utility
   - Parse metadata on component mount
   - Pass parsed data to accordion components

5. **Update accordion components**
   - Update props to accept parsed metadata
   - Render content from metadata
   - Handle missing sections gracefully

6. **Add fallback UI**
   - Show default message when metadata missing
   - Display description as fallback for overview

## Todo List

- [x] Coordinate API change to add settings_json field
- [x] Regenerate GraphQL hooks with new field
- [x] Create metadata parser utility with Zod validation
- [x] Create metadata types file
- [x] Update CollectionInfoSection to use parser
- [x] Update CollectionOverviewAccordion props
- [x] Update CollectionUtilityAccordion props
- [x] Implement fallback UI for missing metadata
- [x] Add tests for parser utility
- [x] Handle malformed JSON gracefully

## Success Criteria

- [x] Accordion content renders from settings_json
- [x] Invalid JSON handled gracefully
- [x] Missing metadata shows default/fallback content
- [x] Type-safe parsing with Zod
- [x] No console errors from parsing
- [x] Accordion sections display correctly

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| API change not ready | High | Medium | Implement fallback using description field |
| Invalid JSON in database | Medium | Low | Add validation and error handling |
| Schema changes | Low | Low | Use Zod for flexible validation |

## Security Considerations

- Validate JSON structure before parsing
- Sanitize HTML content if present
- Prevent XSS in accordion content
- Do not execute any code from metadata

## Code Snippets

### Metadata Schema (Zod)
```typescript
// src/modules/launch-pad/mint-nft/types/metadata.types.ts
import { z } from "zod";

export const overviewSectionSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

export const collectionMetadataSchema = z.object({
  overview: z.object({
    description: z.string().optional(),
    roleInGameplay: overviewSectionSchema.optional(),
    rpgProgression: overviewSectionSchema.optional(),
    flexibleUsage: overviewSectionSchema.optional(),
    ecosystem: z.string().optional(),
  }).optional(),
  utility: z.object({
    title: z.string(),
    items: z.array(z.object({
      label: z.string(),
      description: z.string(),
    })),
  }).optional(),
});

export type CollectionMetadata = z.infer<typeof collectionMetadataSchema>;
```

### Parser Utility
```typescript
// src/modules/launch-pad/mint-nft/utils/parse-collection-metadata.ts
import { collectionMetadataSchema } from "../types/metadata.types";

export function parseCollectionMetadata(settingsJson: unknown) {
  if (!settingsJson) {
    return null;
  }

  try {
    const result = collectionMetadataSchema.safeParse(settingsJson);
    if (result.success) {
      return result.data;
    }
    console.warn("Invalid metadata format:", result.error);
    return null;
  } catch (error) {
    console.error("Failed to parse metadata:", error);
    return null;
  }
}
```

### Updated CollectionInfoSection
```typescript
// src/modules/launch-pad/mint-nft/components/collection-info-section.tsx
import { parseCollectionMetadata } from "../utils/parse-collection-metadata";

interface CollectionInfoSectionProps {
  settingsJson?: unknown;
  description?: string;
}

export function CollectionInfoSection({ settingsJson, description }: CollectionInfoSectionProps) {
  const metadata = parseCollectionMetadata(settingsJson);

  const overviewData = metadata?.overview || {
    description: description || "No description available",
  };

  return (
    <>
      <CollectionOverviewAccordion data={overviewData} />
      {metadata?.utility && (
        <CollectionUtilityAccordion data={metadata.utility} />
      )}
    </>
  );
}
```

## Next Steps

After completing this phase:
1. Proceed to [Phase 4: SDK Mint Integration](./phase-04-mint-integration.md)
2. Accordions will display rich content from API
3. Ready to integrate minting functionality

## Unresolved Questions

1. Should the rich content be editable via existing `updateCollection` mutation?
2. Is there a need for validation on utility accordion structure?
3. Should overview support markdown, HTML, or plain text only?
4. Does UI need real-time preview requiring specific query structure?
