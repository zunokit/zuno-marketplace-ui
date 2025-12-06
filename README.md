<div align="center">
  <h1>🎨 Zuno NFT Marketplace</h1>
  <p><strong>A modern multi-chain NFT marketplace built with Next.js 15, React 19, and TypeScript</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </div>

  <br />

  <div>
    <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status" />
    <img src="https://img.shields.io/badge/Build-Passing-brightgreen" alt="Build" />
    <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version" />
  </div>
</div>

## ✨ Features

- 🏪 **Multi-chain NFT Trading** - Buy, sell, and trade across Ethereum, Polygon, and more
- 🎨 **NFT Minting** - Create collections and mint NFTs with batch minting support
- 🔍 **Advanced Discovery** - Search, filter, and explore collections with smart recommendations
- 🚀 **Launch Pad** - Showcase upcoming NFT drops with countdown timers and allowlists
- 🌓 **Modern UI** - Dark/light themes with responsive design
- 🔐 **Secure Auth** - SIWE (Sign-In with Ethereum) authentication
- 📊 **Analytics** - Track market trends and collection performance

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Strict type safety
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/ui** - High-quality component library

### Web3
- **Wagmi 2.19.4** - Ethereum React hooks
- **Viem 2.39.0** - TypeScript interface for Ethereum
- **RainbowKit** - Wallet connection UI
- **SIWE** - Ethereum authentication

### State & Data
- **Apollo Client** - GraphQL client with caching
- **React Hook Form** - Form management with Zod validation
- **Zustand** - Lightweight state management

### Testing
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- PNPM 8.0+ (recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/ZunoKit/zuno-marketplace-ui.git
cd zuno-marketplace-ui

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to view the application.

## 📚 Scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `pnpm dev`      | Start dev server with Turbopack         |
| `pnpm build`    | Build production application            |
| `pnpm start`    | Start production server                 |
| `pnpm lint`     | Run ESLint                              |
| `pnpm lint:fix` | Run ESLint with auto-fix                |
| `pnpm test`     | Run unit tests                          |
| `pnpm test:e2e` | Run E2E tests                           |

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (discover)/     # Discovery pages
│   ├── mint/           # Minting workflows
│   └── launch-pad/     # Launch features
├── modules/            # Business logic modules
│   ├── product-discovery/  # Marketplace discovery
│   ├── mint/             # NFT creation
│   ├── profile/          # User profiles
│   └── auctions/         # Live auctions
└── shared/             # Shared resources
    ├── components/ui/   # Shadcn/ui components
    ├── graphql/         # GraphQL setup
    ├── types/          # TypeScript types
    └── hooks/          # Custom hooks
```

## 🎨 Component System

We use Shadcn/ui with Radix UI primitives:

- Accessible components with ARIA support
- Dark/light mode support
- TypeScript-first development
- Customizable with Tailwind CSS

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Generate coverage
pnpm test:coverage
```

## 🌐 Multi-chain Support

Supported networks:
- Ethereum Mainnet
- Polygon
- Sepolia Testnet
- Local Anvil (development)

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_CHAIN_ID=1
```

### GraphQL Schema

Schema files in `src/shared/graphql/schemas/`:
- `auth.graphql` - Authentication operations
- `user.graphql` - User management
- `nft.graphql` - NFT operations
- `collection.graphql` - Collection management

Run `pnpm codegen` to generate TypeScript types and hooks.

## 📖 Documentation

- [Project Overview PDR](docs/project-overview-pdr.md) - Product Development Requirements
- [Codebase Summary](docs/codebase-summary.md) - Complete overview of codebase structure
- [Code Standards](docs/code-standards.md) - Development guidelines and best practices
- [System Architecture](docs/system-architecture.md) - Technical architecture documentation
- [Design Guidelines](docs/design-guidelines.md) - Design system and UI patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the RED-GREEN-REFACTOR methodology
4. Write tests for new features
5. Run `pnpm lint:fix` before committing
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- Documentation: [docs.zuno-marketplace.com](https://docs.zuno-marketplace.com)
- Issues: [GitHub Issues](https://github.com/ZunoKit/zuno-marketplace-ui/issues)
- Discord: [Join community](https://discord.gg/zuno)

---

<div align="center">
  <p>Made with ❤️ by the Zuno team</p>
</div>