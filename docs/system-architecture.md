# System Architecture Documentation

## Overview

This document outlines the comprehensive system architecture of the Zuno NFT Marketplace, detailing the technical implementation, data flow patterns, and architectural decisions that power the platform.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [System Components](#system-components)
- [Data Flow Architecture](#data-flow-architecture)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [API Integration](#api-integration)
- [Multi-Chain Architecture](#multi-chain-architecture)
- [Security Architecture](#security-architecture)
- [Scalability & Performance](#scalability--performance)
- [Deployment Architecture](#deployment-architecture)
- [Monitoring & Observability](#monitoring--observability)

## Architecture Overview

### High-Level Architecture

The Zuno NFT Marketplace follows a **modular monorepo architecture** with clear separation of concerns between the frontend application and backend services. The system is designed to be **scalable, maintainable, and secure** while providing an excellent user experience.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Zuno NFT Marketplace                         │
├─────────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)  │  Backend Services  │  Blockchain  │  Storage  │
│  ┌─────────────────┐  │  ┌─────────────┐  │  ┌─────────┐  │  ┌─────┐ │
│  │   App Router    │  │  │   API       │  │  │ Ethereum │  │  │IPFS │ │
│  │   (Route Groups)│  │  │   GraphQL   │  │  │ Polygon  │  │  │     │ │
│  │                 │  │  │   Search    │  │  │ Solana   │  │  │     │ │
│  │   Modules       │  │  │   Auth      │  │  │ Bitcoin  │  │  │     │ │
│  │   (Feature Based)│  │  │   Analytics │  │  │  ...     │  │  │     │ │
│  │                 │  │  │             │  │  │         │  │  │     │ │
│  │   Shared        │  │  │   Cache     │  │  │         │  │  │     │ │
│  │   (UI/Utils)    │  │  │             │  │  │         │  │  │     │ │
│  └─────────────────┘  │  └─────────────┘  │  └─────────┘  │  └─────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Modularity**: Each feature is isolated in its own module
2. **Type Safety**: Strict TypeScript throughout the entire stack
3. **Performance**: Optimized for speed and user experience
4. **Security**: Multiple layers of security protection
5. **Scalability**: Horizontal scaling capabilities
6. **Maintainability**: Clear code organization and documentation

## System Components

### Frontend Components

#### 1. Next.js Application Layer

**Structure:**

- **App Router**: Modern routing with route groups and layouts
- **Server Components**: Server-side rendering for SEO
- **Client Components**: Interactive features and state management
- **API Routes**: Serverless functions for backend operations

```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 2. Feature Modules

**Modular Architecture:**
Each feature is self-contained in its own module with clear boundaries:

```typescript
// src/modules/marketplace/index.tsx
export const MarketplaceModule = () => {
  return (
    <MarketplaceProvider>
      <MarketplaceHeader />
      <NFTGrid />
      <MarketplaceFilters />
      <MarketplaceFooter />
    </MarketplaceProvider>
  );
};
```

**Module Structure:**

```
src/modules/[module-name]/
├── components/          # Feature-specific components
├── hooks/              # Custom hooks for the module
├── services/           # API calls and business logic
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── index.ts           # Module exports
```

#### 3. Shared Resources

**Reusable Components:**

- **UI Components**: Shadcn/ui primitives
- **Layout Components**: Reusable layouts and containers
- **Utility Components**: Common functionality across modules

**Shared Services:**

- **GraphQL Client**: Apollo Client configuration
- **Web3 Integration**: Wagmi and Viem setup
- **State Management**: Zustand stores
- **Authentication**: SIWE and RainbowKit integration

### Backend Components

#### 1. GraphQL API

**Architecture:**

- **Apollo Client**: Frontend GraphQL client
- **Schema Federation**: Modular schema design
- **Caching**: Built-in caching with Apollo Cache
- **Real-time Updates**: Subscriptions for live data

```typescript
// src/shared/graphql/client.ts
const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          collections: {
            merge: (existing, incoming) => incoming,
          },
        },
      },
    },
  }),
});
```

#### 2. Search Service

**Elasticsearch Integration:**

- Full-text search capabilities
- Advanced filtering and faceting
- Real-time indexing
- Performance optimization

```typescript
// src/shared/services/search.service.ts
export class SearchService {
  private elasticsearchClient: Client;

