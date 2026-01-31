# Data Fetching

Efficient data fetching patterns for React Server Components, Client Components, and API routes. Eliminating waterfalls is **CRITICAL** for performance.

## Table of Contents

- [Defer Await Until Needed](#defer-await-until-needed) - HIGH
- [Promise.all() for Independent Operations](#promiseall-for-independent-operations) - CRITICAL
- [Dependency-Based Parallelization](#dependency-based-parallelization) - CRITICAL
- [Prevent Waterfall Chains in API Routes](#prevent-waterfall-chains-in-api-routes) - CRITICAL
- [Strategic Suspense Boundaries](#strategic-suspense-boundaries) - HIGH
- [Per-Request Deduplication with React.cache()](#per-request-deduplication-with-reactcache) - MEDIUM
- [Cross-Request LRU Caching](#cross-request-lru-caching) - HIGH
- [Minimize Serialization at RSC Boundaries](#minimize-serialization-at-rsc-boundaries) - HIGH
- [Parallel Data Fetching with Component Composition](#parallel-data-fetching-with-component-composition) - CRITICAL
- [Use after() for Non-Blocking Operations](#use-after-for-non-blocking-operations) - MEDIUM
- [Use SWR for Automatic Deduplication](#use-swr-for-automatic-deduplication) - MEDIUM-HIGH

---

## Defer Await Until Needed

**Impact:** HIGH | **Avoids blocking unused code paths**

### Why It Matters

Move `await` operations into the branches where they're actually used to avoid blocking code paths that don't need them.

### Before (Incorrect)

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);

  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true };
  }

  // Only this branch uses userData
  return processUserData(userData);
}
```

### After (Correct)

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true };
  }

  // Fetch only when needed
  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

### Another Example: Early Return Optimization

```typescript
// ❌ Incorrect: always fetches permissions
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId);
  const resource = await getResource(resourceId);

  if (!resource) {
    return { error: "Not found" };
  }

  if (!permissions.canEdit) {
    return { error: "Forbidden" };
  }

  return await updateResourceData(resource, permissions);
}

// ✅ Correct: fetches only when needed
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId);

  if (!resource) {
    return { error: "Not found" };
  }

  const permissions = await fetchPermissions(userId);

  if (!permissions.canEdit) {
    return { error: "Forbidden" };
  }

  return await updateResourceData(resource, permissions);
}
```

### When to Apply

- When one branch returns early without using the fetched data
- When the skipped branch is frequently taken
- When the deferred operation is expensive

---

## Promise.all() for Independent Operations

**Impact:** CRITICAL | **2-10× improvement**

### Why It Matters

When async operations have no interdependencies, execute them concurrently using `Promise.all()`. This reduces multiple round trips to a single round trip.

### Before (Incorrect)

```typescript
// Sequential execution: 3 round trips
const user = await fetchUser();
const posts = await fetchPosts();
const comments = await fetchComments();
```

### After (Correct)

```typescript
// Parallel execution: 1 round trip
const [user, posts, comments] = await Promise.all([fetchUser(), fetchPosts(), fetchComments()]);
```

### Copy-Paste Template

```typescript
const [result1, result2, result3] = await Promise.all([fetchData1(), fetchData2(), fetchData3()]);
```

### Common Mistakes

1. **Using `Promise.all()` when operations depend on each other** - Causes errors
2. **Not handling individual promise rejections** - One failure rejects all
3. **Over-using for just 2 operations** - Benefit is small, clarity matters

---

## Dependency-Based Parallelization

**Impact:** CRITICAL | **2-10× improvement**

### Why It Matters

For operations with partial dependencies, use `better-all` to maximize parallelism. It automatically starts each task at the earliest possible moment.

### Before (Incorrect)

```typescript
// Profile waits for config unnecessarily
const [user, config] = await Promise.all([fetchUser(), fetchConfig()]);
const profile = await fetchProfile(user.id);
```

### After (Correct)

```typescript
import { all } from "better-all";

const { user, config, profile } = await all({
  async user() {
    return fetchUser();
  },
  async config() {
    return fetchConfig();
  },
  async profile() {
    return fetchProfile((await this.$.user).id);
  },
});
```

### How It Works

- `user` and `config` start immediately (no dependencies)
- `profile` starts as soon as `user` resolves
- All three can be running concurrently at different stages

### Installation

```bash
npm install better-all
```

Reference: [better-all on GitHub](https://github.com/shuding/better-all)

---

## Prevent Waterfall Chains in API Routes

**Impact:** CRITICAL | **2-10× improvement**

### Why It Matters

In API routes and Server Actions, start independent operations immediately, even if you don't await them yet. This prevents sequential waterfalls.

### Before (Incorrect)

```typescript
export async function GET(request: Request) {
  const session = await auth(); // Wait
  const config = await fetchConfig(); // Wait (could have started earlier)
  const data = await fetchData(session.user.id); // Wait
  return Response.json({ data, config });
}
```

### After (Correct)

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth(); // Start immediately
  const configPromise = fetchConfig(); // Start immediately
  const session = await sessionPromise;
  const [config, data] = await Promise.all([configPromise, fetchData(session.user.id)]);
  return Response.json({ data, config });
}
```

### Pattern

1. Start all independent operations immediately
2. Store promises in variables
3. Await them only when their results are needed
4. Use `Promise.all()` for operations that can run together

---

## Strategic Suspense Boundaries

**Impact:** HIGH | **Faster initial paint**

### Why It Matters

Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.

### Before (Incorrect)

```tsx
async function Page() {
  const data = await fetchData(); // Blocks entire page

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  );
}
```

The entire layout waits for data even though only the middle section needs it.

### After (Correct)

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  );
}

async function DataDisplay() {
  const data = await fetchData(); // Only blocks this component
  return <div>{data.content}</div>;
}
```

Sidebar, Header, and Footer render immediately. Only DataDisplay waits for data.

### Advanced: Share Promise Across Components

```tsx
function Page() {
  // Start fetch immediately, but don't await
  const dataPromise = fetchData();

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  );
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise); // Unwraps the promise
  return <div>{data.content}</div>;
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise); // Reuses the same promise
  return <div>{data.summary}</div>;
}
```

Both components share the same promise, so only one fetch occurs.

### When NOT to Use

- Critical data needed for layout decisions (affects positioning)
- SEO-critical content above the fold
- Small, fast queries where suspense overhead isn't worth it
- When you want to avoid layout shift (loading → content jump)

**Trade-off:** Faster initial paint vs potential layout shift.

---

## Per-Request Deduplication with React.cache()

**Impact:** MEDIUM | **Deduplicates within request**

### Why It Matters

Use `React.cache()` for server-side request deduplication. Multiple calls within a single request execute the query only once.

### Usage

```typescript
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return await db.user.findUnique({
    where: { id: session.user.id },
  });
});
```

Within a single request:

```typescript
const user1 = await getCurrentUser(); // DB query
const user2 = await getCurrentUser(); // Cache hit, no query
const user3 = await getCurrentUser(); // Cache hit, no query
```

### Best For

- Authentication checks
- Database queries called from multiple components
- Expensive computations used in multiple places

---

## Cross-Request LRU Caching

**Impact:** HIGH | **Caches across requests**

### Why It Matters

`React.cache()` only works within one request. For data shared across sequential requests, use an LRU cache.

### Implementation

```typescript
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000, // 5 minutes
});

