# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 frontend NFT marketplace application built with TypeScript, React 19, and Tailwind CSS. The application uses a modular architecture with clearly separated concerns for business logic, UI components, and shared utilities.

## Development Commands

**Note: This project uses PNPM as the package manager.**

- `pnpm dev` - Start development server with Turbopack (recommended)
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm install` - Install dependencies

### Testing Commands

- `pnpm test` - Run unit tests with Jest
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm test:coverage` - Generate test coverage report
- `pnpm test:e2e` - Run end-to-end tests with Playwright
- `pnpm test:e2e:ui` - Run E2E tests with Playwright UI
- `pnpm test:e2e:headed` - Run E2E tests in headed mode (see browser)

## Architecture Overview

### Modular Structure

The project follows a module-based architecture located in `src/modules/`:

- **auth/** - Authentication module (currently minimal implementation)
- **mint/** - NFT minting functionality including:
  - `create-form/` - Collection creation forms and wizards
  - `mint-nft/` - NFT minting interface and components
  - `collection-manager/` - Collection management interface
- **product-discovery/** - Homepage discovery features:
  - `banner/` - Hero banners and promotional content
  - `collection-carousel/` - Featured collections display
- **chain/** - Blockchain network selection and management

### Shared Infrastructure

Located in `src/shared/`:

- **components/ui/** - Shadcn/ui component library with customizations
- **components/layout/** - Navigation, header, and layout components
- **components/carousel/** - Reusable carousel components
- **components/date-time/** - Date/time picker components
- **types/** - Global TypeScript type definitions
- **hooks/** - Shared React hooks

### Testing Structure

Located in `src/`:

- \***\*tests**/\*\* - Unit and integration tests using Jest
  - `setup.ts` - Test configuration and setup
  - `example.test.tsx` - Example test files