  constructor() {
    this.elasticsearchClient = new Client({
      node: process.env.ELASTICSEARCH_URL,
      auth: {
        username: process.env.ELASTICSEARCH_USER,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    });
  }

  async searchNFTs(query: SearchQuery): Promise<SearchResults> {
    const response = await this.elasticsearchClient.search({
      index: "nfts",
      body: {
        query: {
          bool: {
            must: [
              { match: { name: query.query } },
              { terms: { chain: query.chains } },
              { range: { price: query.priceRange } },
            ],
          },
        },
        aggs: {
          categories: {
            terms: { field: "category" },
          },
          chains: {
            terms: { field: "chain" },
          },
        },
      },
    });

    return this.transformResults(response);
  }
}
```

#### 3. Analytics Service

**Real-time Analytics:**

- User behavior tracking
- Performance metrics
- Business intelligence
- Dashboard visualization

```typescript
// src/shared/services/analytics.service.ts
export class AnalyticsService {
  async trackPageView(page: string, userId?: string) {
    await this.track({
      event: "page_view",
      properties: {
        page,
        userId,
        timestamp: new Date(),
      },
    });
  }

  async trackTransaction(transaction: Transaction) {
    await this.track({
      event: "transaction",
      properties: {
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        userId: transaction.userId,
        timestamp: new Date(),
      },
    });
  }
}
```

## Data Flow Architecture

### 1. Request Flow

```
User Action → Component → Hook → Service → GraphQL/API → Backend → Blockchain → Response
```

### 2. Data Flow Pattern

```typescript
// Example: NFT Purchase Flow
const NFTPurchaseFlow = () => {
  // 1. User clicks purchase button
  const handlePurchase = async () => {
    // 2. Component calls hook
    const { purchaseNFT, isLoading } = useNFTPurchase();

    // 3. Hook calls service
    try {
      const txHash = await purchaseNFT(nft);

      // 4. Service calls GraphQL mutation
      const result = await graphqlClient.mutate({
        mutation: PURCHASE_NFT_MUTATION,
        variables: { txHash, nftId },
      });

      // 5. GraphQL calls backend API
      // 6. Backend interacts with blockchain
      // 7. Response flows back up the chain
    } catch (error) {
      // Error handling
    }
  };
};
```

### 3. State Management Flow

```typescript
// Global State Flow
const GlobalStateProvider = () => {
  // Zustand stores for global state
  const [user] = useUserStore();
  const [nfts] = useNFTStore();
  const [market] = useMarketStore();

  // React Query for server state
  const { data: collections } = useQuery(GET_COLLECTIONS);

  // Local component state
  const [selectedNFT, setSelectedNFT] = useState(null);

  return (
    <UserContext.Provider value={user}>
      <NFTContext.Provider value={{ nfts, selectedNFT, setSelectedNFT }}>
        <MarketContext.Provider value={market}>
          {children}
        </MarketContext.Provider>
      </NFTContext.Provider>
    </UserContext.Provider>
  );
};
```

## State Management

### 1. Global State (Zustand)

**Store Structure:**

```typescript
// src/shared/stores/user.store.ts
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: user => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setLoading: loading => set({ loading }),
}));
```

**Common Stores:**

- `useUserStore`: User authentication and profile
- `useNFTStore`: NFT collections and items
- `useMarketStore`: Market data and statistics
- `useWalletStore`: Wallet connections and balances
- `useUIStore`: UI state (modals, themes, etc.)

### 2. Server State (TanStack Query)

**Query Structure:**

```typescript
// src/shared/hooks/useNFTCollection.ts
export const useNFTCollection = (collectionId: string) => {
  return useQuery({
    queryKey: ["nft-collection", collectionId],
    queryFn: () => fetchNFTCollection(collectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
```

**Mutation Structure:**

```typescript
export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollection,
    onSuccess: newCollection => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.setQueryData(["collection", newCollection.id], newCollection);
    },
  });
};
```

### 3. Local State

**Component State:**

```typescript
const NFTCard = ({ nft }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card content */}
    </div>
  );
};
```

## Component Architecture

### 1. Component Hierarchy

```
App
├── Layouts
│   ├── RootLayout
│   ├── AuthLayout
│   └── PublicLayout
├── Pages
│   ├── Homepage
│   ├── CollectionPage
│   ├── NFTDetailPage
│   └── ProfilePage
├── Features
│   ├── Marketplace
│   ├── Minting
│   ├── Discovery
│   └── Analytics
└── Components
    ├── UI Components
    ├── Layout Components
    └── Feature Components
