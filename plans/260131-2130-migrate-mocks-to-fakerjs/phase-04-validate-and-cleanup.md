---
title: "Phase 4: Validate & Cleanup"
phase: 4
status: pending
effort: 30m
dependencies: [phase-03-migrate-mock-files]
---

# Phase 4: Validate & Cleanup

## Overview

Run final validation, ensure tests pass, and clean up any temporary code.

## Context

- **Plan**: [plan.md](./plan.md)
- **Previous Phase**: [phase-03-migrate-mock-files.md](./phase-03-migrate-mock-files.md)

## Implementation Steps

1. **Run typecheck**
   ```bash
   pnpm typecheck
   ```

2. **Run linting**
   ```bash
   pnpm lint
   ```

3. **Check code reduction**
   ```bash
   find src/shared/utils/mock -name "*.ts" -not -name "*.d.ts" | xargs wc -l
   ```
   Target: ~400 lines (from ~1,150)

4. **Verify seeding works**
   Create quick test:
   ```typescript
   import { setFakerSeed, faker } from './faker-instance';

   setFakerSeed(12345);
   const name1 = faker.person.fullName();

   setFakerSeed(12345);
   const name2 = faker.person.fullName();

   console.assert(name1 === name2, 'Seeding should produce deterministic results');
   ```

5. **Check for remaining Math.random()**
   ```bash
   grep -r "Math.random()" src/shared/utils/mock/ --include="*.ts" || echo "No Math.random() found - good!"
   ```

6. **Update barrel export (if exists)**
   Ensure `src/shared/utils/mock/index.ts` exports new fakers if needed.

## Related Code Files

**Verify:**
- All files in `src/shared/utils/mock/`

## Todo

- [ ] Run `pnpm typecheck` - zero errors
- [ ] Run `pnpm lint` - zero errors
- [ ] Verify line count reduction (target: ~400 lines)
- [ ] Verify seeding produces deterministic output
- [ ] Confirm no `Math.random()` remains
- [ ] Update documentation if needed

## Success Criteria

- [ ] TypeScript compiles without errors
- [ ] Linting passes
- [ ] Code volume reduced by 50%+
- [ ] Seeding works correctly
- [ ] No `Math.random()` calls in migrated files

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Type errors | Medium | Fix as they appear |
| Lint errors | Low | Run `pnpm lint:fix` |
| Missing exports | Medium | Check all imports |
