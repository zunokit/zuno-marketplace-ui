---
title: "Phase 08: UI + SDK Integration"
description: "Connect UI with SDK and API for end-to-end collection creation"
status: pending
priority: P0
effort: 16-20h
dependencies: ["Phase 04", "Phase 05"]
---

# Phase 08: UI + SDK Integration

## Project
zuno-marketplace-ui (uses SDK and API)

## Overview
Complete integration: form → SDK → blockchain → API updates.

## 5-Step Flow

```
Step 1: Upload Media → Metadata service (IPFS)
Step 2: Create DB Record → GraphQL mutation
Step 3: Add Allowlist → GraphQL mutation
Step 4: Deploy Contract → SDK
Step 5: Update DB → GraphQL mutation
```

## Hook Integration

```typescript
// useCreateCollection.ts
export function useCreateCollection() {
  const sdk = useCollection();
  const [createCollection] = useCreateCollectionMutation();
  const [updateCollection] = useUpdateCollectionMutation();

  const submit = async (formData: MintTerminalCreateForm) => {
    // Step 1: Upload
    const imageUrl = await uploadToIPFS(formData.collectionImage);

    // Step 2: Create DB
    const { data } = await createCollection({ variables: { input } });
    const collectionId = data.createCollection.id;

    // Step 3: Allowlist (optional)
    if (formData.allowlist?.length) {
      await addToAllowlist({ variables: { collectionId, addresses } });
    }

    // Step 4: Deploy via SDK
    const { address } = await sdk.createERC721.mutateAsync(params);

    // Step 5: Update DB
    await updateCollection({
      variables: {
        id: collectionId,
        input: { contractAddress: address, status: 'DEPLOYED' }
      }
    });
  };
}
```

## Error Recovery

```typescript
const retry = async () => {
  switch (failedStep) {
    case 'UPLOAD_MEDIA':
      return retryUpload();
    case 'DEPLOY_CONTRACT':
      return retryDeploy();
    // ...
  }
};
```

## Files

| File | Purpose |
|------|---------|
| hooks/useCreateCollection.ts | Main hook |
| components/CreateCollectionForm.tsx | Form UI |
| components/CreationProgress.tsx | Progress indicator |

## Cross-Project Calls

| UI → | Project | Endpoint |
|------|---------|----------|
| Upload image | metadata | POST /api/upload |
| Create collection | api | GraphQL mutation |
| Deploy contract | sdk | CollectionModule |
| Update status | api | GraphQL mutation |

## Success Criteria
- [ ] End-to-end flow working
- [ ] Error recovery functional
- [ ] Progress indicator accurate
- [ ] State persists on refresh
- [ ] All 5 steps complete successfully
