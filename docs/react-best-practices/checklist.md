# Pre-Commit Checklist

Use this checklist before committing code to ensure React best practices are followed.

## Quick Reference Card

Print this and keep it visible while coding:

```
┌─────────────────────────────────────────────────────────────┐
│  REACT BEST PRACTICES - QUICK CHECKS                        │
├─────────────────────────────────────────────────────────────┤
│  BUNDLE: No barrel imports? Dynamic for heavy?              │
│  DATA: Promise.all() for parallel? Suspense boundaries?     │
│  RENDER: Ternary not &&? content-visibility for lists?      │
│  STATE: Functional setState? Lazy init for expensive?       │
│  JS: toSorted not sort? Map for lookups?                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Bundle Optimization Checklist

### Imports

- [ ] **No barrel imports from large libraries**
  - ❌ `import { X } from 'lucide-react'`
  - ✅ `import X from 'lucide-react/dist/esm/icons/x'`
  - ✅ Or use `optimizePackageImports` in next.config.js

- [ ] **Heavy components use `next/dynamic`**
  - [ ] Code editors (Monaco, CodeMirror)
  - [ ] Rich text editors
  - [ ] Charts, maps, PDF viewers
  - [ ] Video players

- [ ] **Third-party scripts deferred**
  - [ ] Analytics (Vercel, Google)
  - [ ] Error tracking (Sentry)
  - [ ] Chat widgets

### Code Review Questions

- [ ] Does this import load only what's needed?
- [ ] Is this component needed on initial render?
- [ ] Can this library load after hydration?

---

## Data Fetching Checklist

### Async Patterns

- [ ] **Independent operations use `Promise.all()`**

  ```typescript
  // ❌ Sequential
  const user = await fetchUser();
  const posts = await fetchPosts();

  // ✅ Parallel
  const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
  ```

- [ ] **Deferred awaits**
  - [ ] Await moved to where value is actually used
  - [ ] Early returns don't wait for unused data

- [ ] **API routes start promises early**
  ```typescript
  // ✅ Start immediately, await late
  const sessionPromise = auth();
  const configPromise = fetchConfig();
  const session = await sessionPromise;
  const [config, data] = await Promise.all([configPromise, fetchData(session.user.id)]);
  ```

### Server Components

- [ ] **Suspense boundaries for non-critical data**

  ```tsx
  <Suspense fallback={<Skeleton />}>
    <AsyncData />
  </Suspense>
  ```

- [ ] **React.cache() for deduplication**

  ```typescript
  export const getUser = cache(async id => {
    return await db.user.findUnique({ where: { id } });
  });
  ```

- [ ] **Minimal serialization at RSC boundaries**
  - [ ] Pass only fields client component needs
  - [ ] Don't pass entire objects when only 1-2 fields are used

### Client-Side Fetching

- [ ] **SWR for automatic deduplication**
  ```tsx
  const { data } = useSWR("/api/users", fetcher);
  ```

---

## Re-render Optimization Checklist

### State Management

- [ ] **Functional setState when reading current state**

  ```tsx
  // ❌ Requires dependency
  const addItem = useCallback(
    item => {
      setItems([...items, item]);
    },
    [items]
  );

  // ✅ No dependency needed
  const addItem = useCallback(item => {
    setItems(curr => [...curr, item]);
  }, []);
  ```

- [ ] **Lazy state initialization for expensive values**

  ```tsx
  // ❌ Runs on every render
  const [data] = useState(expensiveComputation());

  // ✅ Runs only once
  const [data] = useState(() => expensiveComputation());
  ```

- [ ] **Primitive dependencies in effects**

  ```tsx
  // ❌ Re-runs on any user change
  useEffect(() => { ... }, [user])

  // ✅ Re-runs only when id changes
  useEffect(() => { ... }, [user.id])
  ```

### Callbacks

- [ ] **Stable callback references**
  - [ ] useCallback dependencies are minimal
  - [ ] No stale closure risks

- [ ] **Derived booleans for subscriptions**

  ```tsx
  // ❌ Re-renders on every pixel
  const width = useWindowWidth();
  const isMobile = width < 768;

  // ✅ Re-renders only on breakpoint
  const isMobile = useMediaQuery("(max-width: 767px)");
  ```

---

## Rendering Performance Checklist

### JSX

- [ ] **Ternary for numeric conditionals**

  ```tsx
  // ❌ Renders "0" when count is 0
  {
    count && <Badge>{count}</Badge>;
  }

  // ✅ Renders nothing when count is 0
  {
    count > 0 ? <Badge>{count}</Badge> : null;
  }
  ```

- [ ] **Static JSX hoisted outside components**

  ```tsx
  // Outside component
  const staticElement = <svg>...</svg>;

  // Inside component
  return <div>{staticElement}</div>;
  ```

### CSS

- [ ] **content-visibility for long lists**

  ```css
  .list-item {
    content-visibility: auto;
    contain-intrinsic-size: 0 80px;
  }
  ```

- [ ] **Animate wrapper divs, not SVG elements**

  ```tsx
  // ❌ No hardware acceleration
  <svg className="animate-spin">...</svg>

  // ✅ Hardware accelerated
  <div className="animate-spin">
    <svg>...</svg>
  </div>
  ```

### Hydration

- [ ] **No hydration mismatches**
  - [ ] Client-only data uses inline scripts
  - [ ] No `window` or `document` access during SSR

---

## JavaScript Performance Checklist

### Arrays

- [ ] **toSorted() not sort()**

  ```tsx
  // ❌ Mutates original
  const sorted = items.sort((a, b) => ...)

  // ✅ Creates new array
  const sorted = items.toSorted((a, b) => ...)
  ```

- [ ] **Map/Set for lookups**

  ```tsx
  // ❌ O(n) per lookup
  items.filter(i => allowedIds.includes(i.id));

  // ✅ O(1) per lookup
  const allowed = new Set(allowedIds);
  items.filter(i => allowed.has(i.id));
  ```

- [ ] **Combined iterations**

  ```tsx
  // ❌ 3 iterations
  const a = items.filter(...)
  const b = items.filter(...)
  const c = items.filter(...)

  // ✅ 1 iteration
  for (const item of items) {
    if (conditionA) a.push(item)
    if (conditionB) b.push(item)
    if (conditionC) c.push(item)
  }
  ```

### Functions

- [ ] **Early returns**

  ```tsx
  // ❌ Processes all items
  for (const item of items) {
    if (invalid) hasError = true;
  }
  return hasError;

  // ✅ Returns immediately
  for (const item of items) {
    if (invalid) return { error: true };
  }
  return { error: false };
  ```

- [ ] **Cached function results**
  ```tsx
  const cache = new Map();
  function cachedExpensive(input) {
    if (cache.has(input)) return cache.get(input);
    const result = expensive(input);
    cache.set(input, result);
    return result;
  }
  ```

---

## Severity Levels

### CRITICAL - Must Fix Before Merge

- Barrel imports from large libraries
- Sequential awaits that should be parallel
- Missing Suspense boundaries blocking layout
- Hydration mismatches

### HIGH - Should Fix Before Merge

- Heavy components not using dynamic imports
- Missing React.cache() for repeated fetches
- Excessive serialization at RSC boundaries
- Missing content-visibility for long lists

### MEDIUM - Fix When Convenient

- Object dependencies in effects
- Non-functional setState
- Missing lazy state initialization
- Storage API calls not cached

### LOW - Nice to Have

- Static JSX not hoisted
- RegExp created in render
- SVG precision not optimized
- Minor loop optimizations

---

## Code Review Template

When reviewing PRs, comment with:

```
## React Best Practices Review

