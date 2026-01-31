# Re-render Optimization

Optimize React component re-renders to improve UI responsiveness and reduce unnecessary computation.

## Table of Contents

- [Defer State Reads to Usage Point](#defer-state-reads-to-usage-point) - MEDIUM
- [Extract to Memoized Components](#extract-to-memoized-components) - MEDIUM
- [Narrow Effect Dependencies](#narrow-effect-dependencies) - LOW
- [Subscribe to Derived State](#subscribe-to-derived-state) - MEDIUM
- [Use Functional setState Updates](#use-functional-setstate-updates) - MEDIUM
- [Use Lazy State Initialization](#use-lazy-state-initialization) - MEDIUM
- [Use Transitions for Non-Urgent Updates](#use-transitions-for-non-urgent-updates) - MEDIUM

---

## Defer State Reads to Usage Point

**Impact:** MEDIUM | **Avoids unnecessary subscriptions**

### Why It Matters

Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks. This prevents unnecessary re-renders when the state changes.

### Before (Incorrect)

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams();

  const handleShare = () => {
    const ref = searchParams.get("ref");
    shareChat(chatId, { ref });
  };

  return <button onClick={handleShare}>Share</button>;
}
```

Subscribes to all searchParams changes, causing re-renders even though the component only reads the value in a callback.

### After (Correct)

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    shareChat(chatId, { ref });
  };

  return <button onClick={handleShare}>Share</button>;
}
```

Reads on demand, no subscription needed.

### When to Apply

- Reading searchParams only in event handlers
- Accessing localStorage in callbacks
- Any state that's only used inside event handlers, not for rendering

---

## Extract to Memoized Components

**Impact:** MEDIUM | **Enables early returns**

### Why It Matters

Extract expensive work into memoized components to enable early returns before computation. This also isolates expensive renders.

### Before (Incorrect)

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user);
    return <Avatar id={id} />;
  }, [user]);

  if (loading) return <Skeleton />;
  return <div>{avatar}</div>;
}
```

Computes avatar even when loading (wasted work).

### After (Correct)

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user]);
  return <Avatar id={id} />;
});

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />;
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  );
}
```

Skips computation when loading. `UserAvatar` only re-renders when `user` changes.

### Copy-Paste Template

```tsx
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: { data: Data }) {
  const computed = useMemo(() => expensiveComputation(data), [data]);
  return <div>{computed}</div>;
});
```

### Note on React Compiler

If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, manual memoization with `memo()` and `useMemo()` is not necessary. The compiler automatically optimizes re-renders.

---

## Narrow Effect Dependencies

**Impact:** LOW | **Minimizes effect re-runs**

### Why It Matters

Specify primitive dependencies instead of objects to minimize effect re-runs. Object references change on every render even if values are the same.

### Before (Incorrect)

```tsx
// Re-runs on any user field change
useEffect(() => {
  console.log(user.id);
}, [user]);
```

### After (Correct)

```tsx
// Re-runs only when id changes
useEffect(() => {
  console.log(user.id);
}, [user.id]);
```

### For Derived State

```tsx
// ❌ Runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode();
  }
}, [width]);

// ✅ Runs only on boolean transition
const isMobile = width < 768;
useEffect(() => {
  if (isMobile) {
    enableMobileMode();
  }
}, [isMobile]);
```

### Key Principle

Compute derived values outside the effect, then depend on the derived boolean.

---

## Subscribe to Derived State

**Impact:** MEDIUM | **Reduces re-render frequency**

### Why It Matters

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency. A boolean only changes once (true→false or false→true), while continuous values change many times.

### Before (Incorrect)

```tsx
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'}>
}
```

Re-renders on every pixel change as window resizes.

### After (Correct)

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'}>
}
```

Re-renders only when the boolean changes (crossing the 768px threshold).

### Copy-Paste Template

```tsx
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
```

---

## Use Functional setState Updates

**Impact:** MEDIUM | **Prevents stale closures and unnecessary callback recreations**

### Why It Matters

When updating state based on the current state value, use the functional update form. This prevents stale closures, eliminates unnecessary dependencies, and creates stable callback references.

### Before (Incorrect)

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems);

  // Callback must depend on items, recreated on every items change
  const addItems = useCallback(
    (newItems: Item[]) => {
      setItems([...items, ...newItems]);
    },
    [items]
  ); // ❌ items dependency causes recreations

  // Risk of stale closure if dependency is forgotten
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id));
  }, []); // ❌ Missing items dependency - will use stale items!

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />;
}
```

### After (Correct)

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems);

  // Stable callback, never recreated
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems]);
  }, []); // ✅ No dependencies needed

  // Always uses latest state, no stale closure risk
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id));
  }, []); // ✅ Safe and stable

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />;
}
```

### Benefits

1. **Stable callback references** - Callbacks don't need to be recreated when state changes
2. **No stale closures** - Always operates on the latest state value
3. **Fewer dependencies** - Simplifies dependency arrays and reduces memory leaks
4. **Prevents bugs** - Eliminates the most common source of React closure bugs

### When to Use Functional Updates

- Any setState that depends on the current state value
- Inside useCallback/useMemo when state is needed
- Event handlers that reference state
- Async operations that update state

### When Direct Updates Are Fine

- Setting state to a static value: `setCount(0)`
- Setting state from props/arguments only: `setName(newName)`
- State doesn't depend on previous value

### Copy-Paste Template

```tsx
// ❌ Bad - requires state dependency
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]);

