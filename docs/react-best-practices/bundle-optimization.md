# Bundle Optimization

Optimizing bundle size is **CRITICAL** for performance. Large bundles directly affect Time to Interactive (TTI) and Largest Contentful Paint (LCP).

## Table of Contents

- [Avoid Barrel File Imports](#avoid-barrel-file-imports) - CRITICAL
- [Dynamic Imports for Heavy Components](#dynamic-imports-for-heavy-components) - CRITICAL
- [Defer Non-Critical Third-Party Libraries](#defer-non-critical-third-party-libraries) - MEDIUM
- [Conditional Module Loading](#conditional-module-loading) - HIGH
- [Preload Based on User Intent](#preload-based-on-user-intent) - MEDIUM

---

## Avoid Barrel File Imports

**Impact:** CRITICAL | **200-800ms import cost, slow builds**

### Why It Matters

Barrel files (entry points that re-export multiple modules) can contain thousands of re-exports. Importing from them loads the entire library even if you only use one component.

**Popular libraries affected:**

- `lucide-react` - 1,583 modules, ~2.8s extra in dev
- `@mui/material` - 2,225 modules, ~4.2s extra in dev
- `@tabler/icons-react`, `react-icons`, `@radix-ui/react-*`, `lodash`, `date-fns`

**Why tree-shaking doesn't help:** When a library is marked as external (not bundled), the bundler can't optimize it. If you bundle it to enable tree-shaking, builds become substantially slower.

### Before (Incorrect)

```tsx
import { Check, X, Menu } from "lucide-react";
// Loads 1,583 modules, takes ~2.8s extra in dev
// Runtime cost: 200-800ms on every cold start

import { Button, TextField } from "@mui/material";
// Loads 2,225 modules, takes ~4.2s extra in dev
```

### After (Correct)

```tsx
import Check from "lucide-react/dist/esm/icons/check";
import X from "lucide-react/dist/esm/icons/x";
import Menu from "lucide-react/dist/esm/icons/menu";
// Loads only 3 modules (~2KB vs ~1MB)

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// Loads only what you use
```

### Alternative: Next.js optimizePackageImports

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@mui/material"],
  },
};

// Then you can keep the ergonomic barrel imports:
import { Check, X, Menu } from "lucide-react";
// Automatically transformed to direct imports at build time
```

### Benefits

- 15-70% faster dev boot
- 28% faster builds
- 40% faster cold starts
- Significantly faster HMR

### Common Mistakes

1. **Assuming tree-shaking handles everything** - External libraries aren't tree-shaken
2. **Importing from index files** - Even `import { X } from 'library/index'` is a barrel import
3. **Not checking library structure** - Some libraries have better subpath exports than others

---

## Dynamic Imports for Heavy Components

**Impact:** CRITICAL | **Directly affects TTI and LCP**

### Why It Matters

Large components not needed on initial render should be loaded on-demand. This splits them into separate chunks that load only when needed.

### Before (Incorrect)

```tsx
import { MonacoEditor } from "./monaco-editor";
// Monaco bundles with main chunk (~300KB)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />;
}
```

### After (Correct)

```tsx
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("./monaco-editor").then(m => m.MonacoEditor), {
  ssr: false,
});

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />;
}
```

### Copy-Paste Template

```tsx
import dynamic from "next/dynamic";

const ComponentName = dynamic(() => import("./path-to-component").then(m => m.ComponentName), {
  ssr: false, // Disable SSR for browser-only libraries
  loading: () => <Skeleton />, // Optional loading state
});
```

### When to Use

- Code editors (Monaco, CodeMirror)
- Rich text editors
- Heavy charts/visualizations
- Maps (Google Maps, Mapbox)
- PDF viewers
- Video players

### Common Mistakes

1. **Not disabling SSR for browser-only libs** - Causes hydration errors
2. **Dynamic importing everything** - Only heavy components benefit; adds overhead for small ones
3. **Forgetting loading states** - Users see blank space while loading

---

## Defer Non-Critical Third-Party Libraries

**Impact:** MEDIUM | **Loads after hydration**

### Why It Matters

Analytics, logging, and error tracking don't block user interaction. Load them after hydration to prioritize critical content.

### Before (Incorrect)

```tsx
import { Analytics } from "@vercel/analytics/react";
// Blocks initial bundle

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### After (Correct)

```tsx
import dynamic from "next/dynamic";

const Analytics = dynamic(() => import("@vercel/analytics/react").then(m => m.Analytics), {
  ssr: false,
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Libraries to Defer

- Analytics (Vercel Analytics, Google Analytics)
- Error tracking (Sentry, LogRocket)
- Chat widgets (Intercom, Drift)
- Cookie consent banners
- Social media widgets

---

## Conditional Module Loading

**Impact:** HIGH | **Loads large data only when needed**

### Why It Matters

Load large data or modules only when a feature is activated. This is especially useful for optional features that most users don't use immediately.

### Example: Lazy-Load Animation Frames

```tsx
function AnimationPlayer({ enabled }: { enabled: boolean }) {
  const [frames, setFrames] = useState<Frame[] | null>(null);

  useEffect(() => {
    if (enabled && !frames && typeof window !== "undefined") {
      import("./animation-frames.js")
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false));
    }
  }, [enabled, frames]);

  if (!frames) return <Skeleton />;
  return <Canvas frames={frames} />;
}
```

### Key Points

- The `typeof window !== 'undefined'` check prevents bundling this module for SSR
- Optimizes server bundle size and build speed
- Only loads when feature is actually activated

### Use Cases

- Animation libraries (Lottie, GSAP)
- Heavy data files (JSON datasets)
- Optional features (export to PDF, advanced charts)
- Feature-flagged functionality

---

## Preload Based on User Intent

**Impact:** MEDIUM | **Reduces perceived latency**

### Why It Matters

Preload heavy bundles before they're needed to reduce perceived latency. This is especially effective for user-initiated actions.

### Example: Preload on Hover/Focus

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== "undefined") {
      void import("./monaco-editor");
    }
  };

  return (
    <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      Open Editor
    </button>
  );
}
```

### Example: Preload When Feature Flag Enabled

```tsx
function FlagsProvider({ children, flags }: Props) {
  useEffect(() => {
    if (flags.editorEnabled && typeof window !== "undefined") {
      void import("./monaco-editor").then(mod => mod.init());
    }
  }, [flags.editorEnabled]);

  return <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>;
}
```

### When to Preload

- On hover over buttons that open heavy components
- On focus of inputs that trigger complex UIs
- When feature flags enable functionality
- After initial page load completes
- On route prefetch

### Common Mistakes

1. **Preloading too early** - Wastes bandwidth if user never uses the feature
2. **Preloading on every render** - Use `useEffect` with proper dependencies
3. **Not checking for window** - Causes SSR issues

---

## Summary Checklist

- [ ] Import directly from source files, avoid barrel imports
- [ ] Use `next/dynamic` for components >50KB not needed immediately
- [ ] Defer analytics, logging, and non-critical third-party scripts
- [ ] Conditionally load modules for optional features
- [ ] Preload on user intent (hover, focus) for better perceived performance
