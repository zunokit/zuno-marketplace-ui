# Production-Grade Logging Best Practices for Next.js Applications

**Date:** 2026-02-08
**Researcher:** Claude Code
**Project:** Zuno Marketplace UI (Next.js 16, React 19)

---

## Executive Summary

This report provides comprehensive guidance on implementing production-grade logging for Next.js applications. Based on analysis of the Zuno Marketplace UI codebase (which already has Pino, Sentry, and a custom Logger implementation), this research covers structured logging libraries, Next.js-specific considerations, production features, and real-world patterns from industry leaders.

---

## 1. Structured Logging Libraries Comparison

### 1.1 Pino (Recommended for Performance)

**Best for:** High-performance serverless/Edge environments, JSON structured logging

| Feature | Details |
|---------|---------|
| **Performance** | 5-10x faster than Winston; minimal CPU/memory overhead |
| **Bundle Size** | ~50KB (core) |
| **Structured Logging** | Native JSON output |
| **Worker Threads** | Supports non-blocking I/O via worker threads |
| **Next.js Compatibility** | Excellent - works in Server Components, API Routes, Edge Runtime |

**Installation:**
```bash
npm install pino pino-pretty
```

**Configuration for Next.js:**
```typescript
// src/shared/lib/pino-logger.ts
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';
const isEdgeRuntime = typeof EdgeRuntime !== 'undefined';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Pretty print in dev, JSON in production
  transport: isDevelopment && !isEdgeRuntime
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,

  // Base fields for all logs
  base: {
    service: 'zuno-marketplace',
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    env: process.env.NODE_ENV,
    runtime: isEdgeRuntime ? 'edge' : 'node',
  },

  // Redact sensitive fields
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'token',
      'apiKey',
      'secret',
    ],
    censor: '[REDACTED]',
  },

  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Child loggers for namespaces
export const authLogger = logger.child({ namespace: 'Auth' });
export const graphqlLogger = logger.child({ namespace: 'GraphQL' });
export const blockchainLogger = logger.child({ namespace: 'Blockchain' });
```

**Usage in Server Components:**
```typescript
import { logger } from '@/shared/lib/pino-logger';

export default async function ServerComponent() {
  logger.info('Rendering server component');

  try {
    const data = await fetchData();
    logger.debug({ dataId: data.id }, 'Data fetched successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch data');
  }
}
```

---

### 1.2 Winston (Feature-Rich Enterprise Choice)

**Best for:** Complex multi-transport setups, enterprise environments

| Feature | Details |
|---------|---------|
| **Flexibility** | Multiple transports (Console, File, HTTP, etc.) |
| **Formatting** | Highly customizable formatters |
| **Maturity** | Battle-tested, extensive ecosystem |
| **Performance** | Slower than Pino; higher memory footprint |
| **Edge Runtime** | Limited support |

**Configuration:**
```typescript
// src/shared/lib/winston-logger.ts
import winston from 'winston';

const { combine, timestamp, json, errors, printf } = winston.format;

const isDevelopment = process.env.NODE_ENV === 'development';

// Custom format for development
const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const meta = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
  return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${meta}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'zuno-marketplace',
    environment: process.env.NODE_ENV,
  },
  format: isDevelopment
    ? combine(timestamp(), devFormat)
    : combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.Console(),
    // Add file transport for production if needed
    // new winston.transports.File({ filename: 'app.log' }),
  ],
});
```

---

### 1.3 Consola (Universal Logging)

**Best for:** Framework-agnostic projects, Nuxt.js familiarity, simple setups

| Feature | Details |
|---------|---------|
| **Universal** | Works in Node.js, Browser, and Worker contexts |
| **Formatting** | Beautiful console output with icons and colors |
| **Types** | Full TypeScript support |
| **Performance** | Moderate - not as fast as Pino |
| **Structured** | Limited native JSON support |

**Configuration:**
```typescript
// src/shared/lib/consola-logger.ts
import { createConsola } from 'consola';

export const consola = createConsola({
  level: process.env.NODE_ENV === 'development' ? 4 : 2, // 4=debug, 2=info
  fancy: process.env.NODE_ENV === 'development',
  formatOptions: {
    colors: true,
    compact: true,
    date: true,
  },
});

// Create namespaced loggers
export const authConsola = consola.withTag('Auth');
export const apiConsola = consola.withTag('API');
```

