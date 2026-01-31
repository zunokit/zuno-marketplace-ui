# Zuno Marketplace UI - Deployment Guide

**Version**: 0.1.0
**Last Updated**: 2026-01-31
**Recommended Platform**: Vercel

---

## 1. Prerequisites

### 1.1 System Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20.x or higher | LTS recommended |
| pnpm | 9.x or higher | Package manager |
| Git | 2.x or higher | Version control |

### 1.2 Required Accounts

- **Vercel Account**: For deployment hosting
- **Sentry Account**: For error monitoring (optional)
- **WalletConnect Cloud**: For wallet integration (optional)

---

## 2. Environment Variables

### 2.1 Required Variables

Create a `.env.local` file for local development:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=https://api.zuno.io
NEXT_PUBLIC_GRAPHQL_URL=https://api.zuno.io/graphql

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 2.2 Optional Variables

```bash
# Blockchain RPC URLs (uses defaults if not set)
NEXT_PUBLIC_ANVIL_RPC=http://127.0.0.1:8545
NEXT_PUBLIC_ETHEREUM_RPC=https://eth.llamarpc.com
NEXT_PUBLIC_POLYGON_RPC=https://polygon-rpc.com
NEXT_PUBLIC_BSC_RPC=https://bsc-dataseed.binance.org
NEXT_PUBLIC_ARBITRUM_RPC=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_OPTIMISM_RPC=https://mainnet.optimism.io

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_token

# Error Monitoring (Optional)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your_auth_token

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_AUCTIONS=true
NEXT_PUBLIC_ENABLE_LAUNCHPAD=true
```

### 2.3 Variable Categories

| Prefix | Scope | Example |
|--------|-------|---------|
| `NEXT_PUBLIC_` | Client + Server | `NEXT_PUBLIC_API_URL` |
| No prefix | Server only | `SENTRY_AUTH_TOKEN` |

---

## 3. Local Development Setup

### 3.1 Installation

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

### 3.2 Development Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `pnpm dev` | Start development server |
| Build | `pnpm build` | Create production build |
| Start | `pnpm start` | Start production server |
| Lint | `pnpm lint` | Run ESLint |
| Lint Fix | `pnpm lint:fix` | Fix ESLint errors |
| Type Check | `pnpm typecheck` | Run TypeScript check |
| Format | `pnpm format` | Format with Prettier |
| Format Check | `pnpm check-format` | Check formatting |
| Codegen | `pnpm codegen` | Generate GraphQL types |
| Codegen Watch | `pnpm codegen:watch` | Watch mode for codegen |

---

## 4. Build Process

### 4.1 Production Build

```bash
# Clean install
pnpm install --frozen-lockfile

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Build application
pnpm build
```

### 4.2 Build Output

The build creates the following structure:

```
.next/
├── server/           # Server-side code
├── static/           # Static assets
├── chunks/           # JavaScript chunks
└── ...
```

### 4.3 Build Optimization

The build includes:
- Automatic code splitting
- Tree shaking for unused code
- Image optimization
- Font optimization
- CSS optimization

---

## 5. Vercel Deployment

### 5.1 Initial Setup

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link project
   vercel link
   ```

2. **Configure Project**
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

### 5.2 Environment Variables in Vercel

Add environment variables in Vercel Dashboard:

1. Go to Project Settings > Environment Variables
2. Add each variable from `.env.example`
3. Set appropriate environments (Production, Preview, Development)

### 5.3 Deployment Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Or use git push (auto-deploys)
git push origin main
```

### 5.4 Vercel Configuration

```json
// vercel.json (optional)
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "@next_public_app_url"
  }
}
```

---

## 6. Alternative Deployment Options

### 6.1 Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"]
```

Build and run:

```bash
docker build -t zuno-marketplace .
docker run -p 3000:3000 --env-file .env.local zuno-marketplace
```

### 6.2 Self-Hosted Deployment

```bash
# Build locally
pnpm build

# Copy to server
scp -r .next public package.json pnpm-lock.yaml user@server:/var/www/zuno-marketplace

# On server
cd /var/www/zuno-marketplace
pnpm install --prod
pnpm start
```

---

## 7. Post-Deployment Verification

### 7.1 Health Checks

| Check | Command/URL | Expected Result |
|-------|-------------|-----------------|
| App Running | `curl https://your-domain.com` | 200 OK |
| API Connection | Check network tab | GraphQL requests succeed |
| Wallet Connection | Connect MetaMask | Connection successful |
| Build ID | View page source | `__NEXT_DATA__` present |

### 7.2 Monitoring Setup

1. **Sentry Configuration**
   - Verify DSN is set
   - Check error reporting
   - Set up alerts

2. **Vercel Analytics**
   - Enable Web Vitals
   - Monitor performance
   - Check error rates

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails | TypeScript errors | Run `pnpm typecheck` |
| Wallet won't connect | Missing env var | Check `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` |
| API 404 | Wrong API URL | Verify `NEXT_PUBLIC_API_URL` |
| Styles missing | Build issue | Clear `.next` and rebuild |

### 8.2 Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env)"

# Verify build output
ls -la .next/

# Check bundle size
pnpm build --analyze

# Debug Sentry
SENTRY_LOG_LEVEL=debug pnpm build
```

---

## 9. Security Checklist

Before production deployment:

- [ ] All secrets in environment variables (not in code)
- [ ] `NEXT_PUBLIC_` prefix only for client-safe variables
- [ ] Sentry DSN configured for error tracking
- [ ] CORS configured correctly on API
- [ ] Content Security Policy headers set
- [ ] HTTPS enforced
- [ ] Sensitive routes protected

---

## 10. Rollback Procedure

If deployment fails:

```bash
# Using Vercel CLI
vercel rollback

# Or via Git
# Revert commit and push
git revert HEAD
git push

# Redeploy previous version
vercel --prod
```