// ✅ Good - no dependencies
const increment = useCallback(() => {
  setCount(c => c + 1);
}, []);
```

---

## Use Lazy State Initialization

**Impact:** MEDIUM | **Avoids wasted computation on every render**

### Why It Matters

Pass a function to `useState` for expensive initial values. Without the function form, the initializer runs on every render even though the value is only used once.

### Before (Incorrect)

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items));
  const [query, setQuery] = useState("");

  return <SearchResults index={searchIndex} query={query} />;
}

function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem("settings") || "{}"));

  return <SettingsForm settings={settings} onChange={setSettings} />;
}
```

### After (Correct)

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items));
  const [query, setQuery] = useState("");

  return <SearchResults index={searchIndex} query={query} />;
}

function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem("settings");
    return stored ? JSON.parse(stored) : {};
  });

  return <SettingsForm settings={settings} onChange={setSettings} />;
}
```

### When to Use Lazy Initialization

- Computing initial values from localStorage/sessionStorage
- Building data structures (indexes, maps)
- Reading from the DOM
- Performing heavy transformations

### When Not Needed

- Simple primitives: `useState(0)`
- Direct references: `useState(props.value)`
- Cheap literals: `useState({})`

### Copy-Paste Template

```tsx
// ❌ Bad - runs on every render
const [data, setData] = useState(expensiveComputation());

// ✅ Good - runs only once
const [data, setData] = useState(() => expensiveComputation());
```

---

## Use Transitions for Non-Urgent Updates

**Impact:** MEDIUM | **Maintains UI responsiveness**

### Why It Matters

Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness. Transitions tell React the update can be interrupted by more urgent updates.

### Before (Incorrect)

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}
```

Blocks UI on every scroll event.

### After (Correct)

```tsx
import { startTransition } from "react";

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}
```

Non-blocking updates keep the UI responsive.

### When to Use

- Frequent updates (scroll, mousemove, resize)
- Non-urgent UI updates (analytics, background sync)
- Heavy computations that don't need immediate feedback

### Copy-Paste Template

```tsx
import { startTransition } from "react";

// Wrap non-urgent updates
startTransition(() => {
  setExpensiveState(newValue);
});
```

---

## Summary Checklist

- [ ] Read state on-demand in callbacks instead of subscribing
- [ ] Extract expensive work to memoized components
- [ ] Use primitive dependencies in effects, not objects
- [ ] Subscribe to derived booleans, not continuous values
- [ ] Use functional setState when reading current state
- [ ] Use lazy initialization for expensive initial values
- [ ] Wrap frequent updates in `startTransition()`
