---
title: "Collection Banner & Featured Image Upload"
description: "Add banner and featured image upload fields to collection creation form"
status: completed
priority: P2
effort: 2h
branch: feat/collection-banner-featured-image-upload
tags: [launchpad, collection, upload, images]
created: 2026-02-06
completed: 2026-02-06
---

## Overview

Add Banner Image and Featured Image upload fields to the collection creation form. Backend API and upload infrastructure (ImageKit + IPFS) already support these fields.

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| [Phase 01](./phase-01-update-form-types.md) | completed | Update form types and validation schemas |
| [Phase 02](./phase-02-update-upload-hook.md) | completed | Modify upload hook to handle 3 images |
| [Phase 03](./phase-03-update-form-component.md) | completed | Add UI components for banner/featured image upload |
| [Phase 04](./phase-04-testing.md) | completed | Test and verify implementation |

## Key Requirements

- Banner Image: Recommended 1500x500px (wide banner format)
- Featured Image: Recommended 1200x800px (featured showcase format)
- Collection Image: Existing field (800x800px)
- All images upload via ImageKit + IPFS pinning
- GraphQL API accepts `imageUrl`, `bannerUrl`, `featuredImageUrl`

## Files Modified

| File | Type | Changes |
|------|------|---------|
| `src/shared/types/mint.ts` | types | Added `bannerImage`, `featuredImage` File fields |
| `src/modules/launch-pad/create-form/hooks/use-create-collection.ts` | hook | Updated `uploadMedia()` to upload 3 images |
| `src/modules/launch-pad/create-form/components/collection-details.tsx` | component | Added 2 new upload fields |
| `src/modules/launch-pad/mint-nft/components/mint-stages-list.tsx` | component | Updated progress stages display |

## Success Criteria

- [x] All 3 image upload fields functional (collection, banner, featured)
- [x] Images upload to ImageKit + IPFS successfully
- [x] URLs saved to database via GraphQL mutation
- [x] Form validation works for new fields
- [x] UI follows existing upload component patterns
- [x] TypeScript compiles without errors
- [x] ESLint passes

## Implementation Results

**Code Review:** Approved (9/10)
- Clean implementation following existing patterns
- Proper TypeScript typing
- Good separation of concerns
- Comprehensive error handling

**Testing:** All passing
- TypeScript compilation: Clean
- ESLint: No new issues
- Form validation: Working
- Upload functionality: Functional

**Branch Status:** Ready for merge
- All phases completed
- No open blockers
- Documentation updated

## Dependencies

- None (backend ready)
