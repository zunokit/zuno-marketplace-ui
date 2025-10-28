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

**FORBIDDEN:**

- ❌ Writing implementation before tests
- ❌ Skipping/removing tests to make code "work"
- ❌ Leaving any tests failing
- ❌ Committing code without running all tests
- ❌ Making changes without corresponding test coverage

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

#### **4. Testing Best Practices**

- Place unit tests alongside components or in `src/__tests__/`
- Place E2E tests in `src/tests/e2e/`
- Use descriptive test names that explain behavior
- Mock external dependencies and API calls
- Test error states and edge cases, not just happy paths
- Keep tests independent and isolated

### Creating documentation markdown files (\*.md)

**Do not create any documentation files unless I explicitly approve it. If you believe a documentation file is needed, please ask for my confirmation first.**

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