- **tests/e2e/** - End-to-end tests using Playwright
  - `homepage.spec.ts` - Homepage E2E tests
  - Additional spec files for other pages/features

### UI Component System

- Uses Shadcn/ui components (configured in `components.json`)
- Tailwind CSS v4 for styling
- Dark mode support via `next-themes`
- Component variants using `class-variance-authority`

### App Router Structure

- `app/(discover)/` - Main marketplace pages (homepage, discovery)
- `app/mint/` - NFT minting and collection management
- `app/launch-pad/` - Project launch pages

## Key Technologies

- **Next.js 15** with App Router and React 19
- **TypeScript** with strict configuration
- **Tailwind CSS v4** for styling
- **Radix UI** primitives for accessible components
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **Embla Carousel** for carousel functionality

### Testing Tools

- **Jest** - Unit testing framework with jsdom environment
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing across browsers
- Test configuration in `tests/setup/jest.config.js` and `tests/setup/playwright.config.ts`

## GraphQL & API Integration

### GraphQL Code Generation

This project uses **GraphQL Code Generator** to create type-safe hooks from GraphQL operations.

**Important: ALWAYS use generated hooks, NOT manual service calls.**

#### Code Generation Setup

```bash
# Generate TypeScript types and React hooks from GraphQL operations
pnpm codegen

# Watch mode (auto-regenerate on .graphql file changes)
pnpm codegen:watch
```

**Configuration**: `src/shared/graphql/codegen.ts`

Plugins used:
- `typescript` - Generate TypeScript types
- `typescript-operations` - Generate operation types
- `typescript-react-apollo` - Generate React hooks

#### GraphQL Schema Files

Location: `src/shared/graphql/schemas/`

- `auth.graphql` - Authentication queries & mutations
- `user.graphql` - User profile operations
- `wallet.graphql` - Wallet management operations

**After adding/modifying any `.graphql` file, run `pnpm codegen` to regenerate hooks.**

#### Generated Hooks

Location: `src/shared/graphql/generated.ts` (auto-generated, DO NOT edit manually)

**Available Hooks:**

**Queries:**
- `useGetNonceQuery` / `useGetNonceLazyQuery` - Get SIWE nonce
- `useMeQuery` / `useMeLazyQuery` - Get current user
- `useMyWalletsQuery` / `useMyWalletsLazyQuery` - Get user wallets

**Mutations:**
- `useVerifySiweMutation` - Verify SIWE signature & create session
- `useRefreshSessionMutation` - Refresh access token
- `useLogoutMutation` - Logout user
- `useUpdateProfileMutation` - Update user profile
- `useLinkWalletMutation` - Link wallet to user

#### Usage Examples

**❌ BAD - Don't use manual service calls:**
```typescript
import { authService } from '@/shared/services/auth.service';

// Manual API call (old pattern)
const { nonce } = await authService.getNonce(accountId, chainId, domain);
```

**✅ GOOD - Use generated hooks:**
```typescript
import { useGetNonceLazyQuery } from '@/shared/graphql/generated';

// Type-safe hook with loading states
const [getNonce, { loading, error, data }] = useGetNonceLazyQuery();

const handleFetch = async () => {
  const result = await getNonce({
    variables: { accountId, chainId, domain }
  });
  console.log(result.data?.getNonce);
};
```

**Benefits of Generated Hooks:**
- ✅ **Type Safety**: Automatic TypeScript types for variables and responses
- ✅ **Loading States**: Built-in `loading`, `error`, `data` states
- ✅ **Auto-completion**: Full IDE support for query/mutation variables
- ✅ **Automatic Refetch**: Apollo Client cache management
- ✅ **Error Handling**: Integrated error handling via Apollo error link

#### Apollo Client Configuration

**Location**: `src/shared/lib/apollo/`

**Features:**
- Automatic token refresh on authentication errors
- Dynamic token injection via `authLink`
- Error link for handling auth failures
- Cookie credentials for refresh tokens

**Automatic Token Refresh Flow:**
1. Request fails with "authentication required"
2. Apollo error link detects auth error
3. Calls `refreshSession` mutation automatically
4. Retries original request with new token
5. User stays logged in across page reloads

#### Best Practices

1. **Always use hooks for GraphQL operations** - Never call `graphqlClient.queryTyped()` directly
2. **Use LazyQuery for user-triggered actions** - Regular queries run on mount, lazy queries wait for manual trigger
3. **Handle loading/error states** - Always show loading spinners and error messages
4. **Leverage Apollo cache** - Don't refetch data unnecessarily
5. **Run codegen after schema changes** - Keep generated code in sync with backend

#### Adding New GraphQL Operations

1. **Create `.graphql` file** in `src/shared/graphql/schemas/`
   ```graphql
   # user.graphql
   query GetUserProfile($userId: ID!) {
     user(id: $userId) {
       id
       username
       email
     }
   }
   ```

2. **Run code generation**
   ```bash
   pnpm codegen
   ```

3. **Use generated hook**
   ```typescript
   import { useGetUserProfileQuery } from '@/shared/graphql/generated';

   const { data, loading, error } = useGetUserProfileQuery({
     variables: { userId: '123' }
   });
   ```

## Path Aliases

```typescript
"@/*": ["./src/*"]
```

Shadcn components are aliased in `components.json`:

- `@/shared/components` for components
- `@/shared/components/ui` for UI components
- `@/shared/hooks` for hooks

## Environment Variables

- `NEXT_PUBLIC_APP_URL` - Application base URL (defaults to localhost:3000)

## External Image Domains

Configured in `next.config.ts`:

- `picsum.photos` - Placeholder images
- `assets.coingecko.com` - Cryptocurrency assets
- `placehold.co` - Additional placeholder service

## Development Workflow

### **How Claude Code Should Develop**

#### **1. 🔴 RED-GREEN-REFACTOR Methodology (MANDATORY)**

**EVERY code change MUST follow this cycle:**

1. **🔴 RED**: Write failing tests FIRST (no exceptions)
   - Write test cases that describe the expected behavior
   - Run tests to verify they fail (proving they're actually testing something)
   - Never skip this step, even for "simple" changes

2. **🟢 GREEN**: Write minimal code to pass ALL tests
   - Implement only what's needed to make tests pass
   - Don't add extra features or "nice-to-haves"
   - All tests must be green before moving forward

3. **🔵 REFACTOR**: Improve code while keeping ALL tests passing
   - Clean up implementation
   - Improve readability and maintainability
   - Run tests after each refactoring step to ensure nothing breaks

**EXCEPTIONS - RDD NOT REQUIRED FOR:**

- ✅ **Pure UI/Presentation Components**: Components that only render JSX without business logic, state management, or side effects
  - Simple display components (e.g., `<Card>`, `<Badge>`, `<Avatar>`)
  - Layout components (e.g., `<Header>`, `<Footer>`, `<Container>`)
  - Wrapper components that only pass props through
  - Components that only handle styling/visual presentation

- ✅ **Components Without Logic**: Components that don't contain:
  - Complex state management
  - API calls or data fetching
  - Form validation or business rules
  - Event handlers beyond simple callbacks
  - Side effects or hooks beyond basic React hooks (useState for simple UI state)

**Examples of components that DON'T need RDD:**

```typescript
// ✅ No RDD needed - pure presentation
export const Button = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);

// ✅ No RDD needed - simple UI wrapper
export const Card = ({ title, children }) => (
  <div className="card">
    <h3>{title}</h3>
    {children}
  </div>
);
```

**Examples of components that DO need RDD:**

```typescript
// ❌ RDD required - has business logic
export const UserProfile = () => {
  const { data, isLoading } = useUserData();
  const handleSubmit = async formData => {
    /* validation & API call */
  };
  // ... complex logic
};

