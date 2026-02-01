# Rendering Performance

Optimize React rendering, hydration, and CSS for smoother UI and faster initial paint.

## Table of Contents

- [Animate SVG Wrapper Instead of SVG Element](#animate-svg-wrapper-instead-of-svg-element) - LOW
- [CSS content-visibility for Long Lists](#css-content-visibility-for-long-lists) - HIGH
- [Hoist Static JSX Elements](#hoist-static-jsx-elements) - LOW
- [Optimize SVG Precision](#optimize-svg-precision) - LOW
- [Prevent Hydration Mismatch Without Flickering](#prevent-hydration-mismatch-without-flickering) - MEDIUM
- [Use Activity Component for Show/Hide](#use-activity-component-for-showhide) - MEDIUM
- [Use Explicit Conditional Rendering](#use-explicit-conditional-rendering) - LOW

---

## Animate SVG Wrapper Instead of SVG Element

**Impact:** LOW | **Enables hardware acceleration**

### Why It Matters

Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a `div` and animate the wrapper instead for smoother animations.

### Before (Incorrect)

```tsx
function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  );
}
```

Animating SVG directly - no hardware acceleration.

### After (Correct)

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  );
}
```

Animating wrapper div - hardware accelerated.

### Applies To

- CSS transforms (`transform`, `translate`, `scale`, `rotate`)
- CSS transitions (`opacity`, `transform`)
- All CSS animations

---

## CSS content-visibility for Long Lists

**Impact:** HIGH | **Faster initial render**

### Why It Matters

Apply `content-visibility: auto` to defer off-screen rendering. Browser skips layout/paint for off-screen items.

### CSS

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px; /* Estimated height */
}
```

### Example

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );
}
```

### Impact

For 1000 messages, browser skips layout/paint for ~990 off-screen items (**10× faster initial render**).

### Key Properties

- `content-visibility: auto` - Defers rendering until visible
- `contain-intrinsic-size` - Provides estimated size to prevent layout shift

---

## Hoist Static JSX Elements

**Impact:** LOW | **Avoids re-creation**

### Why It Matters

Extract static JSX outside components to avoid re-creation on every render. This is especially helpful for large static SVG nodes.

### Before (Incorrect)

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />;
}

function Container() {
  return <div>{loading && <LoadingSkeleton />}</div>;
}
```

Recreates element every render.

### After (Correct)

```tsx
const loadingSkeleton = <div className="animate-pulse h-20 bg-gray-200" />;

function Container() {
  return <div>{loading && loadingSkeleton}</div>;
}
```

Reuses same element.

### Note on React Compiler

If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, the compiler automatically hoists static JSX elements and optimizes component re-renders, making manual hoisting unnecessary.

---

## Optimize SVG Precision

**Impact:** LOW | **Reduces file size**

### Why It Matters

Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size.

### Before (Incorrect)

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

### After (Correct)

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

### Automate with SVGO

```bash
npx svgo --precision=1 --multipass icon.svg
```

### Impact

- Reduces SVG file size by 20-50%
- Faster parsing and rendering
- No visible quality loss at normal sizes

---

## Prevent Hydration Mismatch Without Flickering

**Impact:** MEDIUM | **Avoids visual flicker and hydration errors**

### Why It Matters

When rendering content that depends on client-side storage (localStorage, cookies), avoid both SSR breakage and post-hydration flickering.

### Before (Incorrect - Breaks SSR)

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem("theme") || "light";

  return <div className={theme}>{children}</div>;
}
```

### Before (Incorrect - Visual Flicker)

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Runs after hydration - causes visible flash
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
    }
  }, []);

  return <div className={theme}>{children}</div>;
}
```

Component first renders with default value (`light`), then updates after hydration, causing a visible flash.

### After (Correct - No Flicker, No Hydration Mismatch)

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">{children}</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  );
}
```

The inline script executes synchronously before showing the element, ensuring the DOM already has the correct value.

### Use Cases

- Theme toggles (dark/light mode)
- User preferences
- Authentication states
- Any client-only data that should render immediately

### Copy-Paste Template

```tsx
function ClientOnlyWrapper({ children, storageKey, defaultValue, id }: Props) {
  return (
    <>
      <div id={id}>{children}</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var value = localStorage.getItem('${storageKey}') || '${defaultValue}';
                var el = document.getElementById('${id}');
                if (el) el.className = value;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  );
}
```

---

## Use Activity Component for Show/Hide

**Impact:** MEDIUM | **Preserves state/DOM**

### Why It Matters

Use React's `Activity` component to preserve state/DOM for expensive components that frequently toggle visibility. Avoids expensive re-renders and state loss.

### Usage

```tsx
import { Activity } from "react";

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <ExpensiveMenu />
    </Activity>
  );
}
```

### When to Use

- Complex forms that toggle visibility
- Tabs with heavy content
- Modals with expensive children
- Any component where re-mounting is costly

### Benefits

- Preserves component state
- Keeps DOM nodes in memory
- Instant show/hide (no re-render delay)

---

## Use Explicit Conditional Rendering

**Impact:** LOW | **Prevents rendering 0 or NaN**

### Why It Matters

Use explicit ternary operators (`? :`) instead of `&&` for conditional rendering when the condition can be `0`, `NaN`, or other falsy values that render as text.

### Before (Incorrect)

```tsx
function Badge({ count }: { count: number }) {
  return <div>{count && <span className="badge">{count}</span>}</div>;
}

// When count = 0, renders: <div>0</div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

### After (Correct)

```tsx
function Badge({ count }: { count: number }) {
  return <div>{count > 0 ? <span className="badge">{count}</span> : null}</div>;
}

// When count = 0, renders: <div></div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

### Falsy Values That Render

| Value       | Renders As     |
| ----------- | -------------- |
| `0`         | "0"            |
| `NaN`       | "NaN"          |
| `''`        | Nothing (safe) |
| `null`      | Nothing (safe) |
| `undefined` | Nothing (safe) |
| `false`     | Nothing (safe) |

### Copy-Paste Template

```tsx
// ❌ Risky - renders "0" when count is 0
{
  count && <Component />;
}

// ✅ Safe - renders nothing when falsy
{
  count > 0 ? <Component /> : null;
}
{
  items.length > 0 ? <List /> : null;
}
{
  isVisible ? <Modal /> : null;
}
```

---

## Summary Checklist

- [ ] Animate wrapper divs, not SVG elements directly
- [ ] Use `content-visibility: auto` for long lists
- [ ] Hoist static JSX outside components
- [ ] Reduce SVG precision with SVGO
- [ ] Use inline scripts for client-only data to prevent flicker
- [ ] Use `Activity` component for show/hide of expensive components
- [ ] Use ternary (`? :`), not `&&` for numeric conditionals
