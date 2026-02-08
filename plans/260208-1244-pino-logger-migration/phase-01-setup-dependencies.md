---
title: "Phase 1: Setup & Dependencies"
description: "Install Pino v9, update package.json, configure Next.js"
---

# Phase 1: Setup & Dependencies

## Context Links

- Parent Plan: [plan.md](./plan.md)
- Research: [Pino v9 Research](./reports/researcher-260208-1245-pino-v9-nextjs16-integration.md)

## Overview

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Estimated Effort** | 1 hour |
| **Dependencies** | None |

Install and configure Pino v9 with proper Next.js 16 support.

## Key Insights

- Pino v9 requires Node.js 20+
- v9.8.0 had TypeScript regression, use v9.9.0+
- `pino-pretty` should remain devDependency
- `sync: true` required for React Server Components

## Requirements

### Functional

- Install Pino v9.9.0+ as production dependency
- Keep pino-pretty as devDependency
- Update next.config.ts for Pino external packages
- Verify TypeScript compilation

### Non-Functional

- Zero bundle size regression
- Edge Runtime compatibility

## Architecture

```
package.json
├── dependencies
│   └── pino: ^9.9.0          (NEW - moved from devDependencies)
└── devDependencies
    └── pino-pretty: ^13.x     (EXISTING)
```

## Related Code Files

| Action | File |
|--------|------|
| Modify | `package.json` |
| Modify | `next.config.ts` |
| Verify | `pnpm typecheck` |

## Implementation Steps

1. **Update package.json**
   ```bash
   pnpm remove pino pino-pretty
   pnpm add pino@^9.9.0
   pnpm add -D pino-pretty
   ```

2. **Verify next.config.ts**
   Ensure `serverExternalPackages` includes:
   - `"pino"`
   - `"thread-stream"`
   - `"pino-pretty"`

3. **TypeScript check**
   ```bash
   pnpm typecheck
   ```

## Todo List

- [ ] Remove pino from devDependencies
- [ ] Install pino@^9.9.0 in dependencies
- [ ] Verify next.config.ts serverExternalPackages
- [ ] Run typecheck
- [ ] Run build to verify

## Success Criteria

- [ ] `pnpm install` completes without errors
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` completes successfully
- [ ] Pino imports work in Server Components

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| ESM/CJS conflicts | High | Medium | Use dynamic import if needed |
| Node.js version | High | Low | Project already on Node 20+ |

## Security Considerations

- No security impact (dependency upgrade)
- Pino has no known vulnerabilities in v9.9.0+

## Next Steps

After completion, proceed to [Phase 2: Core Logger Implementation](./phase-02-core-logger.md)
