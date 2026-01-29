---
name: suitable-rename
description: Rename components and files to kebab-case (xxx-yyy) and names that fit the feature or project. Use when renaming files/components, when user asks for "suitable" or conventional names, or when adding new files to launch-pad, marketplace, or other modules.
---

# Suitable Rename — File & Component Naming

Apply when: renaming files or components, user asks for "suitable" names, or adding files to a feature module.

## File naming: kebab-case

Use **kebab-case** (`xxx-yyy`) for **file and folder names**. Do **not** use PascalCase (`XxxYyy`) or camelCase (`xxxYyy`) for filenames.

| Instead of (PascalCase/camelCase) | Use (kebab-case)     |
|----------------------------------|----------------------|
| `CreateManageContent.tsx`        | `create-manage-content.tsx` |
| `MintNFT.tsx`                    | `mint-nft.tsx`       |
| `useMintState.ts`                | `use-mint-state.ts`  |
| `ExistingCollections.tsx`        | `existing-collections.tsx` |

**Conversion rules:**
- PascalCase → kebab: `XxxYyyZzz` → `xxx-yyy-zzz` (lowercase, split on caps, join with `-`)
- camelCase → kebab: `useXxxYyy` → `use-xxx-yyy` (same, preserve `use` prefix for hooks)
- Existing snake: `xxx_yyy` → `xxx-yyy` (replace `_` with `-`)

## Keep in source code (do not change)

- **React component exports**: PascalCase (`export default function CreateManageContent`). JSX and React expect component names in PascalCase.
- **Hook exports**: camelCase (`export function useMintState`). React hooks stay camelCase with `use` prefix.
- **Import paths**: Must match the **file** name (kebab-case), e.g. `from ".../components/create-manage-content"` for `create-manage-content.tsx`.

## Feature- and project-fitting names

- **Module/feature**: Prefer names that match the folder: in `launch-pad` use `mint-*`, `collection-*`; in `marketplace` use `marketplace-*`, `nft-*`.
- **Project**: Zuno marketplace — use domain terms: `nft`, `collection`, `mint`, `auction`, `marketplace`, `launch-pad`, etc.
- **Generic → specific**: `Button.tsx` in `mint-nft` → `mint-button.tsx` or a clearer `mint-submit.tsx` if it’s the main mint CTA.

## Workflow: renaming a file or component

1. **Target**
   - File: e.g. `XxxYyy.tsx` → `xxx-yyy.tsx`
   - Folder: e.g. `CollectionManager` → `collection-manager` (if aligning with project style).

2. **Rename the file**
   - New name: kebab-case, lowercase.

3. **Update imports**
   - Replace every import that referenced the **old filename** (no extension) with the new kebab-case path.
   - Example: `.../XxxYyy` → `.../xxx-yyy`, `.../use_foo` → `.../use-foo`.

4. **Leave exports as-is**
   - Component: `export default function XxxYyy` unchanged.
   - Hook: `export function useXxx` unchanged.

5. **Verify**
   - `grep` for the old filename (without extension) in `src` and fix any remaining imports.
   - Run `npm run build` (or `pnpm build`).

## Examples

**Component file:**
- Before: `src/modules/launch-pad/mint-nft/components/MintPanel.tsx`
- After:  `src/modules/launch-pad/mint-nft/components/mint-panel.tsx`
- Import: `from "@/modules/launch-pad/mint-nft/components/mint-panel"`
- Export:  `export default function MintPanel(...)` — unchanged.

**Hook file:**
- Before: `mint-nft/hooks/useMintState.ts`
- After:  `mint-nft/hooks/use-mint-state.ts`
- Import: `from ".../hooks/use-mint-state"`
- Export:  `export function useMintState(...)` — unchanged.

**New file in a feature:**
- In `launch-pad/collection-manager`: `NewCollection.tsx` → `new-collection.tsx`
- In `marketplace`: `MarketplaceFilter.tsx` → `marketplace-filter.tsx` or more specific `marketplace-filter-panel.tsx` if it’s a panel.

## Reference: project layout

- **Modules**: `launch-pad`, `collection-manager`, `create-form`, `mint-nft`, `marketplace`, `product-discovery`, etc. (kebab-case).
- **Files under modules**: kebab-case (`create-manage-content.tsx`, `mint-nft.tsx`, `use-mint-state.ts`).
- **Imports**: `@/modules/<module>/<subfolder>/<kebab-file>` (no `.tsx`/`.ts` in path).