// ❌ RDD required - has state management
export const FormComponent = () => {
  const [errors, setErrors] = useState({});
  const validate = () => {
    /* validation logic */
  };
  // ... complex state handling
};
```

**FORBIDDEN:**

- ❌ Writing implementation before tests (for components with logic)
- ❌ Skipping/removing tests to make code "work"
- ❌ Leaving any tests failing
- ❌ Committing code without running all tests
- ❌ Making changes without corresponding test coverage (for logic-containing code)

#### **2. Test Coverage Requirements**

- **Unit Tests**: All utility functions, hooks, and isolated components
- **Integration Tests**: Feature workflows and component interactions
- **E2E Tests**: Critical user journeys and happy paths
- **Minimum Coverage**: 80% for statements, branches, functions, and lines

#### **3. Code Quality Standards**

- Always run `pnpm lint:fix` before committing
- Ensure TypeScript strict mode compliance
- Follow existing code patterns and architecture
- Keep components small and focused (< 200 lines)
- Use proper TypeScript types (avoid `any`)

#### **4. Senior-Level Code Practices (MAINTAINABILITY & SCALABILITY)**

**Code must be written for maintainability, easy modification, and future upgrades:**

##### **4.1. Code Organization & Structure**

- ✅ **Single Responsibility Principle**: Each function/component should do ONE thing well
- ✅ **Clear Separation of Concerns**: Business logic ≠ UI logic ≠ Data fetching
- ✅ **Modular Architecture**: Break large features into smaller, reusable modules
- ✅ **Consistent File Structure**: Follow existing module patterns (`components/`, `hooks/`, `services/`, `types/`, `utils/`)

##### **4.2. Naming Conventions**

- ✅ **Descriptive Names**: Names should clearly express intent (e.g., `getUserProfile` not `getData`)
- ✅ **Consistent Patterns**: Follow project naming conventions (camelCase for functions, PascalCase for components)
- ✅ **Avoid Abbreviations**: Use full words unless abbreviation is widely understood (e.g., `handleClick` not `hdlClick`)
- ✅ **Type-Safe Names**: Use TypeScript to enforce naming through types (e.g., `UserProfile` type for user profile data)

##### **4.3. Code Readability**

- ✅ **Self-Documenting Code**: Code should read like documentation, minimal comments needed
- ✅ **Extract Magic Numbers/Strings**: Move constants to configuration files or constants
- ✅ **Avoid Deep Nesting**: Extract logic to separate functions, use early returns
- ✅ **Meaningful Variable Names**: `isLoading` not `flag`, `userCount` not `count`

```typescript
// ❌ BAD - Unclear, hard to maintain
const d = u.filter(x => x.a > 18).map(x => x.n);

