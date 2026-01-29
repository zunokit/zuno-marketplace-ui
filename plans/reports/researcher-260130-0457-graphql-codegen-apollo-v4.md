# GraphQL Codegen Best Practices for Apollo Client v4

**Date:** 2026-01-30
**Researcher:** Claude Code
**Topic:** GraphQL Codegen configuration for Apollo Client v4 with TypeScript

---

## Executive Summary

The current codebase uses `typescript-react-apollo` plugin with `reactApolloImportFrom: "@apollo/client/react"` and `reactApolloVersion: 4`, but generated hooks still import `Apollo` namespace from `@apollo/client` (line 2 in `hooks.generated.ts`), which is incompatible with Apollo Client v4's new package structure.

**Recommendation:** Migrate from `typescript-react-apollo` to `client-preset` with `typed-document-node` approach for Apollo Client v4 compatibility.

---

## 1. The Problem: Apollo Client v4 Import Changes

### Breaking Change in v4

| Version | Import Path |
|---------|-------------|
| v3 | `import { useQuery } from "@apollo/client"` |
| **v4** | `import { useQuery } from "@apollo/client/react"` |

Apollo Client 4.0 moved all React hooks to `@apollo/client/react` subpath to provide cleaner separation for non-React users and better tree-shaking.

### Current Issue in Codebase

The generated `hooks.generated.ts` has:

```typescript
import * as Apollo from "@apollo/client";  // ❌ Wrong for v4
// ...
return Apollo.useQuery<GetNonceQuery, GetNonceQueryVariables>(...);  // ❌ Apollo.useQuery doesn't exist in v4
```

In Apollo Client v4, `useQuery` is NOT available on the `Apollo` namespace from `@apollo/client`. It must be imported directly from `@apollo/client/react`.

---

## 2. Solution Options

### Option A: Fix `typescript-react-apollo` Configuration (Partial Fix)

The plugin supports `reactApolloImportFrom` and `reactApolloVersion` options:

```typescript
// codegen.ts
{
  plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
  config: {
    reactApolloVersion: 4,              // Target Apollo v4
    reactApolloImportFrom: "@apollo/client/react",  // Import hooks from here
    withHooks: true,
    withComponent: false,
    withHOC: false,
  }
}
```

**Limitations:**
- The `typescript-react-apollo` plugin has known compatibility issues with Apollo Client v4
- Generated code may still incorrectly import `skipToken` from wrong location
- The Guild officially states: *"generated hooks created by this package are no longer compatible with Apollo Client 4.0"*

### Option B: Use `typed-document-node` Plugin (Recommended)

Generate `TypedDocumentNode` instead of hooks:

```typescript
// codegen.ts
{
  plugins: [
    "typescript",
    "typescript-operations",
    "typed-document-node"  // Instead of typescript-react-apollo
  ]
}
```

**Usage:**
```typescript
import { useQuery } from "@apollo/client/react";  // ✅ Correct import for v4
import { GetUserDocument } from "./generated/graphql";

const { data } = useQuery(GetUserDocument);  // Fully typed
```

**Benefits:**
- Smaller bundle size (no generated hook wrappers)
- Framework agnostic
- Perfect type inference with Apollo's native hooks
- Future-proof

### Option C: Use `client-preset` (Modern Best Practice)

The Guild's official recommendation for 2025:

```typescript
// codegen.ts
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: GRAPHQL_URL,
  documents: ["src/**/*.graphql"],
  generates: {
    "./src/shared/graphql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,  // Disable for Apollo Client compatibility
      },
      config: {
        scalars: {
          DateTime: "string",
          JSON: "Record<string, any>",
          BigInt: "string",
          Time: "string",
        },
      },
    },
  },
};
```

**Usage:**
```typescript
import { useQuery } from "@apollo/client/react";
import { graphql } from "./graphql";

const GetUserDocument = graphql(`
  query GetUser($id: ID!) {
    user(id: $id) { id name }
  }
`);

const { data } = useQuery(GetUserDocument);
```

---

## 3. Recommended Configuration for Apollo Client v4

### Complete Working Example

```typescript
// src/shared/graphql/codegen.ts
import { CodegenConfig } from "@graphql-codegen/cli";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4080";
const GRAPHQL_URL = `${BACKEND_URL}/graphql`;

const config: CodegenConfig = {
  schema: GRAPHQL_URL,
  documents: [
    "src/shared/graphql/schemas/**/*.graphql",
    "src/**/*.graphql",
  ],
  ignoreNoDocuments: true,
  generates: {
    // Single output using client preset (recommended)
    "./src/shared/graphql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,  // Required for Apollo Client
        gqlTagName: "gql",
      },
      config: {
        strictScalars: true,
        scalars: {
          DateTime: "string",
          JSON: "Record<string, any>",
          BigInt: "string",
          Time: "string",
        },
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
        },
        enumsAsTypes: true,
        futureProofEnums: true,
        addDocBlocks: true,
        skipTypename: false,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
```

### Package Dependencies

```json
{
  "dependencies": {
    "@apollo/client": "^4.1.2",
    "graphql": "^16.12.0"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^6.1.1",
    "@graphql-codegen/client-preset": "^5.2.2",
    "@graphql-codegen/typescript": "^5.0.7",
    "@graphql-codegen/typescript-operations": "^5.0.7"
    // Remove: @graphql-codegen/typescript-react-apollo
  }
}
```

---

## 4. Migration Steps

1. **Remove `typescript-react-apollo` plugin:**
   ```bash
   pnpm remove @graphql-codegen/typescript-react-apollo
   ```

2. **Update `codegen.ts`:**
   - Replace multiple output files with single `client` preset
   - Remove `hooks.generated.ts` configuration
   - Set `fragmentMasking: false`

3. **Update imports in codebase:**
   ```typescript
   // Before
   import { useGetUserQuery } from "./hooks.generated";

   // After
   import { useQuery } from "@apollo/client/react";
   import { GetUserDocument } from "./graphql";
   const { data } = useQuery(GetUserDocument);
   ```

4. **Regenerate:**
   ```bash
   pnpm codegen
   ```

---

## 5. Comparison Summary

| Approach | Bundle Size | Apollo v4 Compatible | Maintenance | Recommendation |
|----------|-------------|---------------------|-------------|----------------|
| `typescript-react-apollo` | Larger | ⚠️ Partial | Legacy | ❌ Avoid |
| `typed-document-node` | Small | ✅ Yes | Active | ✅ Good |
| `client-preset` | Smallest | ✅ Yes | Official | ✅ **Best** |

---

## Unresolved Questions

1. Does the current codebase use any features from `typescript-react-apollo` that would be difficult to migrate (e.g., generated HOCs, custom hook options)?
2. Are there any specific Apollo Client v4 features (like `skipToken` or suspense queries) that need special handling?
3. What is the timeline for Apollo Client v4 migration in the project?

---

## Sources

- [Apollo Client 4.0 Announcement](https://www.apollographql.com/blog/announcing-apollo-client-4-0)
- [Apollo Client v4 Migration Guide](https://www.apollographql.com/docs/react/migrating/apollo-client-4-migration)
- [GraphQL Codegen Client Preset](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client)
- [GraphQL Codegen TypeScript React Apollo](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-react-apollo)
- [TypedDocumentNode Blog Post](https://the-guild.dev/graphql/hive/blog/typed-document-node)
- [Apollo Client + TypeScript Documentation](https://www.apollographql.com/docs/react/data/typescript)
- [GraphQL Codegen v5 Roadmap Discussion](https://github.com/dotansimha/graphql-code-generator/issues/10244)
