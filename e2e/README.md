# End-to-end tests (Playwright)

Smoke specs that exercise the Next.js app via a real browser. Each spec is
intentionally narrow — they verify routing, layout, and error boundaries are
wired up and do **not** depend on backend services, RPC providers, or
chain-state. They are meant to catch outright regressions in the app shell.

## Running

```bash
# install browsers once
pnpm exec playwright install --with-deps chromium

# run against an auto-started dev server (default: http://127.0.0.1:3000)
pnpm e2e

# run against an already-running dev or preview server
PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm e2e
```

## Adding more coverage

Add specs under `e2e/` using `*.spec.ts`. Prefer mocking network calls with
`page.route(...)` rather than relying on live backends so the suite stays
deterministic in CI.
