---
title: "Phase 01: Error Handling Standards (All Projects)"
description: "Standardized error handling across UI, SDK, API, Indexer, Metadata, and Notifications"
status: pending
priority: P0
effort: 8-10h
dependencies: []
---

# Phase 01: Error Handling Standards

## Overview

Define consistent error handling patterns across ALL projects:
- zuno-marketplace-ui (TypeScript/React)
- zuno-marketplace-sdk (TypeScript)
- zuno-marketplace-api (Go)
- zuno-marketplace-indexer (TypeScript/Ponder)
- zuno-marketplace-metadata (TypeScript/Next.js)
- zuno-marketplace-notifications (TypeScript/Next.js)

## Cross-Project Error Contract

### Error Response Format (API → All Consumers)

```json
{
  "error": {
    "code": "COLLECTION_DEPLOYMENT_FAILED",
    "message": "Smart contract deployment failed",
    "step": "DEPLOY_CONTRACT",
    "recoverable": true,
    "project": "sdk",
    "context": {
      "chainId": 11155111,
      "attempt": 1
    }
  }
}
```

### Error Codes (Cross-Project)

| Code | Project | Description |
|------|---------|-------------|
| MEDIA_UPLOAD_FAILED | ui, metadata | Image upload error |
| DB_OPERATION_FAILED | api | Database error |
| CONTRACT_DEPLOYMENT_FAILED | sdk | Deployment error |
| INDEXING_FAILED | indexer | Event indexing error |
| NOTIFICATION_FAILED | notifications | Notification error |
| INSUFFICIENT_FUNDS | sdk | Gas estimation |

## UI Implementation

```typescript
// src/shared/errors/collection-errors.ts
export class CollectionError extends AppError {
  constructor(
    message: string,
    public code: string,
    public step: CreationStep,
    public recoverable: boolean,
    public project: 'ui' | 'sdk' | 'api' | 'indexer',
    public context?: Record<string, unknown>
  ) {
    super(message, code);
  }
}
```

## SDK Implementation

```typescript
// src/errors/CollectionError.ts
export class SDKCollectionError extends Error {
  code: string;
  step: string;
  recoverable: boolean;
  project = 'sdk';

  constructor(params: { code: string; message: string; step: string; recoverable: boolean }) {
    super(params.message);
    this.code = params.code;
    this.step = params.step;
    this.recoverable = params.recoverable;
  }
}
```

## API Implementation

```go
// errors/collection.go
package errors

type CollectionError struct {
    Code       string                 `json:"code"`
    Message    string                 `json:"message"`
    Step       string                 `json:"step"`
    Recoverable bool                  `json:"recoverable"`
    Project    string                 `json:"project"`
    Context    map[string]interface{} `json:"context,omitempty"`
}

func (e *CollectionError) Error() string {
    return e.Message
}
```

## Files to Modify

| Project | Files |
|---------|-------|
| ui | src/shared/errors/collection-errors.ts |
| sdk | src/errors/CollectionError.ts |
| api | errors/collection.go |
| indexer | src/errors/index.ts |
| metadata | src/lib/errors.ts |
| notifications | src/errors/notifications.ts |

## Success Criteria

- [ ] Consistent error format across all projects
- [ ] Error codes documented
- [ ] Cross-project error propagation tested