---

### 1.4 Roarr (Structured Logging)

**Best for:** Strict structured logging requirements, log aggregation pipelines

| Feature | Details |
|---------|---------|
| **Structured** | Pure JSON logs only |
| **Context** | Excellent context propagation via AsyncLocalStorage |
| **Performance** | Good - designed for high throughput |
| **Browser** | Requires separate browser build |
| **Adoption** | Smaller community than Pino/Winston |

**Configuration:**
```typescript
// src/shared/lib/roarr-logger.ts
import { Roarr } from 'roarr';

export const log = Roarr.child({
  service: 'zuno-marketplace',
  env: process.env.NODE_ENV,
});

// Usage
log.info('User logged in');
log.error({ error: err.message }, 'Transaction failed');
```

---

### 1.5 Library Comparison Summary

| Library | Performance | Structured | Edge Runtime | Bundle Size | Best For |
|---------|-------------|------------|--------------|-------------|----------|
| **Pino** | Excellent | Native | Yes | ~50KB | Performance-critical, serverless |
| **Winston** | Good | Via formatters | Limited | ~150KB | Complex transport needs |
| **Consola** | Moderate | Limited | Yes | ~30KB | Simple, universal logging |
| **Roarr** | Good | Native | Yes | ~40KB | Strict structured logging |
| **Custom** | Variable | Custom | Yes | Minimal | Specific requirements |

**Recommendation for Zuno Marketplace:** Use **Pino** for server-side logging (already installed) and a lightweight wrapper for client-side to minimize bundle impact.

---

## 2. Next.js Specific Considerations

### 2.1 Server vs Client Logging Differences

| Aspect | Server Components | Client Components | Edge Runtime |
|--------|-------------------|-------------------|--------------|
| **Execution** | Server (Node.js) | Browser | V8 Isolate |
| **console.log** | Terminal/Server logs | Browser DevTools | Edge Function logs |
| **Logger Choice** | Pino/Winston (full) | Lightweight wrapper | Pino (light) |
| **Bundle Impact** | None | Minimal | N/A |
| **AsyncLocalStorage** | Available | N/A | Limited |

**Hybrid Logger Pattern:**
```typescript
// src/shared/lib/hybrid-logger.ts
import pino from 'pino';

// Server-side: Full Pino
const createServerLogger = () => pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { runtime: 'server' },
});

// Client-side: Lightweight wrapper
const createClientLogger = () => ({
  debug: (msg: string, meta?: object) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${msg}`, meta);
    }
  },
  info: (msg: string, meta?: object) => {
    console.info(`[INFO] ${msg}`, meta);
  },
  warn: (msg: string, meta?: object) => {
    console.warn(`[WARN] ${msg}`, meta);
  },
  error: (msg: string, err?: Error, meta?: object) => {
    console.error(`[ERROR] ${msg}`, { error: err?.message, ...meta });
    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      import('@sentry/nextjs').then(Sentry => {
        Sentry.captureException(err || new Error(msg));
      });
    }
  },
});

export const logger = typeof window === 'undefined'
  ? createServerLogger()
  : createClientLogger();
```

---

### 2.2 Handling Next.js Dev Overlay Errors

The Next.js Dev Overlay appears during development for runtime errors. Key points:

- **Cannot be disabled** in development (intentional)
- **Automatically excluded** from production builds
- **Production errors** are handled by React Error Boundaries

**Current Zuno Implementation (Good):**
```typescript
// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry in production
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Recommended Enhancement:**
```typescript
// src/shared/components/error-boundary.tsx (enhanced)
'use client';

import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/shared/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log with context
    logger.error('React Error Boundary caught error', error, {
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Send to Sentry
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}
```

---

### 2.3 Edge Runtime Compatibility

Edge Runtime has constraints:
- Limited Node.js APIs
- No filesystem access
- Must use lightweight logging

**Edge-Compatible Logger:**
```typescript
// src/shared/lib/edge-logger.ts
import { pino } from 'pino';

// Minimal config for Edge
export const edgeLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  browser: {
    asObject: true,
  },
  base: {
    runtime: 'edge',
    service: 'zuno-marketplace',
  },
});

// Usage in middleware or edge routes
export const middleware = async (request: NextRequest) => {
  edgeLogger.info({ path: request.nextUrl.pathname }, 'Edge request');
  return NextResponse.next();
};
```