```

### 2. Component Patterns

**Presentational Component:**

```typescript
// Pure UI component
const NFTCard = ({ nft, onClick, className }) => {
  return (
    <div className={`nft-card ${className}`} onClick={onClick}>
      <img src={nft.image} alt={nft.name} />
      <h3>{nft.name}</h3>
      <p>{nft.price} ETH</p>
    </div>
  );
};
```

**Container Component:**

```typescript
// Business logic container
const NFTCardContainer = ({ nft }) => {
  const { purchaseNFT, isLoading } = useNFTPurchase();
  const { addToWatchlist } = useWatchlist();

  const handlePurchase = async () => {
    await purchaseNFT(nft.id);
  };

  const handleAddToWatchlist = () => {
    addToWatchlist(nft);
  };

  return (
    <NFTCard
      nft={nft}
      onClick={handlePurchase}
      onAddToWatchlist={handleAddToWatchlist}
      isLoading={isLoading}
    />
  );
};
```

### 3. Error Boundaries

**Error Boundary Pattern:**

```typescript
class NFTErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackComponent />;
    }
    return this.props.children;
  }
}
```

## API Integration

### 1. GraphQL Schema

**Schema Design:**

```graphql
# src/shared/graphql/schemas/
type Query {
  collections(first: Int, after: String): CollectionConnection
  nfts(first: Int, after: String, filters: NFTFilters): NFTConnection
  user(id: ID!): User
  marketStats: MarketStats
}

type Mutation {
  createCollection(input: CreateCollectionInput!): Collection
  purchaseNFT(nftId: ID!, price: String!): Transaction
  followUser(userId: ID!): User
}

type Subscription {
  newNFT: NFT
  priceUpdate: PriceUpdate
  transaction: Transaction
}
```

### 2. Data Fetching Strategy

**Optimized Data Fetching:**

```typescript
// src/shared/services/api.service.ts
export class APIService {
  private apolloClient: ApolloClient<any>;

  constructor() {
    this.apolloClient = createApolloClient();
  }

  // Batch multiple queries
  async batchQueries(queries: Query[]) {
    const results = await Promise.allSettled(queries.map(query => this.apolloClient.query(query)));

    return results.map(result => (result.status === "fulfilled" ? result.value : null));
  }

  // Optimistic updates
  async optimisticUpdate(mutation: Mutation, optimisticData: any) {
    return this.apolloClient.mutate({
      mutation,
      optimisticResponse: optimisticData,
      update: (cache, { data }) => {
        cache.modify({
          fields: {
            // Update cache optimistically
          },
        });
      },
    });
  }
}
```

### 3. Caching Strategy

**Multi-level Caching:**

```typescript
// src/shared/cache/cache.strategy.ts
export class CacheStrategy {
  // Client-side caching with React Query
  static getClientSideCache() {
    return {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    };
  }

  // Server-side caching with Redis
  static getServerSideCache() {
    return {
      ttl: 3600, // 1 hour
      key: params => JSON.stringify(params),
    };
  }
}
```

## Multi-Chain Architecture

### 1. Chain Configuration

**Chain Registry:**

```typescript
// src/shared/config/chains.ts
export const CHAINS = {
  ETHEREUM: {
    id: "1",
    name: "Ethereum",
    symbol: "ETH",
    blockExplorer: "https://etherscan.io",
    rpcUrl: process.env.ETHEREUM_RPC_URL,
    isTestnet: false,
  },
  POLYGON: {
    id: "137",
    name: "Polygon",
    symbol: "MATIC",
    blockExplorer: "https://polygonscan.com",
    rpcUrl: process.env.POLYGON_RPC_URL,
    isTestnet: false,
  },
  // ... more chains
};
```

### 2. Multi-Chain Contracts

**Contract Interface:**

```typescript
// src/shared/contracts/contract.interface.ts
interface NFTContract {
  address: `0x${string}`;
  abi: any[];
  chainId: string;
  standard: "ERC721" | "ERC1155";
}

