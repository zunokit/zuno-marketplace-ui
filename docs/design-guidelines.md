# Zuno Marketplace UI - Design Guidelines

**Version**: 0.1.0
**Last Updated**: 2026-01-31
**Design System**: shadcn/ui + OpenSea-inspired styling

---

## 1. UI Component Library

### 1.1 shadcn/ui Components

The project uses **shadcn/ui** as the foundation with **53+ components** installed:

| Category | Components |
|----------|------------|
| **Layout** | Aspect Ratio, Card, Collapsible, Resizable Panels, Scroll Area, Separator |
| **Forms** | Button, Checkbox, Input, Input OTP, Label, Radio Group, Select, Slider, Switch, Textarea, Calendar, Date Picker |
| **Navigation** | Breadcrumb, Command, Context Menu, Dropdown Menu, Menubar, Navigation Menu, Tabs, Toggle, Toggle Group |
| **Overlays** | Alert Dialog, Dialog, Drawer, Hover Card, Popover, Sheet, Tooltip |
| **Feedback** | Alert, Badge, Progress, Skeleton, Sonner (toast), Table |
| **Data Display** | Accordion, Avatar, Carousel, Chart, Table |
| **Advanced** | Form (react-hook-form), Pagination |

### 1.2 Component Usage

```typescript
// Import from shadcn/ui
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

// Usage example
<Card>
  <CardHeader>
    <CardTitle>NFT Listing</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default">Buy Now</Button>
  </CardContent>
</Card>
```

---

## 2. Color Scheme

### 2.1 Primary Colors (OpenSea-inspired)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-os-gray-50` | `#fcfcfc` | Lightest backgrounds |
| `--color-os-gray-100` | `#f9f9f9` | Light backgrounds |
| `--color-os-gray-300` | `#acadae` | Secondary text, borders |
| `--color-os-gray-400` | `#34353c` | Dark UI elements |
| `--color-os-gray-500` | `#26272d` | Darker backgrounds |
| `--color-os-gray-700` | `#101010` | Darkest backgrounds |

### 2.2 Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-os-success` | `#47bb64` | Success states, buy buttons |
| `--color-os-error` | `#e24756` | Errors, warnings |
| `--color-os-info` | `#83c3ff` | Information, links |
| `--color-os-warning` | `#ffcc00` | Warnings, alerts |

### 2.3 Rarity Colors

| Rarity | Token | Value |
|--------|-------|-------|
| Common | - | Default text |
| Rare | `--color-os-rare` | `#00a3ff` |
| Epic | `--color-os-epic` | `#d358ff` |
| Legendary | `--color-os-legendary` | `#ff8a00` |

### 2.4 Transparency Effects

| Token | Value | Usage |
|-------|-------|-------|
| `--color-frosted-1` | `rgb(255 255 255/4%)` | Subtle backgrounds |
| `--color-frosted-2` | `rgb(255 255 255/8%)` | Card backgrounds |
| `--color-frosted-6` | `rgb(255 255 255/32%)` | Hover states |
| `--color-border-subtle` | `rgba(255, 255, 255, 0.08)` | Borders |
| `--color-border-medium` | `rgba(255, 255, 255, 0.12)` | Input borders |
| `--color-border-strong` | `rgba(255, 255, 255, 0.16)` | Focus states |

---

## 3. Typography

### 3.1 Font Stack

```css
/* Primary font */
--font-sans: var(--font-gt-america, var(--font-geist-sans));

/* Monospace font */
--font-mono: var(--font-gt-america-mono, var(--font-geist-mono));
```

### 3.2 Type Scale

| Class | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-os-h1` | 2rem (32px) | 500 | 1.5 | Page titles |
| `text-os-h2` | 1.25rem (20px) | 500 | 1.25 | Section headers |
| `text-os-caption` | 0.875rem (14px) | 400 | 1.5 | Descriptions, metadata |
| `text-os-mono` | 0.875rem (14px) | 500 | 1.25 | Addresses, IDs |

### 3.3 Typography Patterns

```typescript
// Page title
<h1 className="text-os-h1">Discover NFTs</h1>

// Section header
<h2 className="text-os-h2">Trending Collections</h2>

// Metadata
<p className="text-os-caption">Owned by 0x1234...5678</p>

// Address display
<code className="text-os-mono">0xABC...123</code>
```

---

## 4. Spacing System

### 4.1 OpenSea Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-os-0_5` | 2px | Micro spacing |
| `--spacing-os-1` | 4px | Tight spacing |
| `--spacing-os-1_5` | 6px | Button padding |
| `--spacing-os-2` | 8px | Small gaps |
| `--spacing-os-3` | 12px | Component padding |
| `--spacing-os-5` | 20px | Section gaps |
| `--spacing-os-6` | 24px | Large gaps |

### 4.2 Spacing Usage

```typescript
// Component padding
<div className="p-os-3">...</div>

// Gap between items
<div className="gap-os-2">...</div>

// Section margin
<section className="my-os-6">...</section>
```

---

## 5. Border Radius