**Next.js Config (Already Correct):**
```typescript
// next.config.ts (current)
const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "thread-stream", "pino-pretty"],
  // ...
};
```

---

### 2.4 Build-time vs Runtime Logging

| Phase | Logging Approach |
|-------|------------------|
| **Build** | Use `console.log` - Next.js captures these in build output |
| **Runtime (Server)** | Use structured logger (Pino) |
| **Runtime (Client)** | Use lightweight wrapper or Sentry |

**Build Script Logging:**
```typescript
// scripts/build-logger.ts
export const buildLogger = {
  info: (msg: string) => console.log(`[BUILD] ${msg}`),
  error: (msg: string) => console.error(`[BUILD ERROR] ${msg}`),
  success: (msg: string) => console.log(`[BUILD SUCCESS] ${msg}`),
};
```

---

## 3. Production Logging Features

### 3.1 Log Aggregation Setup

**Current Zuno Setup (Sentry):**
```typescript
// sentry.config.ts (current - good)
export function isSentryEnabled(): boolean {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  if (!dsn) return false;
  if (process.env.SENTRY_ENABLED === "false") return false;
  return true;
}
```

**Enhanced with Pino Integration:**
```typescript
// src/shared/lib/logger-with-sentry.ts
import pino from 'pino';
import * as Sentry from '@sentry/nextjs';

const isDevelopment = process.env.NODE_ENV === 'development';

// Custom transport to send errors to Sentry
const sentryTransport = () => ({
  write: (log: string) => {
    const parsed = JSON.parse(log);

    if (parsed.level >= 50 && !isDevelopment) { // error level
      Sentry.withScope((scope) => {
        scope.setContext('log', parsed);
        if (parsed.err) {
          Sentry.captureException(new Error(parsed.err.message));
        } else {
          Sentry.captureMessage(parsed.msg, 'error');
        }
      });
    }

    // Still output to console for Vercel/Datadog
    process.stdout.write(log + '\n');
  },
});

export const productionLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
}, sentryTransport());
```

**Datadog Integration Options:**

1. **Via Vercel Log Drains:**
   - Configure in Vercel Dashboard
   - Forward logs to Datadog HTTP endpoint
   - No code changes required

2. **Via OpenTelemetry:**
   ```typescript
   // instrumentation.ts
   import { NodeSDK } from '@opentelemetry/sdk-node';
   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

   const sdk = new NodeSDK({
     traceExporter: new OTLPTraceExporter({
       url: 'https://trace.agent.datadoghq.com',
       headers: {
         'DD-API-KEY': process.env.DD_API_KEY,
       },
     }),
   });

   sdk.start();
   ```

---

### 3.2 Environment-Based Log Levels

**Current Implementation (Good):**
```typescript
// src/shared/lib/logger.ts (current)
private minLevel: LogLevel = this.isDevelopment ? "debug" : "info";
```

**Enhanced with More Granularity:**
```typescript
// src/shared/config/log-levels.ts
export const LOG_LEVELS = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
} as const;

export type LogLevel = keyof typeof LOG_LEVELS;

export function getLogLevel(): LogLevel {
  const env = process.env.NODE_ENV;
  const configured = process.env.LOG_LEVEL as LogLevel;

  if (configured && LOG_LEVELS[configured]) {
    return configured;
  }

  switch (env) {
    case 'development':
      return 'debug';
    case 'staging':
      return 'info';
    case 'production':
      return 'warn';
    default:
      return 'info';
  }
}
```

---

### 3.3 JSON Structured Logging Format

**Standard Schema:**
```json
{
  "level": "error",
  "time": "2026-02-08T12:36:00.000Z",
  "msg": "Transaction failed",
  "service": "zuno-marketplace",
  "version": "1.0.0",
  "env": "production",
  "namespace": "Blockchain",
  "traceId": "abc123",
  "userId": "user_123",
  "err": {
    "type": "BlockchainError",
    "message": "Insufficient funds",
    "code": "INSUFFICIENT_FUNDS"
  },
  "context": {
    "txHash": "0xabc...",
    "chainId": 1
  }
}
```

