# Agents Configuration

## Cursor Cloud specific instructions

### Project Overview
This is a **Next.js 16 frontend-only** NFT marketplace (Zuno Marketplace) using pnpm. No backend/database services are in this repo — it connects to external APIs via environment variables.

### Quick Reference
- **Package manager**: pnpm (lockfile: `pnpm-lock.yaml`)
- **Dev server**: `pnpm dev` (port 3000)
- **Lint**: `pnpm lint`
- **Typecheck**: `pnpm typecheck`
- **Build**: `pnpm build`
- **Format**: `pnpm format`

### Environment Setup
- Copy `.env.example` to `.env.local` for local development. The app renders UI with mock/faker data even without real API endpoints.
- `pnpm install` handles all dependencies including native build scripts (configured via `pnpm.onlyBuiltDependencies` in `package.json`).

### Gotchas
- The `Nft` type in `src/modules/marketplace/types/` is different from the `NFT` type in `src/shared/types/marketplace.ts`. They are not interchangeable — be careful with type casts between them.
- Mock data generators in `src/shared/utils/mock/fakers/` use `@faker-js/faker` with a shared instance from `faker-instance.ts`. NFT slugs may be non-numeric strings, so always handle `parseInt()` fallbacks.
- Sentry integration in `next.config.ts` wraps the config — build warnings about `import-in-the-middle` are expected and harmless.
- The `baseline-browser-mapping` package shows "data over two months old" warnings during lint/build — this is cosmetic only.
- ESLint warnings (11 total) are all in `src/app/debug/ui/` and pre-existing. No errors.