interface MarketplaceContract {
  address: `0x${string}`;
  abi: any[];
  chainId: string;
  fee: number; // Basis points
}
```

### 3. Chain-Aware Components

**Multi-Chain Component:**

```typescript
// src/shared/components/ChainSwitcher.tsx
export const ChainSwitcher = () => {
  const { chainId, switchChain } = useSwitchChain();
  const chains = Object.values(CHAINS);

  return (
    <Select value={chainId} onValueChange={switchChain}>
      {chains.map(chain => (
        <SelectItem key={chain.id} value={chain.id}>
          {chain.name} ({chain.symbol})
        </SelectItem>
      ))}
    </Select>
  );
};
```

## Security Architecture

### 1. Authentication Flow

**SIWE Authentication:**

```typescript
// src/shared/auth/siwe.service.ts
export class SIWEService {
  async signIn(message: SIWEMessage) {
    // Verify signature
    const isValid = await verifySignature(message, signature);

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    // Check nonce
    const nonceValid = await verifyNonce(message.nonce);

    if (!nonceValid) {
      throw new Error("Invalid or expired nonce");
    }

    // Create session
    const session = await createSession({
      address: message.address,
      chainId: message.chainId,
      issuedAt: message.issuedAt,
    });

    return session;
  }
}
```

### 2. Wallet Security

**Secure Wallet Connection:**

```typescript
// src/shared/wallet/wallet.service.ts
export class WalletService {
  async connectWallet(provider: WalletProvider) {
    // Validate provider
    if (!isValidProvider(provider)) {
      throw new Error("Invalid wallet provider");
    }

    // Request accounts
    const accounts = await provider.request({ method: "eth_requestAccounts" });

    // Verify user is on correct chain
    await this.switchToCorrectChain();

    // Get wallet balance
    const balance = await this.getBalance(accounts[0]);

    return {
      address: accounts[0],
      balance,
      provider,
    };
  }
}
```

### 3. Input Validation

**Validation Pipeline:**

```typescript
// src/shared/validation/validation.service.ts
export class ValidationService {
  validateNFTInput(input: CreateNFTInput): ValidationResult {
    // Schema validation
    const schema = z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(1000),
      price: z.string().regex(/^\d+(\.\d+)?$/),
      imageUrl: z.string().url(),
    });

    return schema.safeParse(input);
  }

  sanitizeInput(input: any): any {
    // Remove potentially dangerous properties
    const sanitized = { ...input };

    // Remove prototype properties
    delete sanitized.__proto__;

    // Sanitize strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === "string") {
        sanitized[key] = this.sanitizeString(sanitized[key]);
      }
    });

    return sanitized;
  }
}
```

## Scalability & Performance

### 1. Frontend Optimization

**Code Splitting:**

```typescript
// Dynamic imports for heavy components
const NFTDetailPage = dynamic(
  () => import('./NFTDetailPage'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

const CollectionGrid = dynamic(
  () => import('./CollectionGrid'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);
```

**Image Optimization:**

```typescript
// Next.js Image component
import Image from 'next/image';

const OptimizedImage = ({ src, alt, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt}
      // Automatic optimization
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={props.priority}
      {...props}
    />
  );
};
```

### 2. Backend Optimization

**Database Optimization:**

```typescript
// src/shared/database/optimization.ts
export class DatabaseOptimization {
  // Indexing strategy
  static getIndexes() {
    return [
      { name: "collections_created_at", fields: ["createdAt"] },
      { name: "nfts_price", fields: ["price"] },
      { name: "users_address", fields: ["address"] },
      { name: "market_stats_chain_date", fields: ["chainId", "date"] },
    ];
  }

  // Query optimization
  static optimizeQuery(query: Query) {
    // Add indexes for common query patterns
    if (query.filters?.chainId) {
      query.indexHint = "market_stats_chain_date";
    }

    return query;
  }
}
```

### 3. Caching Strategy

**Multi-level Caching:**

```typescript
// src/shared/cache/cache.service.ts
export class CacheService {
  private client: Redis;
  private memoryCache: Map<string, CacheEntry>;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL);
    this.memoryCache = new Map();
  }

  async get(key: string): Promise<any> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.value;
    }

    // Check Redis cache
    const redisEntry = await this.client.get(key);
    if (redisEntry) {
      const parsed = JSON.parse(redisEntry);

      // Update memory cache
      this.memoryCache.set(key, parsed);

      return parsed.value;
    }

    return null;
  }

  async set(key: string, value: any, ttl: number = 3600) {
    const entry = {
      value,
      expiresAt: Date.now() + ttl * 1000,
    };

    // Set in memory cache
    this.memoryCache.set(key, entry);

    // Set in Redis
    await this.client.set(key, JSON.stringify(entry), "EX", ttl);
  }
}
```

## Deployment Architecture

### 1. Infrastructure as Code

**Terraform Configuration:**

```hcl
# terraform/main.tf
resource "aws_s3_bucket" "nft_storage" {
  bucket = "zuno-nft-storage-${var.environment}"
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.nft_storage.bucket_regional_domain_name
    origin_id   = "S3-nft-storage"
  }

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-viewer"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
}

