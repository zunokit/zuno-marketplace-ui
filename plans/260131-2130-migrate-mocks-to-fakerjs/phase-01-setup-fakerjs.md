---
title: "Phase 1: Setup Faker.js"
phase: 1
status: pending
effort: 30m
dependencies: []
---

# Phase 1: Setup Faker.js

## Overview

Install @faker-js/faker and create the core faker instance with seed support.

## Context

- **Plan**: [plan.md](./plan.md)
- **Brainstorm Report**: [brainstorm-260131-2126-migrate-to-fakerjs.md](../reports/brainstorm-260131-2126-migrate-to-fakerjs.md)

## Requirements

### Functional
- Install @faker-js/faker as dev dependency
- Create faker-instance.ts with seed support
- Ensure tree-shakeable imports work

### Non-functional
- Zero bundle size impact on production (dev dependency only)
- Full TypeScript support

## Implementation Steps

1. **Install dependency**
   ```bash
   pnpm add -D @faker-js/faker
   ```

2. **Create faker-instance.ts**
   Create `src/shared/utils/mock/faker-instance.ts`:
   ```typescript
   import { fakerEN as faker } from '@faker-js/faker';

   let currentSeed: number | undefined;

   export function setFakerSeed(seed: number) {
     currentSeed = seed;
     faker.seed(seed);
   }

   export function resetFakerSeed() {
     if (currentSeed !== undefined) {
       faker.seed(currentSeed);
     }
   }

   export { faker };
   export type Faker = typeof faker;
   ```

3. **Verify installation**
   ```bash
   pnpm typecheck
   ```

## Related Code Files

**Create:**
- `src/shared/utils/mock/faker-instance.ts`

**Modify:**
- `package.json` (via pnpm add)

## Todo

- [ ] Install @faker-js/faker
- [ ] Create faker-instance.ts with seed support
- [ ] Run typecheck to verify

## Success Criteria

- [ ] Package installed without errors
- [ ] TypeScript recognizes faker types
- [ ] Seed functions work correctly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Package install fails | Low | Check pnpm/npm registry access |
| Type conflicts | Low | Use @faker-js/faker v9+ for TS 5.9 support |
