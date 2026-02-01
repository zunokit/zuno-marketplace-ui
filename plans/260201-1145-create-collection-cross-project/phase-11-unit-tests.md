---
title: "Phase 11: Unit Tests"
description: "Unit tests for all projects"
status: pending
priority: P2
effort: 12-16h
dependencies: []
---

# Phase 11: Unit Tests

## Projects
All 6 projects

## Test Coverage

| Project | Test Files | Coverage Target |
|---------|------------|-----------------|
| UI | hooks, components | 80% |
| SDK | CollectionModule | 80% |
| API | service, repository | 80% |
| Indexer | event handlers | 70% |
| Metadata | upload handlers | 70% |
| Notifications | consumers | 70% |

## Example Tests

```typescript
// SDK test
it('should deploy ERC721 collection', async () => {
  const result = await sdk.createERC721Collection(params);
  expect(result.address).toMatch(/^0x/);
});

// API test
it('should create collection record', async () => {
  const collection = await service.CreateCollection(ctx, req);
  expect(collection.Status).toBe('PENDING');
});
```

## Success Criteria
- [ ] All unit tests passing
- [ ] Coverage targets met