resource "aws_ecs_cluster" "marketplace" {
  name = "zuno-marketplace-${var.environment}"
}
```

### 2. CI/CD Pipeline

**GitHub Actions:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:e2e
      - run: pnpm lint
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ${{ secrets.TASK_DEFINITION }}
          service: zuno-marketplace
          cluster: zuno-marketplace-prod
          image: ${{ secrets.ECR_IMAGE }}
          force-new-deployment: true
```

## Monitoring & Observability

### 1. Application Monitoring

**Performance Monitoring:**

```typescript
// src/shared/monitoring/performance.ts
export class PerformanceMonitor {
  static trackPageLoad() {
    if (typeof window !== "undefined") {
      const navigation = window.performance.getEntriesByType("navigation")[0];

      if (navigation) {
        track("page_load", {
          domComplete: navigation.domComplete,
          loadEventEnd: navigation.loadEventEnd,
          responseEnd: navigation.responseEnd,
        });
      }
    }
  }

  static trackComponentRender(component: string, duration: number) {
    track("component_render", {
      component,
      duration,
      timestamp: Date.now(),
    });
  }
}
```

### 2. Error Tracking

**Error Monitoring:**

```typescript
// src/shared/monitoring/errors.ts
export class ErrorTracker {
  static trackError(error: Error, context?: any) {
    // Sentry integration
    Sentry.captureException(error, {
      extra: {
        component: context?.component,
        userId: context?.userId,
        timestamp: Date.now(),
      },
    });

    // Custom tracking
    track("error", {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  static trackUserFacingError(error: Error, userMessage: string) {
    this.trackError(error, {
      userMessage,
      isUserFacing: true,
    });
  }
}
```

### 3. Business Metrics

**Metric Tracking:**

```typescript
// src/shared/monitoring/metrics.ts
export class MetricsTracker {
  static trackPurchase(purchase: Purchase) {
    // Track to analytics service
    track("purchase", {
      amount: purchase.amount,
      currency: purchase.currency,
      nftId: purchase.nftId,
      userId: purchase.userId,
      timestamp: Date.now(),
    });

    // Track to business intelligence
    this.trackToBI(purchase);
  }

  static trackUserAction(action: string, data: any) {
    track("user_action", {
      action,
      data,
      userId: getCurrentUserId(),
      timestamp: Date.now(),
    });
  }
}
```

This comprehensive system architecture document provides a detailed overview of the technical implementation of the Zuno NFT Marketplace, ensuring scalability, maintainability, and excellent user experience.