### CRITICAL
- [ ] Item 1
- [ ] Item 2

### HIGH
- [ ] Item 3

### MEDIUM
- [ ] Item 4

### Questions
1. Why was X implemented this way?
2. Have you considered Y?

### Approvals
- [ ] Bundle optimization
- [ ] Data fetching patterns
- [ ] Re-render optimization
- [ ] Rendering performance
```

---

## Common Mistakes Quick Fix

| Mistake                                              | Quick Fix                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| `import { X } from 'lucide-react'`                   | `import X from 'lucide-react/dist/esm/icons/x'`               |
| `const a = await fetchA(); const b = await fetchB()` | `const [a, b] = await Promise.all([fetchA(), fetchB()])`      |
| `{count && <Component />}`                           | `{count > 0 ? <Component /> : null}`                          |
| `useEffect(() => {...}, [user])`                     | `useEffect(() => {...}, [user.id])`                           |
| `setItems([...items, newItem])`                      | `setItems(curr => [...curr, newItem])`                        |
| `items.sort((a, b) => ...)`                          | `items.toSorted((a, b) => ...)`                               |
| `array.find(x => x.id === id)` (in loop)             | `const map = new Map(array.map(x => [x.id, x])); map.get(id)` |

---

## Resources

- [Bundle Optimization](./bundle-optimization.md)
- [Data Fetching](./data-fetching.md)
- [Re-render Optimization](./re-render-optimization.md)
- [Rendering Performance](./rendering-performance.md)
- [JavaScript Performance](./javascript-performance.md)
