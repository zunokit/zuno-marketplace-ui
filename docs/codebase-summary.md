# Codebase Summary

## Project Overview

Zuno NFT Marketplace is a modern, feature-rich NFT trading platform built with cutting-edge web technologies. The project follows a modular architecture with clear separation of concerns, making it scalable and maintainable for multi-chain NFT operations.

## Technology Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Strict type safety enabled
- **Tailwind CSS v4** - Utility-first CSS framework

### Web3 Integration
- **Wagmi 2.19.4** - Ethereum React hooks and utilities
- **Viem 2.39.0** - TypeScript interface for Ethereum
- **RainbowKit** - Wallet connection UI and components
- **SIWE** - Sign-In with Ethereum authentication

### State Management & Data
- **Apollo Client 4** - GraphQL client with caching
- **React Hook Form** - Form management with Zod validation
- **Zustand** - Lightweight state management
- **TanStack React Query** - Server state management

### UI Components & Styling
- **Shadcn/ui** - High-quality component library
- **Radix UI** - Low-level primitives for accessible components
- **Lucide React** - Beautiful & consistent icon library
- **Framer Motion** - Animation library for React
- **Tailwind Merge** - Merge Tailwind CSS classes safely

### Testing & Development Tools
- **Jest** - Unit testing framework
- **React Testing Library** - Testing utilities for React components
- **Playwright** - E2E testing framework
- **GraphQL Codegen** - TypeScript code generation from GraphQL

## Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (discover)/                  # Discovery route group
│   ├── (marketplace)/               # Marketplace route group
│   ├── (creator)/                   # Creator route group
│   ├── (user)/                      # User route group
│   ├── (analytics)/                 # Analytics route group
│   ├── actions/                     # Server actions
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
├── modules/                         # Feature modules
│   ├── marketplace/                 # Core marketplace functionality
│   ├── launch-pad/                 # NFT minting & launch pad
│   ├── product-discovery/           # Discovery and exploration
│   ├── profile/                     # User profiles
│   ├── auctions/                    # Auction system
│   ├── collections/                 # Collection management
│   ├── launchpad/                   # Launch pad features
│   ├── explore/                     # Explore functionality
│   ├── create/                      # Creation tools
│   ├── activity/                    # Activity tracking
│   ├── stats/                       # Statistics and analytics
│   ├── nft-detail/                 # NFT detail pages
│   ├── chain/                       # Chain-specific functionality
│   └── wallets/                     # Wallet management
├── shared/                          # Shared resources
│   ├── components/                  # Reusable components
│   │   └── ui/                      # Shadcn/ui components
│   ├── graphql/                     # GraphQL setup and schemas
│   │   └── schemas/                 # GraphQL schema files
│   ├── hooks/                       # Custom React hooks
│   ├── types/                       # TypeScript type definitions
│   ├── utils/                       # Utility functions
│   ├── lib/                         # Library files
│   ├── config/                      # Configuration files
│   ├── constants/                   # Application constants
│   ├── api/                         # API utilities
│   ├── providers/                   # Context providers
│   ├── services/                    # Service layer
│   └── theme/                       # Theme configuration
└── ... other directories
```

## Key Modules Architecture

### 1. Marketplace Module (`src/modules/marketplace/`)
Core trading functionality including:
- NFT buying and selling
- Order book management
- Price charts and analytics
- Transaction processing

### 2. Launch Pad Module (`src/modules/launch-pad/`)
NFT creation and minting:
- Single and batch minting
- Collection creation wizard
- Royalty configuration
- IPFS integration

### 3. Product Discovery (`src/modules/product-discovery/`)
Advanced discovery features:
- Search and filtering
- Recommendation engine
- Trending collections
- Smart categorization

### 4. Profile Module (`src/modules/profile/`)
User management:
- Profile creation and editing
- Collection showcase
- Activity history
- Favorites and watchlists

### 5. Auctions Module (`src/modules/auctions/`)
Auction functionality:
- Live auction rooms
- Bidding system
- Timer management
- Winner determination

## Data Flow Architecture

### GraphQL Schema Organization
The GraphQL API is organized into domain-specific schemas:
- `auth.graphql` - Authentication operations
- `user.graphql` - User management
- `nft.graphql` - NFT operations
- `collection.graphql` - Collection management
- `marketplace.graphql` - Trading operations

### State Management Pattern
- **Global State**: Zustand stores for application-wide state
- **Server State**: TanStack Query for server data caching
- **Local State**: React hooks for component-level state
- **Form State**: React Hook Form with Zod validation

### Component Architecture
- **Layout Components**: Page layouts and structure
- **UI Components**: Shadcn/ui primitives with customization
- **Feature Components**: Domain-specific business logic
- **Hook Components**: Custom hooks for reusable logic

## Multi-Chain Support

### Supported Networks
- Ethereum Mainnet (Chain ID: 1)
- Polygon (Chain ID: 137)
- Sepolia Testnet (Chain ID: 11155111)
- Local Anvil (Development)

### Chain Configuration
Chain-specific configurations are stored in:
- `src/shared/config/chains.ts`
- Environment variables for network settings
- Dynamic network switching capabilities

## Testing Strategy

### Unit Testing
- Jest with React Testing Library
- Component testing with user interactions
- Utility function testing
- Hook testing with custom renderers

### E2E Testing
- Playwright for end-to-end scenarios
- Cross-browser testing
- Wallet integration testing
- Transaction flow validation

### Coverage Targets
- Minimum 80% line coverage
- 100% critical path coverage
- Security-sensitive feature coverage

## Build & Development

### Scripts
- `pnpm dev` - Development server with Turbopack
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run E2E tests
- `pnpm codegen` - Generate GraphQL types
- `pnpm lint` - Code linting
- `pnpm format` - Code formatting

### Environment Configuration
Environment variables are required for:
- GraphQL API endpoints
- Network configuration
- Wallet provider settings
- Analytics and tracking
- IPFS storage configuration

## Security Considerations

### Authentication
- SIWE (Sign-In with Ethereum) for Web3 authentication
- Session management with RainbowKit
- Secure token handling

### Data Validation
- Zod schemas for runtime validation
- TypeScript compile-time checks
- GraphQL schema validation
- Input sanitization

### Security Best Practices
- Environment variable protection
- Secure error handling
- Rate limiting considerations
- Access control patterns

## Performance Optimization

### Rendering Strategy
- Next.js static generation where possible
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Code splitting at route level

### Caching Strategy
- TanStack Query for server state caching
- GraphQL client caching with Apollo
- Browser storage for user preferences
- CDN integration for static assets

### Bundle Optimization
- Tree shaking for unused code
- Dynamic imports for third-party libraries
- Code splitting by route
- Image optimization

## Development Workflow

### Code Quality
- ESLint with Next.js rules
- Prettier for code formatting
- TypeScript strict mode
- Pre-commit hooks

### Git Workflow
- Feature branches from main
- Pull request reviews
- Automated testing on CI
- Semantic versioning

### Documentation
- JSDoc for TypeScript interfaces
- Component documentation
- API documentation with GraphQL
- Development guides and patterns

This architecture provides a solid foundation for a scalable, maintainable NFT marketplace with modern development practices and comprehensive testing coverage.