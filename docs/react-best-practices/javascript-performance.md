# JavaScript Performance

Optimize JavaScript execution for data transformations, lookups, and DOM operations.

## Table of Contents

- [Batch DOM CSS Changes](#batch-dom-css-changes) - MEDIUM
- [Build Index Maps for Repeated Lookups](#build-index-maps-for-repeated-lookups) - LOW-MEDIUM
- [Cache Property Access in Loops](#cache-property-access-in-loops) - LOW-MEDIUM
- [Cache Repeated Function Calls](#cache-repeated-function-calls) - MEDIUM
- [Cache Storage API Calls](#cache-storage-api-calls) - LOW-MEDIUM
- [Combine Multiple Array Iterations](#combine-multiple-array-iterations) - LOW-MEDIUM
- [Early Length Check for Array Comparisons](#early-length-check-for-array-comparisons) - MEDIUM-HIGH
- [Early Return from Functions](#early-return-from-functions) - LOW-MEDIUM
- [Hoist RegExp Creation](#hoist-regexp-creation) - LOW-MEDIUM
- [Use Loop for Min/Max Instead of Sort](#use-loop-for-minmax-instead-of-sort) - LOW
- [Use Set/Map for O(1) Lookups](#use-setmap-for-o1-lookups) - LOW-MEDIUM
- [Use toSorted() Instead of sort()](#use-tosorted-instead-of-sort) - MEDIUM-HIGH

---

## Batch DOM CSS Changes

**Impact:** MEDIUM | **Reduces reflows/repaints**

### Why It Matters

Avoid changing styles one property at a time. Group multiple CSS changes together via classes or `cssText` to minimize browser reflows.

### Before (Incorrect)

```typescript
function updateElementStyles(element: HTMLElement) {
  // Each line triggers a reflow
  element.style.width = "100px";
  element.style.height = "200px";
  element.style.backgroundColor = "blue";
  element.style.border = "1px solid black";
}
```

### After (Correct - Add Class)

```css
/* CSS file */
.highlighted-box {
  width: 100px;
  height: 200px;
  background-color: blue;
  border: 1px solid black;
}
```

```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add("highlighted-box");
}
```

### After (Correct - Change cssText)

```typescript
function updateElementStyles(element: HTMLElement) {
  element.style.cssText = `
    width: 100px;
    height: 200px;
    background-color: blue;
    border: 1px solid black;
  `;
}
```

### React Example

```tsx
// ❌ Incorrect: changing styles one by one
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && isHighlighted) {
      ref.current.style.width = "100px";
      ref.current.style.height = "200px";
      ref.current.style.backgroundColor = "blue";
    }
  }, [isHighlighted]);

  return <div ref={ref}>Content</div>;
}

// ✅ Correct: toggle class
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return <div className={isHighlighted ? "highlighted-box" : ""}>Content</div>;
}
```

### Key Principle

Prefer CSS classes over inline styles. Classes are cached by the browser and provide better separation of concerns.

---

## Build Index Maps for Repeated Lookups

**Impact:** LOW-MEDIUM | **1M ops to 2K ops**

### Why It Matters

Multiple `.find()` calls by the same key should use a Map. Converting from O(n) to O(1) lookups provides massive performance gains for large datasets.

### Before (Incorrect)

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId),
  }));
}
```

**Complexity:** O(n × m) where n = orders, m = users

### After (Correct)

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]));

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId),
  }));
}
```

**Complexity:** O(n + m) - build map once, O(1) lookups

### Impact

For 1000 orders × 1000 users: **1M operations → 2K operations**

### Copy-Paste Template

```typescript
// Build index map
const index = new Map(array.map(item => [item.key, item]));

// O(1) lookups
const item = index.get(key);
```

---

## Cache Property Access in Loops

**Impact:** LOW-MEDIUM | **Reduces lookups**

### Why It Matters

Cache object property lookups in hot paths to avoid repeated property access overhead.

### Before (Incorrect)

```typescript
// 3 lookups × N iterations
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value);
}
```

### After (Correct)

```typescript
// 1 lookup total
const value = obj.config.settings.value;
const len = arr.length;
for (let i = 0; i < len; i++) {
  process(value);
}
```

### Key Optimizations

1. Cache deep property access: `const value = obj.a.b.c`
2. Cache array length: `const len = arr.length`
3. Cache method references: `const push = arr.push`

---

## Cache Repeated Function Calls

**Impact:** MEDIUM | **Avoid redundant computation**

### Why It Matters

Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs during render.

### Before (Incorrect)

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() called 100+ times for same project names
        const slug = slugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

### After (Correct)

```typescript
// Module-level cache
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // Computed only once per unique project name
        const slug = cachedSlugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

### Simpler Pattern for Single-Value Functions

```typescript
let isLoggedInCache: boolean | null = null;

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache;
  }

  isLoggedInCache = document.cookie.includes("auth=");
  return isLoggedInCache;
}

// Clear cache when auth changes
function onAuthChange() {
  isLoggedInCache = null;
}
```

### Key Point

Use a Map (not a hook) so it works everywhere: utilities, event handlers, not just React components.

Reference: [How we made the Vercel Dashboard twice as fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

---

## Cache Storage API Calls

**Impact:** LOW-MEDIUM | **Reduces expensive I/O**

### Why It Matters

`localStorage`, `sessionStorage`, and `document.cookie` are synchronous and expensive. Cache reads in memory.

### Before (Incorrect)

```typescript
function getTheme() {
  return localStorage.getItem("theme") ?? "light";
}
// Called 10 times = 10 storage reads
```

### After (Correct)

```typescript
const storageCache = new Map<string, string | null>();

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key));
  }
  return storageCache.get(key);
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  storageCache.set(key, value); // keep cache in sync
}
```

### Cookie Caching

```typescript
let cookieCache: Record<string, string> | null = null;

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(document.cookie.split("; ").map(c => c.split("=")));
  }
  return cookieCache[name];
}
```

### Important: Invalidate on External Changes

If storage can change externally (another tab, server-set cookies), invalidate cache:

```typescript
window.addEventListener("storage", e => {
  if (e.key) storageCache.delete(e.key);
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    storageCache.clear();
  }
});
```

---

## Combine Multiple Array Iterations

**Impact:** LOW-MEDIUM | **Reduces iterations**

### Why It Matters

Multiple `.filter()` or `.map()` calls iterate the array multiple times. Combine into one loop for better performance.

### Before (Incorrect)

```typescript
// 3 iterations
const admins = users.filter(u => u.isAdmin);
const testers = users.filter(u => u.isTester);
const inactive = users.filter(u => !u.isActive);
```

### After (Correct)

```typescript
// 1 iteration
const admins: User[] = [];
const testers: User[] = [];
const inactive: User[] = [];

