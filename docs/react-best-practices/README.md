# React Best Practices

Performance optimization guide for React and Next.js applications based on Vercel Engineering standards.

## Quick Reference

| Priority | Category                                              | Impact     | When to Apply                |
| -------- | ----------------------------------------------------- | ---------- | ---------------------------- |
| 1        | [Bundle Optimization](./bundle-optimization.md)       | CRITICAL   | Every component import       |
| 2        | [Data Fetching](./data-fetching.md)                   | CRITICAL   | API calls, server components |
| 3        | [Re-render Optimization](./re-render-optimization.md) | MEDIUM     | State management, callbacks  |
| 4        | [Rendering Performance](./rendering-performance.md)   | MEDIUM     | JSX structure, CSS           |
| 5        | [JavaScript Performance](./javascript-performance.md) | LOW-MEDIUM | Data transformations         |

## Impact Levels

- **CRITICAL** - Directly affects TTI, LCP, user experience
- **HIGH** - Significant performance gains (2-10×)
- **MEDIUM** - Moderate gains, cumulative impact
- **LOW** - Micro-optimizations, apply in hot paths

## Quick Wins Checklist

Before committing code, verify:

### Bundle Size

- [ ] No barrel file imports from large libraries (use direct imports)
- [ ] Heavy components use `next/dynamic`
- [ ] Third-party scripts load after hydration

### Data Fetching

- [ ] Independent async operations use `Promise.all()`
- [ ] Server Components use Suspense boundaries
- [ ] API routes start promises early, await late

### Re-renders

- [ ] `useEffect` dependencies are primitives, not objects
- [ ] Callbacks use functional `setState` when reading current state
- [ ] Expensive computations use lazy state initialization

### Rendering

- [ ] Conditional rendering uses ternary (`? :`), not `&&`
- [ ] Long lists use `content-visibility: auto`
- [ ] SVG animations target wrapper divs, not SVG elements

### JavaScript

- [ ] Repeated lookups use Map/Set (O(1) vs O(n))
- [ ] Array methods don't mutate (use `toSorted()`, not `sort()`)
- [ ] Multiple filters/maps combined into single loop

## Copy-Paste Templates

### Dynamic Import Component

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./heavy-component").then(m => m.HeavyComponent), {
  ssr: false,
});
```

### Parallel Data Fetching

```tsx
const [user, posts, comments] = await Promise.all([fetchUser(), fetchPosts(), fetchComments()]);
```

### Functional setState

```tsx
// ❌ Bad - requires items dependency
const addItem = useCallback(
  item => {
    setItems([...items, item]);
  },
  [items]
);

// ✅ Good - no dependencies needed
const addItem = useCallback(item => {
  setItems(curr => [...curr, item]);
}, []);
```

### Suspense Boundary

```tsx
import { Suspense } from "react";

function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <AsyncData />
      </Suspense>
      <Footer />
    </div>
  );
}
```

### React.cache for Deduplication

```tsx
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return await db.user.findUnique({
    where: { id: session.user.id },
  });
});
```

## Common Mistakes

### 1. Barrel Imports

```tsx
// ❌ Loads thousands of modules
import { Check, X } from "lucide-react";

// ✅ Loads only what you need
import Check from "lucide-react/dist/esm/icons/check";
import X from "lucide-react/dist/esm/icons/x";
```

### 2. Sequential Awaits

```tsx
// ❌ 3 round trips
const user = await fetchUser();
const posts = await fetchPosts();
const comments = await fetchComments();

// ✅ 1 round trip
const [user, posts, comments] = await Promise.all([fetchUser(), fetchPosts(), fetchComments()]);
```

### 3. Object Dependencies

```tsx
// ❌ Re-runs on any user field change
useEffect(() => {
  console.log(user.id);
}, [user]);

// ✅ Re-runs only when id changes
useEffect(() => {
  console.log(user.id);
}, [user.id]);
```

### 4. && Conditional Rendering

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

### 5. Mutating Sort

```tsx
// ❌ Mutates original array
const sorted = users.sort((a, b) => a.name.localeCompare(b.name));

// ✅ Creates new array
const sorted = users.toSorted((a, b) => a.name.localeCompare(b.name));
```

## Navigation

- [Bundle Optimization](./bundle-optimization.md) - Dynamic imports, code splitting, barrel files
- [Data Fetching](./data-fetching.md) - Server/client patterns, React.cache(), Suspense
- [Re-render Optimization](./re-render-optimization.md) - useMemo, useCallback, React.memo
- [Rendering Performance](./rendering-performance.md) - Hydration, conditional rendering, CSS
- [JavaScript Performance](./javascript-performance.md) - Array methods, caching, data structures
- [Pre-commit Checklist](./checklist.md) - Code review checklist

## References

- [Vercel React Best Practices](https://github.com/vercel/react-best-practices)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