// ✅ GOOD - Clear, maintainable
const activeUsers = users.filter(user => user.age > MIN_AGE).map(user => user.name);
```

##### **4.4. Maintainability Patterns**

- ✅ **DRY (Don't Repeat Yourself)**: Extract common logic to shared utilities/hooks
- ✅ **Composition over Inheritance**: Prefer composing small components over large inheritance hierarchies
- ✅ **Configuration-Driven**: Make components configurable through props, not hardcoded values
- ✅ **Dependency Injection**: Pass dependencies as props/parameters, avoid global state when possible

##### **4.5. Scalability Considerations**

- ✅ **Performance-Conscious**: Use React.memo, useMemo, useCallback when appropriate
- ✅ **Lazy Loading**: Code-split routes and heavy components with dynamic imports
- ✅ **Future-Proof Types**: Design types/interfaces that can be extended without breaking changes
- ✅ **Version-Aware Design**: Structure code to handle API versioning and breaking changes gracefully

##### **4.6. Error Handling & Edge Cases**

- ✅ **Graceful Degradation**: Handle errors without crashing, show user-friendly messages
- ✅ **Edge Case Handling**: Consider empty states, loading states, error states, network failures
- ✅ **Type Safety**: Use TypeScript strict mode, validate external data (API responses, user input)
- ✅ **Defensive Programming**: Validate inputs, handle null/undefined gracefully

```typescript
// ❌ BAD - No error handling, will crash
const user = await fetchUser(id);
return <Profile data={user} />;

// ✅ GOOD - Handles edge cases
const { data: user, isLoading, error } = useUser(id);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message="Failed to load user" />;
if (!user) return <EmptyState message="User not found" />;

