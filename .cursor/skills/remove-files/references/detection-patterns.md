# Detection Patterns for Unused and Related Files

## When a file is "unused" (Option A only)

- No import/require/dynamic import references it from any other file in the repo.
- Not an entry: not `page.tsx`/`layout.tsx` in app router, not `index` re-export, not config/entry listed in config (vite, webpack, next, etc.).
- Not referenced by config: tailwind content, tsconfig paths, jest moduleNameMapper, etc.

Use workspace search (Grep) for the module path and bare filename (e.g. `from './Foo'`, `require('Foo')`, `"Foo"`). Exclude the file itself and generated/docs.

## User-requested removal (Option B)

The user names a file, path, or feature to remove (e.g. `@src/app/(user)/wallets`, `@src/modules/wallets`). The file may be in use (entry point, imported module). Proceed to remove it and its related files, then update all references (imports, routes, nav, links) so the codebase stays consistent.

## "Relevant" / related files

Same stem = same path and base name, different suffix. For a directory, related = all files under that path that belong to the feature (e.g. `page.tsx`, `index.tsx`, `components/` under that route or module).

| Type     | Pattern (stem = base without ext)                                 |
| -------- | ----------------------------------------------------------------- |
| Test     | `stem.test.{ts,tsx,js,jsx}`, `stem.spec.{ts,tsx,js,jsx}`          |
| Story    | `stem.stories.{ts,tsx,js,jsx}`                                    |
| Style    | `stem.module.{css,scss,sass}`, `stem.css`, `stem.scss`            |
| Snapshot | `__snapshots__/stem.test.{ts,tsx,js,jsx}.snap`                    |
| Mock     | `__mocks__/stem.{ts,js}` or file named after stem in **mocks**    |
| Fixture  | `stem.fixture.{ts,tsx,js,json}`, or in `__fixtures__/` named stem |
| Types    | `stem.types.ts`, `stem.d.ts` (if only for that module)            |

- **Option A:** Remove a related file only if no other file (outside the candidate) references it.
- **Option B:** Remove only files that are used **exclusively** by the feature being removed. If a file (candidate or related) is imported or used by other features (other modules, other routes), **skip it** — do not remove it. Then fix any references to the removed files.

## References to update (Option B)

After deleting the file(s), search and update:

- Imports: `from "@/modules/…"`, `from "…/page"`, etc.
- Route constants: e.g. `ROUTES.WALLETS`, `WALLETS: "/wallets"`.
- Links: `href="/wallets"`, `<Link href={ROUTES.WALLETS}>`, menu/sidebar items pointing to the removed route.
- Copy/placeholders that mention the removed feature (e.g. search categories, nav labels).

## Safe deletion order

1. Delete snapshots and mocks that reference the file(s).
2. Delete tests/stories/fixtures for the file(s).
3. Delete the main file(s) (pages, modules, components).
4. Delete style/type files that only that module used.

After removal, run build/lint/tests to confirm nothing breaks.