for (const user of users) {
  if (user.isAdmin) admins.push(user);
  if (user.isTester) testers.push(user);
  if (!user.isActive) inactive.push(user);
}
```

### When to Use

- Multiple filters on the same array
- Filter followed by map (can often combine)
- Large arrays where iteration cost matters

### When Not Needed

- Small arrays (<100 items)
- Code clarity is more important than micro-optimization
- Chain is already readable and performance is acceptable

---

## Early Length Check for Array Comparisons

**Impact:** MEDIUM-HIGH | **Avoids expensive operations when lengths differ**

### Why It Matters

When comparing arrays with expensive operations (sorting, deep equality, serialization), check lengths first. If lengths differ, the arrays cannot be equal.

### Before (Incorrect)

```typescript
function hasChanges(current: string[], original: string[]) {
  // Always sorts and joins, even when lengths differ
  return current.sort().join() !== original.sort().join();
}
```

Two O(n log n) sorts run even when `current.length` is 5 and `original.length` is 100.

### After (Correct)

```typescript
function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true;
  }

  // Only sort/compare when lengths match
  const currentSorted = current.toSorted();
  const originalSorted = original.toSorted();

  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true;
    }
  }

  return false;
}
```

### Benefits

- O(1) length check first
- Avoids sorting when lengths differ
- Avoids mutating original arrays (uses `toSorted()`)
- Returns early when difference is found

---

## Early Return from Functions

**Impact:** LOW-MEDIUM | **Avoids unnecessary computation**

### Why It Matters

Return early when result is determined to skip unnecessary processing.

### Before (Incorrect)

```typescript
function validateUsers(users: User[]) {
  let hasError = false;
  let errorMessage = "";

  for (const user of users) {
    if (!user.email) {
      hasError = true;
      errorMessage = "Email required";
    }
    if (!user.name) {
      hasError = true;
      errorMessage = "Name required";
    }
    // Continues checking all users even after error found
  }

  return hasError ? { valid: false, error: errorMessage } : { valid: true };
}
```

### After (Correct)

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: "Email required" };
    }
    if (!user.name) {
      return { valid: false, error: "Name required" };
    }
  }

  return { valid: true };
}
```

