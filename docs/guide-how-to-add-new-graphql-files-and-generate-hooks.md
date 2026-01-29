# Adding New GraphQL Files Guide

## Overview

This project uses `graphql-codegen` to auto-generate TypeScript types and React hooks from `.graphql` files.

## File Locations

Place your `.graphql` files in either:

1. **`src/shared/graphql/schemas/`** - Shared queries/mutations (recommended)
2. **`src/**/\*.graphql`\*\* - Co-located with components (if component-specific)

## Step-by-Step

### 1. Create `.graphql` File

**Example - Query:**

```graphql
# src/shared/graphql/schemas/queries/get-user.graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    profile {
      firstName
      lastName
    }
  }
}
```

**Example - Mutation:**

```graphql
# src/shared/graphql/schemas/mutations/update-user.graphql
mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    email
    profile {
      firstName
      lastName
    }
  }
}
```

### 2. Generate Code

```bash
pnpm codegen
```

This generates:

- `src/shared/graphql/hooks.generated.ts` - React hooks
- `src/shared/graphql/schema.generated.ts` - Types
- `src/shared/graphql/graphql.ts` - gql functions

### 3. Use Generated Hook

```tsx
import { useGetUserQuery } from "@/shared/graphql";

export function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useGetUserQuery({
    variables: { id: userId },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.user?.email}</div>;
}
```

### 4. Use with Mutation

```tsx
import { useUpdateUserMutation } from "@/shared/graphql";

export function UpdateUserForm() {
  const [updateUser, { loading, error }] = useUpdateUserMutation();

  const handleSubmit = async (values: UpdateUserInput) => {
    await updateUser({ variables: { input: values } });
  };

  // ... form JSX
}
```

## Naming Convention

Generated hooks follow this pattern:

| Operation Type | File/Operation Name | Generated Hook                |
| -------------- | ------------------- | ----------------------------- |
| Query          | `GetUser`           | `useGetUserQuery`             |
| Mutation       | `UpdateUser`        | `useUpdateUserMutation`       |
| Subscription   | `OnUserUpdate`      | `useOnUserUpdateSubscription` |

## Tips

- **Backend must be running** when running `pnpm codegen` (for schema fetch)
- Use **PascalCase** for operation names in `.graphql` files
- Run `pnpm codegen` after adding/modifying any `.graphql` file
- Generated code is **auto-formatted** with Prettier

## Troubleshooting

**Error: Cannot connect to GraphQL server**

- Ensure `NEXT_PUBLIC_GRAPHQL_URL` is set in `.env`
- Or ensure backend is running at `http://localhost:8081/graphql`

**Hooks not found**

- Run `pnpm codegen` to regenerate
- Check `.graphql` file is in correct directory
