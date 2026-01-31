# Zuno Marketplace UI

A modern, high-performance NFT marketplace application built with Next.js 16, React 19, and Web3 technologies.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.19.5-3C3C3D?logo=ethereum)](https://wagmi.sh/)

## Features

- **NFT Trading**: Buy, sell, and trade digital collectibles
- **Auction System**: Bid on exclusive NFTs with real-time updates
- **Launchpad**: Create and launch new NFT collections
- **Multi-Chain Support**: Ethereum, Polygon, BSC, and more
- **Web3 Integration**: MetaMask and WalletConnect support
- **Responsive Design**: Optimized for all devices
- **Dark/Light Themes**: Choose your preferred appearance

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack Query](https://tanstack.com/query)
- **Web3**: [Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/) + [RainbowKit](https://www.rainbowkit.com/)
- **Data**: [Apollo Client](https://www.apollographql.com/docs/react/) + [GraphQL](https://graphql.org/)
- **Monitoring**: [Sentry](https://sentry.io/)

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- pnpm 9.x or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/zunokit/zuno-marketplace-ui.git
cd zuno-marketplace-ui

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```bash
# Required
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://api.zuno.io
NEXT_PUBLIC_GRAPHQL_URL=https://api.zuno.io/graphql
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm format` | Format code with Prettier |
| `pnpm codegen` | Generate GraphQL types |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (analytics)/        # Analytics pages
│   ├── (creator)/          # NFT creation flows
│   ├── (discover)/         # Discovery/homepage
│   ├── (marketplace)/      # Marketplace pages
│   └── (user)/             # User profiles & wallets
├── modules/                # Feature modules
│   ├── auctions/           # Auction functionality
│   ├── collections/        # Collection management
│   ├── marketplace/        # Core marketplace
│   ├── profile/            # User profiles
│   └── wallets/            # Wallet management
└── shared/                 # Shared resources
    ├── components/         # UI components (53+ shadcn/ui)
    ├── hooks/              # Custom React hooks
    ├── stores/             # Zustand stores
    ├── graphql/            # GraphQL schemas
    └── utils/              # Utilities
```

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- [Project Overview & PDR](./docs/project-overview-pdr.md) - Project goals, tech stack, and requirements
- [Codebase Summary](./docs/codebase-summary.md) - Architecture and directory structure
- [Code Standards](./docs/code-standards.md) - Naming conventions and TypeScript standards
- [System Architecture](./docs/system-architecture.md) - Detailed architecture diagrams
- [Project Roadmap](./docs/project-roadmap.md) - Development phases and timeline
- [Deployment Guide](./docs/deployment-guide.md) - Deployment instructions
- [Design Guidelines](./docs/design-guidelines.md) - UI/UX standards and patterns

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

See the [Deployment Guide](./docs/deployment-guide.md) for detailed instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Code Standards](./docs/code-standards.md) before contributing.

## License

[MIT](./LICENSE)

## Support

For support, email support@zuno.io or join our Discord community.

---

Built with love by the Zuno Team.