**Pino Configuration for This Format:**
```typescript
export const structuredLogger = pino({
  level: getLogLevel(),
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      service: 'zuno-marketplace',
      version: process.env.NEXT_PUBLIC_APP_VERSION,
      env: process.env.NODE_ENV,
      pid: bindings.pid,
    }),
    log: (obj) => {
      // Flatten error objects
      if (obj.err instanceof Error) {
        obj.err = {
          type: obj.err.name,
          message: obj.err.message,
          stack: obj.err.stack,
        };
      }
      return obj;
    },
  },
});
```

---

### 3.4 Request Correlation/Tracing

**Implementation with AsyncLocalStorage:**
```typescript
// src/shared/lib/request-context.ts
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

interface RequestContext {
  traceId: string;
  userId?: string;
  requestPath?: string;
  startTime: number;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}

export function withRequestContext<T>(
  fn: () => T,
  context?: Partial<RequestContext>
): T {
  const store: RequestContext = {
    traceId: context?.traceId || uuidv4(),
    userId: context?.userId,
    requestPath: context?.requestPath,
    startTime: Date.now(),
  };
  return asyncLocalStorage.run(store, fn);
}

// Middleware to set context
export function requestContextMiddleware(request: Request) {
  const traceId = request.headers.get('x-trace-id') || uuidv4();
  return withRequestContext(() => NextResponse.next(), {
    traceId,
    requestPath: request.url,
  });
}
```

**Logger Integration:**
```typescript
// src/shared/lib/contextual-logger.ts
import { logger } from './pino-logger';
import { getRequestContext } from './request-context';

export function getContextualLogger() {
  const context = getRequestContext();

  if (context) {
    return logger.child({
      traceId: context.traceId,
      userId: context.userId,
    });
  }

  return logger;
}
```

---

### 3.5 Log Sampling and Filtering

**Sampling Strategy:**
```typescript
// src/shared/lib/log-sampler.ts
export interface SamplingConfig {
  errorSampleRate: number;      // Always 1.0 (100%)
  warnSampleRate: number;       // e.g., 0.5 (50%)
  infoSampleRate: number;       // e.g., 0.1 (10%)
  debugSampleRate: number;      // e.g., 0.01 (1%)
}

export function shouldLog(level: string, config: SamplingConfig): boolean {
  const rates: Record<string, number> = {
    fatal: 1.0,
    error: config.errorSampleRate,
    warn: config.warnSampleRate,
    info: config.infoSampleRate,
    debug: config.debugSampleRate,
    trace: config.debugSampleRate,
  };

  const rate = rates[level] ?? 1.0;
  return Math.random() < rate;
}

// Production config
export const productionSampling: SamplingConfig = {
  errorSampleRate: 1.0,   // All errors
  warnSampleRate: 1.0,    // All warnings
  infoSampleRate: 0.1,    // 10% of info logs
  debugSampleRate: 0.0,   // No debug logs
};
```

**Filtering Sensitive Data (Current Implementation is Good):**
```typescript
// sentry.server.config.ts (current)
const SENSITIVE_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
  /sk_[a-zA-Z0-9]{20,}/g,
  /"[^"]*apiKey[^"]*":\s*"[^"]+"/g,
];

const SENSITIVE_PARAMS = ["token", "password", "secret", "apiKey", "api_key"];
```

---

## 4. Real-World Patterns

### 4.1 Vercel's Approach

Vercel uses:
- **Console methods** in Edge/Serverless (automatically captured)
- **Structured JSON** for log parsing
- **Log Drains** for external aggregation
- **Request IDs** for correlation

**Pattern:**
```typescript
// Vercel-style logging
export const vercelLogger = {
  info: (message: string, metadata?: object) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...metadata,
    }));
  },
};
```

---

### 4.2 GitHub's Approach

GitHub uses:
- **Structured logging** with strict schemas
- **Correlation IDs** across all services
- **Log levels** per environment
- **Sampling** for high-volume logs

**Pattern:**
```typescript
// GitHub-style with strict schema
interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  msg: string;
  time: string;
  service: string;
  trace_id?: string;
  user_id?: string;
  duration_ms?: number;
  error?: {
    type: string;
    message: string;
    stack?: string;
  };
}

export function createLogEntry(entry: Omit<LogEntry, 'time'>): LogEntry {
  return {
    ...entry,
    time: new Date().toISOString(),
  };
}
```