### Benefits

- Stops processing immediately on first error
- Cleaner code with less state to track
- More efficient for large datasets

---

## Hoist RegExp Creation

**Impact:** LOW-MEDIUM | **Avoids recreation**

### Why It Matters

Don't create RegExp inside render. Hoist to module scope or memoize with `useMemo()`.

### Before (Incorrect)

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

### After (Correct)

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

### Warning: Global RegExp Has Mutable State

```typescript
const regex = /foo/g;
regex.test("foo"); // true, lastIndex = 3
regex.test("foo"); // false, lastIndex = 0
```

Be careful with global regex (`/g`) in loops or repeated calls.

---

## Use Loop for Min/Max Instead of Sort

**Impact:** LOW | **O(n) instead of O(n log n)**

### Why It Matters

Finding the smallest or largest element only requires a single pass through the array. Sorting is wasteful and slower.

### Before (Incorrect)

```typescript
interface Project {
  id: string;
  name: string;
  updatedAt: number;
}

// O(n log n) - sort to find latest
function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);
  return sorted[0];
}
```

### After (Correct)

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null;

  let latest = projects[0];

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i];
    }
  }

  return latest;
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null };

  let oldest = projects[0];
  let newest = projects[0];

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i];
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i];
  }

  return { oldest, newest };
}
```

### Alternative for Small Arrays

```typescript
const numbers = [5, 2, 8, 1, 9];
const min = Math.min(...numbers);
const max = Math.max(...numbers);
```

This works for small arrays but can be slower for very large arrays due to spread operator limitations.

---

## Use Set/Map for O(1) Lookups

**Impact:** LOW-MEDIUM | **O(n) to O(1)**

### Why It Matters

Convert arrays to Set/Map for repeated membership checks. This changes lookup complexity from O(n) to O(1).

### Before (Incorrect)

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

### After (Correct)

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

### Impact

| Operation   | Array        | Set     |
| ----------- | ------------ | ------- |
| Lookup      | O(n)         | O(1)    |
| 1000 items  | 1000 checks  | 1 check |
| 10000 items | 10000 checks | 1 check |

### Copy-Paste Template

```typescript
// For membership checks
const set = new Set(array)
if (set.has(value)) { ... }

// For key-based lookups
const map = new Map(array.map(item => [item.id, item]))
const item = map.get(id)
```

---

## Use toSorted() Instead of sort()

**Impact:** MEDIUM-HIGH | **Prevents mutation bugs in React state**

### Why It Matters

`.sort()` mutates the array in place, which can cause bugs with React state and props. Use `.toSorted()` to create a new sorted array without mutation.

### Before (Incorrect)

```typescript
function UserList({ users }: { users: User[] }) {
  // Mutates the users prop array!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

### After (Correct)

```typescript
function UserList({ users }: { users: User[] }) {
  // Creates new sorted array, original unchanged
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

### Why This Matters in React

1. **Props/state mutations break React's immutability model** - React expects props and state to be treated as read-only
2. **Causes stale closure bugs** - Mutating arrays inside closures can lead to unexpected behavior

### Browser Support

`.toSorted()` is available in all modern browsers:

- Chrome 110+
- Safari 16+
- Firefox 115+
- Node.js 20+

### Fallback for Older Browsers

```typescript
// Fallback for older browsers
const sorted = [...items].sort((a, b) => a.value - b.value);
```

### Other Immutable Array Methods

- `.toSorted()` - immutable sort
- `.toReversed()` - immutable reverse
- `.toSpliced()` - immutable splice
- `.with()` - immutable element replacement

---

## Summary Checklist

- [ ] Batch CSS changes via classes or cssText
- [ ] Build Map for repeated lookups (O(n) → O(1))
- [ ] Cache property access in loops
- [ ] Cache function results in module-level Map
- [ ] Cache localStorage/sessionStorage reads
- [ ] Combine multiple filter/map into one loop
- [ ] Check array length before expensive comparison
- [ ] Return early from functions when possible
- [ ] Hoist RegExp creation outside loops
- [ ] Use loop for min/max instead of sort
- [ ] Use Set/Map for membership checks
- [ ] Use `toSorted()` instead of `sort()` for immutability
