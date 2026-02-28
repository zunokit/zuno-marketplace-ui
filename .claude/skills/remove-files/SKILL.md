---
name: remove-files
description: Remove a file and its related files (tests, styles, stories, mocks)—either because the file is unused, or because the user explicitly asks to remove it (e.g. remove a feature/route). When removing by request, also clean up all references (imports, routes, nav links). Use for dead code cleanup, refactor cleanup, or "remove this and related."
---

# Remove File and Related

## Purpose

- **Option A (unused):** Remove files that are not used anywhere and their "relevant" files (tests, styles, stories, mocks, fixtures), without breaking references.
- **Option B (user-requested):** Remove a file (or path/feature) and its related files **even when it is used** (e.g. entry points, modules). Then remove or update all references (imports, route config, nav, links) so the repo stays consistent.

## When to use

- User asks to remove unused files, dead code, or "file and relevant file if not used anywhere." → use **Option A**.
- User asks to remove a file/path/feature "and related" or "remove this and related" (e.g. `@src/app/.../wallets`, `@src/modules/explore`) without saying "if unused." → use **Option B** (remove file + related + fix references).
- After refactors when modules were replaced or deleted but their files remain. → **Option A** or **Option B** depending on whether user named the file to remove.

## Workflow

### Option A — Unused only

1. **Identify the candidate file.** User names it, or find files that are never imported. Exclude entry points unless user explicitly asked to remove that route/feature. See `references/detection-patterns.md`.

2. **Find related files.** Same stem: test/spec, stories, styles, snapshots, mocks, fixtures, `*.types.ts`/`*.d.ts`. Patterns in `references/detection-patterns.md`.

3. **Verify related files are only used by the candidate.** If another file references a related file, do not remove that related file.

4. **Delete in safe order.** Snapshots/mocks → tests/stories/fixtures → candidate file → style/type files.

5. **Confirm.** Run build, lint, tests.

### Option B — User-requested removal (file may be used)

1. **Identify the candidate.** User names a file, directory, or feature (e.g. `src/app/(user)/wallets`, `src/modules/wallets`). This can include entry points (`page.tsx`, `layout.tsx`) and modules that are imported elsewhere.

2. **Find related files.** Same stem/directory: tests, stories, styles, mocks, fixtures, type files for those files. For a directory, consider the whole module or route (e.g. all files under `wallets/`).

3. **Skip files used by other features.** For each file (candidate or related), search the repo for imports/references. If the file is imported or used by code **outside** the feature being removed (e.g. another module, another route), **do not remove** that file — skip it. Only remove files that are used exclusively by the feature being removed.

4. **Find all references.** Search for: imports of the candidate module or path, route constants (e.g. `ROUTES.WALLETS`, `"/wallets"`), nav/menu links, `href`/`Link` to the route, config entries. List every file that references the candidate or its route.

5. **Delete in safe order.** Snapshots/mocks → tests/stories/fixtures → component/page/module files → style/type files. Delete empty directories if desired. (Only delete files that passed the "skip if used elsewhere" check.)

6. **Update references.** Remove or rewrite references: drop route entries, remove nav/menu items, remove imports and usages, update placeholders or copy that mention the removed feature. Do not leave broken imports or dead links.

7. **Confirm.** Run build, lint, and tests. Fix any remaining breakage.

## Caution

- **Option A:** Do not remove entry points or public API re-exports unless the user explicitly asked to remove that feature.
- **Option B:** Only remove when the user clearly asked to remove that file/path/feature (e.g. "remove this and related", "remove wallets", path mention). After removal, all references must be updated.
- **Option B:** If a file is used by other features (imported/referenced outside the feature being removed), skip that file — do not remove it.
- When in doubt whether a file is used, search for dynamic imports, string requires, and config. If still ambiguous, ask the user before deleting.

## Reference

- **Unused vs entry, related file patterns, safe order:** `references/detection-patterns.md`
