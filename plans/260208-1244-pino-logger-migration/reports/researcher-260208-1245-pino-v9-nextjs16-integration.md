# Pino v9 Integration with Next.js 16 App Router

## 1. Pino v9 Breaking Changes (from v7/v8)

### Version Support
- **Pino v9**: Requires Node.js 20+ (dropped Node 18 support)
- **Pino v8**: Required Node.js 16+

### Key Breaking Changes
1. **ESM-first**: Pino v9+ is ESM-native; CJS compatibility maintained but secondary
2. **TypeScript Regression (v9.8.0)**: Logging methods (`error`, `info`, `warn`, `debug`) were accidentally removed from `BaseLogger` type definition. Fixed in v9.9.0+.
3. **Transport Loading**: Stricter transport resolution in bundled environments

### Migration Path
| From | To | Action |
|------|-----|--------|
| v7/v8 | v9 | Upgrade Node.js to v20+ |
| v9.8.0 | v9.9.0+ | Update for TypeScript fix |

---

## 2. Configuration for Next.js 16 App Router

### Server Components
```typescript
// lib/logger.ts
import pino from 'pino';

const isEdge = typeof EdgeRuntime !== 'undefined';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // CRITICAL: sync: true required for Server Components
  sync: true,
  ...(isEdge ? {
    // Edge-compatible minimal config
    base: undefined,
  } : {
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  }),
});
```

### Client Components
```typescript
'use client';
import pino from 'pino';

export const clientLogger = pino({
  level: 'info',
  browser: {
    asObject: true,
    serialize: true, // Handles BigInt serialization
    transmit: {
      level: 'error',
      send: (level, logEvent) => {
        fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logEvent),
        });
      }
    }
  },
});
```

### Edge Runtime (Middleware)
```typescript
// middleware.ts
import { pino } from 'pino';

const logger = pino({
  level: 'info',
  // No file/network transports in Edge
  // Use stdout only
});

export function middleware(request: NextRequest) {
  logger.info({ url: request.url }, 'Request received');
  return NextResponse.next();
}
```

---

## 3. Best Practices for Next.js App Router

### Runtime Detection Pattern
```typescript
const isEdge = typeof EdgeRuntime !== 'undefined';
const isServer = typeof window === 'undefined';
const isClient = !isServer && !isEdge;
```

### Environment-Aware Logger Factory
```typescript
function createLogger() {
  const isDev = process.env.NODE_ENV === 'development';
  const isEdge = typeof EdgeRuntime !== 'undefined';

  const config: any = {
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
    sync: true, // Required for RSC
  };

  if (isEdge) {
    // Minimal config for Edge
    config.base = undefined;
  } else if (isDev) {
    config.transport = {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'yyyy-mm-dd HH:MM:ss' }
    };
  } else {
    // Production: JSON to stdout
    config.redact = {
      paths: ['password', 'token', 'apiKey', '*.password', '*.token', 'req.headers.authorization'],
      remove: true
    };
  }

  return pino(config);
}
```

---

## 4. Transport Configuration

### Development
- Use `pino-pretty` for human-readable output
- Log level: `debug`
- Colorize enabled

### Production
- **No transport**: Direct stdout JSON output (lowest overhead)
- Log level: `info` or `warn`
- Always enable redaction for sensitive fields
- Use external log aggregators (ELK, Loki, Datadog, SigNoz)

### Multi-Destination (if needed)
```typescript
transport: {
  targets: [
    { target: 'pino/file', options: { destination: 1 }, level: 'info' }, // stdout
    { target: 'pino/file', options: { destination: '/var/log/error.log' }, level: 'error' }
  ]
}
```

---

## 5. Known Issues with Next.js 16 / React 19

| Issue | Impact | Solution |
|-------|--------|----------|
| ESM/CJS conflicts | Build errors | Use dynamic imports: `const pino = (await import('pino')).default` |
| Server Component async logging | Request hanging | Set `sync: true` |
| Edge Runtime file transports | Runtime error | Avoid `fs`-based transports in Edge |
| BigInt serialization | Client errors | Use `browser: { serialize: true }` |
| `window is not defined` | SSR errors | Add `'use client'` directive or dynamic import |

### React 19 Specifics
- React 19 changed Server Component rendering; ensure `sync: true` to prevent streaming issues
- React Compiler may optimize away console calls; use explicit logger invocations

---

## Unresolved Questions

1. Exact performance impact of `sync: true` in high-throughput Server Components
2. Recommended approach for OpenTelemetry integration with Next.js 16
3. Whether `pino-http` is still recommended for API routes in App Router

---

**Sources:**
- [Pino GitHub Releases](https://github.com/pinojs/pino/releases)
- [Pino Issue #2253 - BaseLogger regression](https://github.com/pinojs/pino/issues/2253)
- [SigNoz Pino Guide](https://signoz.io/guides/pino-logger/)
- [Dash0 Pino Production Guide](https://www.dash0.com/guides/logging-in-node-js-with-pino)
- [Better Stack Pino Guide](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/)