export async function getUser(id: string) {
  const cached = cache.get(id);
  if (cached) return cached;

  const user = await db.user.findUnique({ where: { id } });
  cache.set(id, user);
  return user;
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

### With Vercel Fluid Compute

LRU caching is especially effective because multiple concurrent requests can share the same function instance and cache.

### Installation

```bash
npm install lru-cache
```

Reference: [lru-cache on GitHub](https://github.com/isaacs/node-lru-cache)

---

## Minimize Serialization at RSC Boundaries

**Impact:** HIGH | **Reduces data transfer size**

### Why It Matters

The React Server/Client boundary serializes all object properties into strings. This serialized data directly impacts page weight and load time. Only pass fields that the client actually uses.

### Before (Incorrect)

```tsx
async function Page() {
  const user = await fetchUser(); // 50 fields
  return <Profile user={user} />;
}

("use client");
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>; // uses 1 field
}
```

### After (Correct)

```tsx
async function Page() {
  const user = await fetchUser();
  return <Profile name={user.name} />;
}

("use client");
function Profile({ name }: { name: string }) {
  return <div>{name}</div>;
}
```

### Key Principle

Serialize only what the client component needs. The server component can access all data; the client component receives only what it displays.

---

## Parallel Data Fetching with Component Composition

**Impact:** CRITICAL | **Eliminates server-side waterfalls**

### Why It Matters

React Server Components execute sequentially within a tree. Restructure with composition to parallelize data fetching.

### Before (Incorrect)

```tsx
export default async function Page() {
  const header = await fetchHeader();
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  );
}

async function Sidebar() {
  const items = await fetchSidebarItems();
  return <nav>{items.map(renderItem)}</nav>;
}
```

Sidebar waits for Page's fetch to complete.

### After (Correct)

```tsx
async function Header() {
  const data = await fetchHeader();
  return <div>{data}</div>;
}

async function Sidebar() {
  const items = await fetchSidebarItems();
  return <nav>{items.map(renderItem)}</nav>;
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  );
}
```

Both fetch simultaneously.

### Alternative with Children Prop

```tsx
async function Layout({ children }: { children: ReactNode }) {
  const header = await fetchHeader();
  return (
    <div>
      <div>{header}</div>
      {children}
    </div>
  );
}

async function Sidebar() {
  const items = await fetchSidebarItems();
  return <nav>{items.map(renderItem)}</nav>;
}

export default function Page() {
  return (
    <Layout>
      <Sidebar />
    </Layout>
  );
}
```

---

## Use after() for Non-Blocking Operations

**Impact:** MEDIUM | **Faster response times**

### Why It Matters

Use Next.js's `after()` to schedule work that should execute after a response is sent. This prevents logging, analytics, and other side effects from blocking the response.

### Before (Incorrect)

```tsx
export async function POST(request: Request) {
  await updateDatabase(request);

  // Logging blocks the response
  const userAgent = request.headers.get("user-agent") || "unknown";
  await logUserAction({ userAgent });

  return Response.json({ status: "success" });
}
```

### After (Correct)

```tsx
import { after } from "next/server";
import { headers, cookies } from "next/headers";

export async function POST(request: Request) {
  await updateDatabase(request);

  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get("user-agent") || "unknown";
    const sessionCookie = (await cookies()).get("session-id")?.value || "anonymous";

    logUserAction({ sessionCookie, userAgent });
  });

  return Response.json({ status: "success" });
}
```

### Common Use Cases

- Analytics tracking
- Audit logging
- Sending notifications
- Cache invalidation
- Cleanup tasks

### Important Notes

- `after()` runs even if the response fails or redirects
- Works in Server Actions, Route Handlers, and Server Components

Reference: [Next.js after() documentation](https://nextjs.org/docs/app/api-reference/functions/after)

---

## Use SWR for Automatic Deduplication

**Impact:** MEDIUM-HIGH | **Automatic deduplication**

### Why It Matters

SWR enables request deduplication, caching, and revalidation across component instances. Multiple components using the same key share one request.

### Before (Incorrect)

```tsx
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/api/users")
      .then(r => r.json())
      .then(setUsers);
  }, []);
}
```

### After (Correct)

```tsx
import useSWR from "swr";

function UserList() {
  const { data: users } = useSWR("/api/users", fetcher);
}
```

### For Immutable Data

```tsx
import { useImmutableSWR } from "@/lib/swr";

function StaticContent() {
  const { data } = useImmutableSWR("/api/config", fetcher);
}
```

### For Mutations

```tsx
import { useSWRMutation } from "swr/mutation";

function UpdateButton() {
  const { trigger } = useSWRMutation("/api/user", updateUser);
  return <button onClick={() => trigger()}>Update</button>;
}
```

Reference: [SWR Documentation](https://swr.vercel.app)

---

## Summary Checklist

- [ ] Defer `await` until the value is actually needed
- [ ] Use `Promise.all()` for independent async operations
- [ ] Start promises early in API routes, await late
- [ ] Use Suspense boundaries for non-critical data
- [ ] Wrap data fetching in `React.cache()` for deduplication
- [ ] Minimize data passed across RSC boundaries
- [ ] Use component composition for parallel fetching
- [ ] Use `after()` for logging and analytics
- [ ] Use SWR for client-side data fetching