### 5.1 Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-os-sm` | 3px | Small elements |
| `--radius-os` | 4px | Default buttons |
| `--radius-os-md` | 4.5px | Inputs |
| `--radius-os-lg` | 6px | Cards |
| `--radius-os-xl` | 8px | Large cards |
| `--radius-os-2xl` | 12px | Modals |
| `--radius-os-full` | 9999px | Pills, avatars |

---

## 6. Responsive Breakpoints

### 6.1 Breakpoint Definitions

| Breakpoint | Width | Tailwind Prefix |
|------------|-------|-----------------|
| Mobile | < 640px | Default |
| Tablet | >= 640px | `sm:` |
| Desktop | >= 768px | `md:` |
| Large | >= 1024px | `lg:` |
| XL | >= 1280px | `xl:` |
| 2XL | >= 1536px | `2xl:` |

### 6.2 Responsive Patterns

```typescript
// Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Content stacks on mobile, 2-col on tablet, 4-col on desktop */}
</div>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  {/* More padding on larger screens */}
</div>

// Responsive text
<h1 className="text-xl md:text-2xl lg:text-3xl">
  {/* Larger text on bigger screens */}
</h1>
```

---

## 7. Animation Patterns

### 7.1 Framer Motion Usage

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 7.2 CSS Animations

```css
/* Dropdown animations */
.dropdown-enter {
  animation: dropdown-slide-down 0.2s ease-out;
}

.dropdown-exit {
  animation: dropdown-slide-up 0.15s ease-in;
}

@keyframes dropdown-slide-down {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### 7.3 Animation Guidelines

| Animation | Duration | Easing | Use Case |
|-----------|----------|--------|----------|
| Dropdown | 200ms | ease-out | Menus, popovers |
| Modal | 300ms | ease-out | Dialogs, drawers |
| Page transition | 300ms | ease-in-out | Route changes |
| Hover | 150ms | ease | Buttons, links |
| Loading | 800ms | linear | Skeletons, spinners |

---

## 8. Component Patterns

### 8.1 OpenSea-Style Button

```typescript
// Primary button
<button className="btn-os-primary">
  <WalletIcon className="w-4 h-4" />
  Connect Wallet
</button>

// Secondary button
<button className="btn-os-secondary">
  <FilterIcon className="w-4 h-4" />
  Filter
</button>
```

### 8.2 OpenSea-Style Card

```typescript
<div className="card-os-frosted p-os-3">
  <img src={nft.image} alt={nft.name} className="rounded-os-lg" />
  <div className="mt-os-3">
    <h3 className="text-os-h2">{nft.name}</h3>
    <p className="text-os-caption">{nft.collection}</p>
  </div>
</div>
```

### 8.3 Badge Patterns

```typescript
// Status badges
<span className="badge-os-success">Active</span>
<span className="badge-os-error">Expired</span>

// Rarity badges
<span className="badge-os-rare">Rare</span>
<span className="badge-os-epic">Epic</span>
<span className="badge-os-legendary">Legendary</span>
```

---

## 9. Dark/Light Theme

### 9.1 Theme Toggle

The application supports both dark and light themes:

```typescript
// Theme provider setup
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="dark">
  {children}
</ThemeProvider>

// Toggle theme
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
```

### 9.2 Theme-Aware Styles

```css
/* Dark mode default (OpenSea style) */
:root {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}

/* Light mode overrides */
html:not(.dark) {
  --background: #ffffff;
  --foreground: #0d1117;
}
```

---

## 10. Iconography

### 10.1 Icon Library

- **Primary**: Lucide React (`lucide-react`)
- **Size**: 16px (sm), 20px (md), 24px (lg)
- **Stroke width**: 2px default

### 10.2 Icon Usage

```typescript
import { Wallet, Search, Filter, ChevronDown } from 'lucide-react';

// Small icon
<Wallet className="w-4 h-4" />

// Medium icon (default)
<Search className="w-5 h-5" />

// Large icon
<Filter className="w-6 h-6" />

// With button
<Button>
  <Wallet className="w-4 h-4 mr-2" />
  Connect
</Button>
```

---

## 11. Form Patterns

### 11.1 Input Styles

```typescript
// Standard input
<input
  className="input-os"
  placeholder="Search NFTs..."
/>

// With icon
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-os-gray-300" />
  <input className="input-os pl-10" placeholder="Search..." />
</div>
```

### 11.2 Form Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  price: z.string().min(1, 'Price is required'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
});

function ListingForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

---

## 12. Accessibility Guidelines

### 12.1 Required Practices

- All interactive elements must be keyboard accessible
- Color contrast ratio minimum 4.5:1 for text
- Focus indicators visible on all focusable elements
- ARIA labels for icon-only buttons
- Alt text for all images

### 12.2 ARIA Patterns

```typescript
// Icon-only button
<button aria-label="Close dialog">
  <XIcon className="w-4 h-4" />
</button>

// Loading state
<button aria-busy="true" aria-label="Loading, please wait">
  <Spinner className="animate-spin" />
</button>

// Alert
<div role="alert" aria-live="polite">
  Transaction successful!
</div>
```
