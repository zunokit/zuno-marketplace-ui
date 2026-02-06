---
title: "Phase 02: Update Upload Hook"
description: "Modify useCreateCollection hook to upload all 3 images"
status: completed
priority: P2
effort: 45m
completed: 2026-02-06
---

## Overview

Update `uploadMedia()` function in `useCreateCollection` hook to upload banner and featured images in addition to collection image.

## Context Links

- Parent: [plan.md](./plan.md)
- Related: `src/modules/launch-pad/create-form/hooks/use-create-collection.ts`
- Depends on: [Phase 01](./phase-01-update-form-types.md)

## Requirements

### Functional Requirements

1. Upload `bannerImage` if present, return `bannerUrl`
2. Upload `featuredImage` if present, return `featuredImageUrl`
3. Return all 3 URLs from `uploadMedia()`
4. Pass `featuredImageUrl` to `createDbRecord()` GraphQL mutation

### Non-Functional Requirements

- Parallel uploads for performance
- Handle missing images gracefully
- Type safety for all return values

## Related Code Files

| File | Action |
|------|--------|
| `src/modules/launch-pad/create-form/hooks/use-create-collection.ts` | Modify |

## Implementation Steps

1. Update `uploadMedia()` return type (line ~80):

```typescript
// Before:
return { imageUrl, bannerUrl: undefined };

// After:
return {
  imageUrl: mediaResult?.imageUrl,
  bannerUrl: mediaResult?.bannerUrl,
  featuredImageUrl: mediaResult?.featuredImageUrl,
};
```

2. Implement parallel upload logic:

```typescript
const uploadMedia = useCallback(
  async (formData: MintTerminalCreateForm) => {
    const uploads: Promise<string | undefined>[] = [];

    if (formData.collectionImage) {
      uploads.push(uploadFile(formData.collectionImage));
    } else {
      uploads.push(Promise.resolve(undefined));
    }

    if (formData.bannerImage) {
      uploads.push(uploadFile(formData.bannerImage));
    } else {
      uploads.push(Promise.resolve(undefined));
    }

    if (formData.featuredImage) {
      uploads.push(uploadFile(formData.featuredImage));
    } else {
      uploads.push(Promise.resolve(undefined));
    }

    const [imageUrl, bannerUrl, featuredImageUrl] = await Promise.all(uploads);

    return { imageUrl, bannerUrl, featuredImageUrl };
  },
  [uploadFile]
);
```

3. Update `createDbRecord()` to accept `featuredImageUrl`:

```typescript
async (formData: MintTerminalCreateForm, imageUrl?: string, bannerUrl?: string, featuredImageUrl?: string) => {
  // ... existing code ...
  const input: CreateCollectionInput = {
    // ... existing fields ...
    imageUrl: imageUrl || "",
    bannerUrl,
    featuredImageUrl, // ADD THIS
    // ... rest of fields ...
  };
}
```

4. Update `uploadMedia()` call in `submit()`:

```typescript
const mediaResult = await uploadMedia(formData);
const imageUrl = mediaResult?.imageUrl;
const bannerUrl = mediaResult?.bannerUrl;
const featuredImageUrl = mediaResult?.featuredImageUrl; // ADD THIS
```

5. Update `createDbRecord()` call:

```typescript
const collectionId = await createDbRecord(formData, imageUrl, bannerUrl, featuredImageUrl);
```

## Todo List

- [ ] Update `uploadMedia()` to upload all 3 images in parallel
- [ ] Update `uploadMedia()` return type
- [ ] Update `createDbRecord()` signature to accept `featuredImageUrl`
- [ ] Add `featuredImageUrl` to GraphQL mutation input
- [ ] Update `submit()` to pass all 3 URLs
- [ ] Run `pnpm typecheck` to verify

## Success Criteria

- All 3 images upload in parallel
- `featuredImageUrl` passed to GraphQL mutation
- TypeScript compiles without errors
