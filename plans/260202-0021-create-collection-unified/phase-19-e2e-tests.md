---
title: "Phase 19: E2E Tests"
description: "End-to-end UI tests"
status: pending
priority: P2
effort: 8-10h
dependencies: ["Phase 01-18"]
parallel_group: E
---

# Phase 19: E2E Tests

## Project
zuno-marketplace-ui

## Test Scenarios

```typescript
// Playwright tests
test('user can create collection', async ({ page }) => {
  await page.goto('/create/collection');
  await page.fill('[name="name"]', 'Test Collection');
  await page.fill('[name="symbol"]', 'TEST');
  await page.click('button[type="submit"]');

  // Verify success
  await expect(page.locator('text=Collection deployed')).toBeVisible();
});
```

## Test Cases

1. Happy path - successful creation
2. Upload failure - retry
3. Insufficient funds - error message
4. Network switch - warning
5. Browser refresh - state recovery

## Success Criteria
- [ ] All E2E tests passing
- [ ] Screenshots on failure
