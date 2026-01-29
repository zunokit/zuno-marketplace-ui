# Suitable Rename

Apply the **suitable-rename** skill to the file, component, or selection in scope:

1. **File names**: Use **kebab-case** (`xxx-yyy`), not PascalCase (`XxxYyy`) or camelCase (`xxxYyy`).
   - `XxxYyy.tsx` → `xxx-yyy.tsx`
   - `useMintState.ts` → `use-mint-state.ts`

2. **Names**: Choose names that fit the **feature** (e.g. `launch-pad` → `mint-*`, `collection-*`) and **project** (Zuno marketplace: `nft`, `collection`, `mint`, `auction`, `marketplace`).

3. **In code**: Keep **component** exports PascalCase and **hook** exports camelCase; only **file paths and imports** use kebab-case.

4. **After rename**: Update all imports to the new kebab-case path and run build to verify.

See: `.cursor/skills/suitable-rename/SKILL.md`