return <Profile data={user} />;
```

##### **4.7. Testing & Documentation**

- ✅ **Testable Code**: Write code that's easy to test (pure functions, dependency injection)
- ✅ **In-code Documentation**: Use JSDoc for complex functions, explain "why" not "what"
- ✅ **Type as Documentation**: Use TypeScript types to document expected data structures
- ✅ **Clear Commit Messages**: Follow conventional commits for better code history

##### **4.8. Refactoring Guidelines**

- ✅ **Incremental Refactoring**: Refactor small pieces at a time, keep tests passing
- ✅ **No Big Bang Rewrites**: Avoid rewriting entire features unless absolutely necessary
- ✅ **Backward Compatibility**: Maintain existing APIs when possible, deprecate gradually
- ✅ **Performance Monitoring**: Profile before optimizing, measure actual impact

##### **4.9. Anti-Patterns to Avoid**

- ❌ **God Objects/Components**: Components that do everything (500+ lines)
- ❌ **Deep Prop Drilling**: Passing props through many layers (use Context or state management)
- ❌ **Tight Coupling**: Components/services directly dependent on specific implementations
- ❌ **Premature Optimization**: Optimizing without measuring actual performance issues
- ❌ **Copy-Paste Programming**: Duplicating code instead of extracting reusable functions

##### **4.10. Code Review Checklist**

Before submitting code, ensure:

- [ ] Code follows existing patterns and architecture
- [ ] Functions/components are focused and single-purpose
- [ ] Types are properly defined and used
- [ ] Error cases are handled gracefully
- [ ] Performance considerations (memoization, lazy loading) are applied where needed
- [ ] Code is testable and has appropriate test coverage
- [ ] No hardcoded values (use constants/config)
- [ ] No unnecessary complexity (simpler is better)
- [ ] Code is self-documenting (minimal comments needed)

#### **5. Testing Best Practices**

- Place unit tests alongside components or in `src/__tests__/`
- Place E2E tests in `src/tests/e2e/`
- Use descriptive test names that explain behavior
- Mock external dependencies and API calls
- Test error states and edge cases, not just happy paths
- Keep tests independent and isolated

#### **6. Documentation Files Policy (STRICTLY ENFORCED)**

**🚫 DO NOT CREATE ANY MARKDOWN FILES (\*.md) WITHOUT EXPLICIT PERMISSION**

**Rules:**

- ❌ **NEVER** create any `.md` files (README, CHANGELOG, docs, etc.) without explicit user approval
- ❌ **NEVER** assume documentation is needed and create it proactively
- ❌ **NEVER** create documentation files "just in case" or "for completeness"
- ✅ **ALWAYS** ask for permission first if you believe a documentation file is needed
- ✅ **ONLY** create documentation files when explicitly requested by the user

**If you think a documentation file might be helpful:**

1. **ASK FIRST**: "Would you like me to create a README for this feature?"
2. **WAIT FOR APPROVAL**: Do not proceed until you receive explicit confirmation
3. **CREATE ONLY IF APPROVED**: Only then create the file with the specified content

**This rule applies to ALL markdown files:**

- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `API.md`
- `docs/*.md`
- Any other `.md` files

### **Adding New Features**

When adding a new feature, follow this structure:

#### **Module Structure**

Each feature module in `src/modules/[feature-name]/` should follow this organization:

```
src/modules/feature-name/
├── components/              # Feature-specific components
│   ├── FeatureComponent.tsx
│   └── FeatureComponent.test.tsx  # Component tests
│
├── hooks/                   # Feature-specific hooks
│   ├── useFeature.ts
│   └── useFeature.test.ts   # Hook tests
│
├── services/                # API calls and business logic
│   ├── feature.service.ts
│   └── feature.service.test.ts  # Service tests
│
├── types/                   # Feature-specific types
│   └── feature.types.ts
│
├── utils/                   # Feature utilities
│   ├── helpers.ts
│   └── helpers.test.ts      # Utility tests
│
└── index.tsx                # Public API exports
```

#### **Step-by-Step Process**

1. **Create Module Structure**

   ```bash
   mkdir -p src/modules/feature-name/{components,hooks,services,types,utils}
   ```

2. **Write Tests First (RED)**
   - Create test files for expected functionality
   - Define expected behavior in tests
   - Run tests to ensure they fail

3. **Implement Feature (GREEN)**
   - Create TypeScript types in `types/`
   - Implement services in `services/`
   - Build components in `components/`
   - Create custom hooks in `hooks/`
   - Add utilities in `utils/`

4. **Create Page Route (if needed)**

   ```
   src/app/(group)/feature-name/
   ├── page.tsx              # Main page
   ├── layout.tsx            # Layout (if needed)
   └── loading.tsx           # Loading state
   ```

5. **Export Public API**

   ```typescript
   // src/modules/feature-name/index.tsx
   export { FeatureComponent } from "./components/FeatureComponent";
   export { useFeature } from "./hooks/useFeature";
   export type { FeatureType } from "./types/feature.types";
   ```

6. **Add E2E Tests**

   ```typescript
   // src/tests/e2e/feature-name.spec.ts
   import { test, expect } from "@playwright/test";

   test.describe("Feature Name", () => {
     test("should perform main user journey", async ({ page }) => {
       // Test implementation
     });
   });
   ```

7. **Update Documentation**
   - Add feature to README.md if user-facing
   - Update CLAUDE.md with module description
   - Add API documentation if needed

#### **Example: Adding a "Notifications" Feature**

```
1. Create structure:
   src/modules/notifications/

2. Write tests first:
   - notifications.service.test.ts
   - useNotifications.test.ts
   - NotificationList.test.tsx

3. Implement feature:
   - types/notification.types.ts
   - services/notifications.service.ts
   - hooks/useNotifications.ts
   - components/NotificationList.tsx
   - components/NotificationItem.tsx

4. Create page (if needed):
   src/app/(user)/notifications/page.tsx

5. Export public API:
   src/modules/notifications/index.tsx

6. Add E2E test:
   src/tests/e2e/notifications.spec.ts
```

#### **Shared vs Module-Specific**

**Use `src/shared/` for:**

- UI components used across multiple features
- Generic hooks (useMediaQuery, useDebounce)
- Common utilities (date formatting, validation)
- Global types (User, API Response)

**Use `src/modules/[feature]/` for:**

- Feature-specific components
- Feature-specific business logic
- Feature-specific hooks
- Feature-specific types