---

### 4.3 Stripe's Approach

Stripe uses:
- **Request/Response logging** for all API calls
- **Idempotency key tracking**
- **Structured error codes**
- **Audit logging** for sensitive operations

**Pattern:**
```typescript
// Stripe-style API logging
export function logApiRequest(
  method: string,
  path: string,
  params: object,
  idempotencyKey?: string
) {
  logger.info({
    type: 'api_request',
    method,
    path,
    params: sanitizeParams(params),
    idempotency_key: idempotencyKey,
  }, 'API Request');
}

export function logApiResponse(
  method: string,
  path: string,
  status: number,
  duration: number,
  requestId: string
) {
  logger.info({
    type: 'api_response',
    method,
    path,
    status,
    duration_ms: duration,
    request_id: requestId,
  }, 'API Response');
}
```

---

### 4.4 Open Source Examples

**Vercel Commerce (Reference Architecture):**
- Uses `pino` for server logging
- Sentry for error tracking
- Structured logs for Vercel Log Drains

**T3 Stack Pattern:**
```typescript
// t3-style logging
import { env } from '@/env';

export const log = env.NODE_ENV === 'development'
  ? console.log
  : (message: string, meta?: object) => {
      console.log(JSON.stringify({ message, ...meta }));
    };
```

---

## 5. Recommendations for Zuno Marketplace

### 5.1 Immediate Improvements

1. **Upgrade to Pino v9** (currently on v7 in devDependencies)
2. **Add request correlation IDs** via middleware
3. **Implement log sampling** for production cost control
4. **Add structured error codes** (already have AppError classes)

### 5.2 Architecture Recommendation

```
┌─────────────────────────────────────────────────────────────┐
│                      Zuno Marketplace                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Client     │  │    Server    │  │    Edge      │      │
│  │  Components  │  │  Components  │  │   Runtime    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐      │
│  │  Lightweight │  │     Pino     │  │  Pino Lite   │      │
│  │   Wrapper    │  │   (Full)     │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                 │
│                    ┌──────▼───────┐                        │
│                    │    Sentry    │                        │
│                    │  (Errors)    │                        │
│                    └──────┬───────┘                        │
│                           │                                 │
│                    ┌──────▼───────┐                        │
│                    │   Vercel     │                        │
│                    │  Log Drains  │                        │
│                    └──────────────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Code Changes Needed

1. **Update logger.ts** to use Pino instead of console methods
2. **Add middleware** for request correlation
3. **Update error-handler.ts** to integrate with Pino
4. **Add sampling config** for production

### 5.4 Environment Variables

```bash
# Logging
LOG_LEVEL=info                    # debug, info, warn, error, fatal
LOG_SAMPLING_INFO_RATE=0.1        # 10% of info logs
LOG_SAMPLING_DEBUG_RATE=0.0       # No debug logs in prod

# Sentry (already configured)
SENTRY_DSN=
SENTRY_ENABLED=true
SENTRY_TRACES_SAMPLE_RATE=1.0

# Correlation
ENABLE_REQUEST_CORRELATION=true
```

---

## 6. Unresolved Questions

1. What is the current log volume and cost target for production?
2. Are there specific compliance requirements (GDPR, CCPA) for log retention?
3. Is Datadog integration planned, or will Sentry remain the primary observability tool?
4. What is the desired log retention period?
5. Are there specific audit logging requirements for blockchain transactions?

---

## Sources

- [Pino Documentation](https://getpino.io/)
- [Winston GitHub](https://github.com/winstonjs/winston)
- [Consola Documentation](https://github.com/unjs/consola)
- [Roarr GitHub](https://github.com/gajus/roarr)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Next.js Logging Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/logging)
- [Vercel Log Drains](https://vercel.com/docs/observability/log-drains)
- [OpenTelemetry Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)
- [Node.js Logging Libraries Comparison 2025](https://last9.io/blog/node-js-logging-libraries/)
- [Structured Logging Best Practices](https://uptrace.dev/glossary/structured-logging)

---

**Report Location:** `E:\zuno-marketplace-ui\plans\reports\researcher-260208-1236-nextjs-logging-best-practices.md`
