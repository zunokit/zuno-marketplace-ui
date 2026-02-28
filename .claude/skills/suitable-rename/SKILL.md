---
name: suitable-rename
description: Rename components and files to kebab-case (xxx-yyy) and names that fit the feature or project. Use when renaming files/components, when user asks for "suitable" or conventional names, or when adding new files to launch-pad, marketplace, or other modules.
---

# Suitable Rename — File & Component Naming

**Invoke as `/suitable`** when using Claude skills (suitable skill). Apply when: renaming files or components, user asks for "suitable" names, or adding files to a feature module.

## What to check (both required)

1. **Kebab-case** — File/folder names use `xxx-yyy` (lowercase, hyphen-separated). No PascalCase or camelCase in paths.
2. **Context-fit** — Name reflects the **feature/module** and **project domain**. Generic names (e.g. `Button`, `Modal`) become specific (e.g. `mint-submit`, `mint-confirm-dialog`).

When reviewing a path (e.g. `@src/modules/launch-pad/mint-nft`): list files, verify kebab-case, then verify each name is appropriate for that module and the Zuno marketplace domain.

## File naming: kebab-case

Use **kebab-case** (`xxx-yyy`) for **file and folder names**. Do **not** use PascalCase (`XxxYyy`) or camelCase (`xxxYyy`) for filenames.

| Instead of (PascalCase/camelCase) | Use (kebab-case)            |
| --------------------------------- | --------------------------- |
| `CreateManageContent.tsx`         | `create-manage-content.tsx` |
| `MintNFT.tsx`                     | `mint-nft.tsx`              |
| `useMintState.ts`                 | `use-mint-state.ts`         |
| `ExistingCollections.tsx`         | `existing-collections.tsx`  |

**Conversion rules:**

- PascalCase → kebab: `XxxYyyZzz` → `xxx-yyy-zzz` (lowercase, split on caps, join with `-`)
- camelCase → kebab: `useXxxYyy` → `use-xxx-yyy` (same, preserve `use` prefix for hooks)
- Existing snake: `xxx_yyy` → `xxx-yyy` (replace `_` with `-`)

## Keep in source code (do not change)

- **React component exports**: PascalCase (`export default function CreateManageContent`). JSX and React expect component names in PascalCase.
- **Hook exports**: camelCase (`export function useMintState`). React hooks stay camelCase with `use` prefix.
- **Import paths**: Must match the **file** name (kebab-case), e.g. `from ".../components/create-manage-content"` for `create-manage-content.tsx`.

## Context-fit: names that match feature and project

Check that the **name** (the part before `.tsx`/`.ts`) fits the context, not only the format.

- **Module/feature**: Name should align with the folder. In `launch-pad` → `mint-*`, `collection-*`; in `marketplace` → `marketplace-*`, `nft-*`; in `mint-nft` → `mint-*` or `collection-*` as appropriate.
- **Project (Zuno marketplace)**: Use domain terms: `nft`, `collection`, `mint`, `auction`, `marketplace`, `launch-pad`. Avoid generic-only names that could belong to any app.
- **Generic → specific**: `Button.tsx` in `mint-nft` → `mint-button.tsx` or `mint-submit.tsx` for the main CTA; `Dialog.tsx` → `mint-confirm-dialog.tsx` if it confirms mint.
- **Red flags**: File named `utils.ts` in `mint-nft` → prefer `mint-utils.ts` or a more specific name (e.g. `mint-cost-utils`). Component that only does one thing should say what it does: `Card.tsx` → `collection-card.tsx` or `mint-stage-card.tsx`.

## Workflow: renaming a file or component

1. **Target**
   - File: e.g. `XxxYyy.tsx` → `xxx-yyy.tsx`
   - Folder: e.g. `CollectionManager` → `collection-manager` (if aligning with project style).

2. **Choose the new name**
   - Must be kebab-case (lowercase, hyphen-separated).
   - Must fit context: prefix or wording that matches the module/feature and project domain (see "Context-fit" above). If the current name is generic, replace with a context-specific name.

3. **Rename the file**
   - Apply the new kebab-case, context-fitting name.

4. **Update imports**
   - Replace every import that referenced the **old filename** (no extension) with the new kebab-case path.
   - Example: `.../XxxYyy` → `.../xxx-yyy`, `.../use_foo` → `.../use-foo`.

5. **Leave exports as-is**
   - Component: `export default function XxxYyy` unchanged.
   - Hook: `export function useXxx` unchanged.

6. **Verify**
   - `grep` for the old filename (without extension) in `src` and fix any remaining imports.
   - Run `npm run build` (or `pnpm build`).

## Examples

**Component file:**

- Before: `src/modules/launch-pad/mint-nft/components/MintPanel.tsx`
- After: `src/modules/launch-pad/mint-nft/components/mint-panel.tsx`
- Import: `from "@/modules/launch-pad/mint-nft/components/mint-panel"`
- Export: `export default function MintPanel(...)` — unchanged.

**Hook file:**

- Before: `mint-nft/hooks/useMintState.ts`
- After: `mint-nft/hooks/use-mint-state.ts`
- Import: `from ".../hooks/use-mint-state"`
- Export: `export function useMintState(...)` — unchanged.

**New file in a feature:**

- In `launch-pad/collection-manager`: `NewCollection.tsx` → `new-collection.tsx`
- In `marketplace`: `MarketplaceFilter.tsx` → `marketplace-filter.tsx` or more specific `marketplace-filter-panel.tsx` if it’s a panel.

## Reference: project layout

- **Modules**: `launch-pad`, `collection-manager`, `create-form`, `mint-nft`, `marketplace`, `product-discovery`, etc. (kebab-case).
- **Files under modules**: kebab-case (`create-manage-content.tsx`, `mint-nft.tsx`, `use-mint-state.ts`).
- **Imports**: `@/modules/<module>/<subfolder>/<kebab-file>` (no `.tsx`/`.ts` in path).
