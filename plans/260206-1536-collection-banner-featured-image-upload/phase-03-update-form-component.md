---
title: "Phase 03: Update Form Component"
description: "Add Banner Image and Featured Image upload UI components"
status: completed
priority: P2
effort: 45m
completed: 2026-02-06
---

## Overview

Add Banner Image and Featured Image upload fields to `collection-details.tsx` following the existing `collectionImage` upload pattern.

## Context Links

- Parent: [plan.md](./plan.md)
- Related: `src/modules/launch-pad/create-form/components/collection-details.tsx`
- Depends on: [Phase 01](./phase-01-update-form-types.md)

## Requirements

### Functional Requirements

1. Add Banner Image upload field after Collection Image
2. Add Featured Image upload field after Banner Image
3. Each field shows: preview, remove button, file name, size
4. Recommended dimensions displayed for each

### Non-Functional Requirements

- Follow existing upload component pattern
- Consistent styling with collection image field
- Responsive design
- Skeleton loading during submit

## Related Code Files

| File | Action |
|------|--------|
| `src/modules/launch-pad/create-form/components/collection-details.tsx` | Modify |

## Implementation Steps

### 1. Add Banner Image Field (after line ~239)

```tsx
{/* Banner Image */}
<div>
  <Label className="text-foreground">Banner Image</Label>
  <p className="text-sm text-foreground dark:text-os-gray-300 mt-1">
    Wide banner for collection page header. Recommended: 1500x500px jpg
  </p>
  {formState.isSubmitting ? (
    <Skeleton className="h-40 w-full mt-1" />
  ) : (
    <FormField
      name="bannerImage"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormControl>
            <div className="border border-dashed border-border-subtle dark:border-border-subtle rounded-[6px] p-6 flex flex-col items-center justify-center bg-secondary dark:bg-transparent mt-2">
              <input
                type="file"
                id="banner-image"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={e => {
                  const file = e.target.files?.[0];
                  onChange(file || null);
                }}
                {...field}
              />

              {value ? (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full h-32 mb-2">
                    <Image
                      src={
                        value instanceof File
                          ? URL.createObjectURL(value)
                          : "/placeholder.svg"
                      }
                      alt="Banner preview"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-[6px]"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-destructive rounded-full p-1"
                      onClick={e => {
                        e.preventDefault();
                        onChange(null);
                        const input = document.getElementById("banner-image") as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      <X className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                  <p className="text-sm text-foreground dark:text-os-gray-300 mt-2">
                    {value?.name}
                  </p>
                  <p className="text-xs text-os-gray-300 dark:text-os-gray-300">
                    {value && (value.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-2 text-os-gray-300" />
                  <p className="text-sm text-center text-foreground dark:text-os-gray-300">
                    Drop your banner here
                    <br />
                    to upload
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-background dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground hover:bg-muted dark:hover:bg-hover"
                    onClick={e => {
                      e.preventDefault();
                      document.getElementById("banner-image")?.click();
                    }}
                  >
                    Choose Image...
                  </Button>
                </>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  )}
</div>
```

### 2. Add Featured Image Field (after Banner Image)

```tsx
{/* Featured Image */}
<div>
  <Label className="text-foreground">Featured Image</Label>
  <p className="text-sm text-foreground dark:text-os-gray-300 mt-1">
    Highlighted image for featured sections. Recommended: 1200x800px jpg
  </p>
  {formState.isSubmitting ? (
    <Skeleton className="h-40 w-full mt-1" />
  ) : (
    <FormField
      name="featuredImage"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormControl>
            <div className="border border-dashed border-border-subtle dark:border-border-subtle rounded-[6px] p-6 flex flex-col items-center justify-center bg-secondary dark:bg-transparent mt-2">
              <input
                type="file"
                id="featured-image"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={e => {
                  const file = e.target.files?.[0];
                  onChange(file || null);
                }}
                {...field}
              />

              {value ? (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-48 h-32 mb-2">
                    <Image
                      src={
                        value instanceof File
                          ? URL.createObjectURL(value)
                          : "/placeholder.svg"
                      }
                      alt="Featured preview"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-[6px]"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-destructive rounded-full p-1"
                      onClick={e => {
                        e.preventDefault();
                        onChange(null);
                        const input = document.getElementById("featured-image") as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      <X className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                  <p className="text-sm text-foreground dark:text-os-gray-300 mt-2">
                    {value?.name}
                  </p>
                  <p className="text-xs text-os-gray-300 dark:text-os-gray-300">
                    {value && (value.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-2 text-os-gray-300" />
                  <p className="text-sm text-center text-foreground dark:text-os-gray-300">
                    Drop your featured image here
                    <br />
                    to upload
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-background dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground hover:bg-muted dark:hover:bg-hover"
                    onClick={e => {
                      e.preventDefault();
                      document.getElementById("featured-image")?.click();
                    }}
                  >
                    Choose Image...
                  </Button>
                </>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  )}
</div>
```

## Todo List

- [ ] Add Banner Image upload field
- [ ] Add Featured Image upload field
- [ ] Verify preview displays correctly
- [ ] Verify remove buttons work
- [ ] Run `pnpm typecheck` and `pnpm lint`

## Success Criteria

- Both upload fields render correctly
- Preview shows for uploaded images
- Remove button clears the field
- File name and size display
- Recommended dimensions shown
- Matches existing Collection Image styling
