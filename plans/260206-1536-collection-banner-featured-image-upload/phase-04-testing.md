---
title: "Phase 04: Testing"
description: "Test and verify banner and featured image upload implementation"
status: completed
priority: P2
effort: 30m
completed: 2026-02-06
---

## Overview

Test the complete flow of uploading banner and featured images through the collection creation form.

## Context Links

- Parent: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-update-form-types.md), [Phase 02](./phase-02-update-upload-hook.md), [Phase 03](./phase-03-update-form-component.md)

## Requirements

### Functional Requirements

1. Form accepts all 3 image uploads
2. Images upload to ImageKit successfully
3. URLs passed to GraphQL mutation correctly
4. Database saves all 3 image URLs

### Non-Functional Requirements

- TypeScript compiles
- ESLint passes
- No runtime errors

## Test Cases

### UI Tests

| Test | Steps | Expected |
|------|-------|----------|
| Banner upload visible | Navigate to create collection form | Banner Image field appears after Collection Image |
| Featured upload visible | Scroll down form | Featured Image field appears after Banner Image |
| Preview - banner | Upload banner image | Image preview shows in wide container |
| Preview - featured | Upload featured image | Image preview shows in 3:2 container |
| Remove button | Click X on preview | Field clears, input resets |
| File info | Upload image | File name and size display |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Upload all 3 | Upload collection, banner, featured | All 3 upload to ImageKit |
| Upload banner only | Skip collection/featured | Only banner uploads, others undefined |
| Form submission | Submit with all 3 images | All 3 URLs in GraphQL payload |
| Database save | Check created collection | imageUrl, bannerUrl, featuredImageUrl all saved |

### Edge Cases

| Test | Steps | Expected |
|------|-------|----------|
| No images | Submit without any images | Form submits (all optional) |
| Large file | Upload 10MB image | File uploads or shows size error |
| Invalid type | Try uploading PDF | File input rejects or validation catches |

## Todo List

- [ ] Run `pnpm typecheck` - verify TypeScript
- [ ] Run `pnpm lint` - verify code quality
- [ ] Run `pnpm dev` - start dev server
- [ ] Manual test: Upload banner image
- [ ] Manual test: Upload featured image
- [ ] Manual test: Submit form with all 3 images
- [ ] Verify database has all 3 URLs

## Success Criteria

- All 3 upload fields functional
- Images upload to ImageKit + IPFS
- URLs saved to database via GraphQL
- Form validation works
- No TypeScript errors
- No ESLint errors
