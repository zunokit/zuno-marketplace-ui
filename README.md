<div align="center">
  <h1>🎨 Zuno NFT Marketplace</h1>
  <p><strong>A next-generation multi-chain NFT marketplace built with cutting-edge web technologies</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </div>

  <br />

  <div>
    <img src="https://img.shields.io/github/license/anthropics/claude-code?style=flat-square" alt="License" />
    <img src="https://img.shields.io/github/stars/anthropics/claude-code?style=flat-square" alt="Stars" />
    <img src="https://img.shields.io/github/forks/anthropics/claude-code?style=flat-square" alt="Forks" />
    <img src="https://img.shields.io/github/issues/anthropics/claude-code?style=flat-square" alt="Issues" />
  </div>
</div>

## ✨ Features

### 🏪 **Marketplace Core**

- **Multi-chain Support** - Trade NFTs across multiple blockchain networks
- **Collection Discovery** - Explore featured collections with interactive carousels
- **Advanced Search & Filtering** - Find specific NFTs and collections quickly
- **Real-time Price Updates** - Live market data and pricing information

### 🎨 **NFT Creation & Management**

- **Collection Builder** - Create and deploy NFT collections with ease
- **Batch Minting** - Efficient bulk NFT creation tools
- **Edition Management** - Handle multiple editions and variants
- **Metadata Management** - Rich metadata support with IPFS integration

### 🚀 **Launch Pad**

- **Project Launches** - Showcase upcoming NFT drops
- **Countdown Timers** - Build anticipation for upcoming releases
- **Allowlist Management** - Exclusive access control for early supporters
- **Multi-stage Launches** - Support for complex launch strategies

### 🎯 **User Experience**

- **Dark/Light Theme** - Seamless theme switching
- **Responsive Design** - Perfect experience across all devices
- **Accessibility First** - Built with WCAG guidelines in mind
- **Progressive Web App** - App-like experience in the browser

## 🛠️ Tech Stack

### **Frontend Framework**

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### **Styling & UI**

- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Framer Motion** - Production-ready motion library

### **Development Tools**

- **ESLint** - Code linting and formatting
- **Turbopack** - Ultra-fast bundler for development
- **PNPM** - Fast, disk space efficient package manager

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17 or later
- **PNPM** 8.0 or later (recommended) or npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   https://github.com/ZunoKit/zuno-marketplace-ui.git
   cd zuno-marketplace-ui
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 📚 Available Scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `pnpm dev`      | Start development server with Turbopack |
| `pnpm build`    | Build production application            |
| `pnpm start`    | Start production server                 |
| `pnpm lint`     | Run ESLint                              |
| `pnpm lint:fix` | Run ESLint with auto-fix                |

## 🏗️ Project Structure

```
zuno-marketplace-ui/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 app/                # Next.js App Router
│   │   ├── 📁 (discover)/     # Discovery pages
│   │   ├── 📁 mint/           # NFT minting pages
│   │   └── 📁 launch-pad/     # Project launch pages
│   │
│   ├── 📁 modules/            # Business logic modules
│   │   ├── 📁 auth/           # Authentication
│   │   ├── 📁 mint/           # NFT creation & minting
│   │   ├── 📁 product-discovery/ # Marketplace discovery
│   │   └── 📁 chain/          # Blockchain integration
│   │
│   └── 📁 shared/             # Shared resources
│       ├── 📁 components/     # Reusable UI components
│       ├── 📁 hooks/          # Custom React hooks
│       ├── 📁 types/          # TypeScript type definitions
│       └── 📁 utils/          # Utility functions
│
├── 📄 components.json         # Shadcn/ui configuration
├── 📄 tailwind.config.js      # Tailwind CSS configuration
└── 📄 next.config.ts          # Next.js configuration
```

### **Module Architecture**

Each module follows a consistent structure:

```
module-name/
├── __tests__
├── index.ts              # Public API exports
├── components/           # Module-specific components
├── hooks/               # Module-specific hooks
├── services/            # API and business logic
├── types/               # Module type definitions
└── utils/               # Module utilities
```

## 🎨 Component Library

We use a custom implementation of [Shadcn/ui](https://ui.shadcn.com/) components:

- **Accessible** - Built on Radix UI primitives
- **Customizable** - Easy to modify and extend
- **Type-safe** - Full TypeScript support
- **Theme-aware** - Dark/light mode support

### Adding New Components

```bash
npx shadcn-ui@latest add [component-name]
```

## 🌐 Multi-chain Support

The platform is designed to support multiple blockchain networks:

- **Ethereum** - ERC-721, ERC-1155
- **Solana** - SPL tokens
- **Polygon** - Layer 2 scaling
- **And more...** - Extensible architecture

## 🧪 Testing

We use Vitest for unit tests and Playwright for E2E tests.

```bash
# Run unit tests
pnpm test

# Run unit tests with UI
pnpm test:ui

# Run unit tests (single run)
pnpm test:run

# Generate coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in headed mode
pnpm test:e2e:headed
```

## 📦 Deployment

### **Vercel (Recommended)**

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on every push

### **Manual Deployment**

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run linting: `pnpm lint:fix`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@zuno-marketplace.com
- 💬 **Discord**: [Join our community](https://discord.gg/zuno)
- 📖 **Documentation**: [docs.zuno-marketplace.com](https://docs.zuno-marketplace.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/zuno-marketplace-ui/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the incredible React framework
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives

---

<div align="center">
  <p>Made with ❤️ by the Zuno team</p>
  <p>
    <a href="https://github.com/your-username/zuno-marketplace-ui">⭐ Star us on GitHub</a> •
    <a href="https://twitter.com/zuno_marketplace">🐦 Follow on Twitter</a> •
    <a href="https://zuno-marketplace.com">🌐 Visit our website</a>
  </p>
</div>
