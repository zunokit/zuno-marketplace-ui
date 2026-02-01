---
title: "Phase 07: Metadata Service"
description: "IPFS upload service for collection images"
status: pending
priority: P1
effort: 6-8h
dependencies: []
---

# Phase 07: Metadata Service

## Project
zuno-marketplace-metadata

## Overview
Handle image uploads to IPFS via Pinata or similar service.

## API Endpoint

```typescript
// app/api/upload/route.ts
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  // Upload to IPFS
  const result = await pinata.upload.file(file);

  return Response.json({
    url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    ipfsHash: result.IpfsHash
  });
}
```

## Files

| File | Purpose |
|------|---------|
| app/api/upload/route.ts | Upload endpoint |
| lib/pinata.ts | Pinata client |
| lib/ipfs.ts | IPFS utilities |

## Success Criteria
- [ ] Image upload working
- [ ] IPFS hash returned
- [ ] Gateway URL accessible
