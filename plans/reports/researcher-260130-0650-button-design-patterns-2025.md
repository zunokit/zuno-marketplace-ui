# Button Component Design Patterns Research Report 2025

**Date:** 2026-01-30
**Context:** Zuno NFT Marketplace UI
**Purpose:** Research modern button design patterns for creating a comprehensive button debug page

---

## Executive Summary

This report synthesizes current best practices for button component design in 2025, with specific focus on NFT/marketplace applications. Key influences include OpenSea OS2, Blur, and modern React/Tailwind patterns from shadcn/ui.

---

## 1. Button Variants

### Standard Variants (shadcn/ui Foundation)

| Variant | Use Case | Visual Style |
|---------|----------|--------------|
| **default** | Primary CTAs (Buy, Connect, Mint) | Solid fill, high contrast |
| **secondary** | Alternative actions | Outlined/ghost, medium emphasis |
| **destructive** | Delete, cancel, warnings | Red/error color scheme |
| **outline** | Secondary CTAs, filters | Bordered, transparent bg |
| **ghost** | Icon buttons, subtle actions | No background, hover state |
| **link** | Navigation, text actions | Text-only, underline on hover |

### NFT Marketplace Specific Variants

| Variant | Use Case | Example |
|---------|----------|---------|
| **gradient** | Premium actions, featured CTAs | `bg-gradient-to-r from-purple-500 to-pink-500` |
| **glass** | Modal actions, overlays | `backdrop-blur-xl bg-white/10` |
| **glow** | Highlighted trading actions | Box-shadow with brand color |
| **wallet** | Connect wallet buttons | Icon + text, prominent placement |

### Zuno Current Implementation Analysis

Current variants in `src/shared/components/ui/button.tsx`:
- default (OpenSea primary style)
- secondary (OpenSea secondary style)
- destructive
- success (custom addition)
- outline
- ghost
- link

**Recommendation:** Add gradient and glass variants for NFT-specific use cases.

---

## 2. Button States

### Essential States

| State | Visual Treatment | Implementation |
|-------|-----------------|----------------|
| **default** | Base styles | Static colors |
| **hover** | Elevated, color shift | `translateY(-2px)`, shadow increase |
| **active/pressed** | Depressed, inset shadow | `translateY(0)`, shadow decrease |
| **disabled** | Reduced opacity, no-pointer | `opacity-50`, `pointer-events-none` |
| **loading** | Spinner, disabled state | Replace text with spinner |
| **focus** | Ring outline | `ring-2 ring-offset-2` |

### State Transitions

```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

### NFT-Specific States

| State | Description |
|-------|-------------|
| **pending** | Transaction submitted, awaiting confirmation |
| **confirming** | Blockchain confirmation in progress |
| **success** | Transaction completed, green flash |
| **error** | Transaction failed, red indicator |

---

## 3. Sizes and Shapes

### Standard Sizes

| Size | Height | Padding | Font | Use Case |
|------|--------|---------|------|----------|
| **xs** | 28px | px-2.5 | text-xs | Dense UIs, tags |
| **sm** | 32px | px-3 | text-sm | Compact layouts |
| **default** | 36px | px-4 | text-sm | Standard actions |
| **lg** | 40px | px-6 | text-base | Primary CTAs |
| **xl** | 48px | px-8 | text-lg | Hero sections |
| **icon** | 36x36px | p-2 | - | Icon-only buttons |

### Border Radius Patterns

| Style | Radius | Use Case |
|-------|--------|----------|
| **square** | 0 | Technical/data-heavy UIs |
| **rounded** | 4-6px | Default, modern look |
| **pill** | 9999px | Tags, filters, toggles |
| **custom** | 8-12px | Cards, modals |

### Zuno Current Sizes

- sm: h-8, text-xs
- default: h-9
- lg: h-10, text-base
- icon: size-9, rounded-full

**Recommendation:** Add xs and xl sizes for more flexibility.

---

## 4. Icon Button Patterns

### Icon Placement

| Position | Pattern | Example |
|----------|---------|---------|
| **leading** | Icon before text | `<WalletIcon /> Connect Wallet` |
| **trailing** | Icon after text | `Buy Now <ArrowRightIcon />` |
| **only** | Icon alone | `<HeartIcon />` for favorites |

### Icon Button Sizes

| Size | Dimensions | Use Case |
|------|------------|----------|
| sm | 28x28px | Dense toolbars |
| default | 36x36px | Standard actions |
| lg | 44x44px | Touch-friendly |

### Icon + Text Spacing

```css
gap: 0.5rem; /* 8px between icon and text */
```

### NFT-Specific Icon Patterns

| Pattern | Icon | Action |
|---------|------|--------|
| Wallet connect | Wallet | Connect/disconnect |
| Favorite | Heart | Add to watchlist |
| Share | Share | Share NFT/collection |
| Refresh | RotateCw | Refresh metadata |
| External link | ExternalLink | View on Etherscan |

---

## 5. Button Groups

### Horizontal Groups

```
[Button 1][Button 2][Button 3]
```

- Remove internal borders between buttons
- First: rounded-l, Last: rounded-r
- Middle: no radius

### Vertical Groups

```
[Button 1]
[Button 2]
[Button 3]
```

- Stack with no gap
- First: rounded-t, Last: rounded-b

### Split Button Pattern

```
[Primary Action | Dropdown]
```

- Main action + secondary options
- Common in "Buy" with price options

### Zuno Current Implementation

Current `button-group.tsx` supports:
- Horizontal/vertical orientations
- ButtonGroupText for labels
- ButtonGroupSeparator

**Recommendation:** Add split button variant for trading actions.

---

## 6. Accessibility Requirements (WCAG 2.2)

### Minimum Requirements (AA Compliance)

| Requirement | Specification |
|-------------|---------------|
| **Target size** | Minimum 24x24px (WCAG 2.2) |
| **Contrast ratio** | 4.5:1 normal text, 3:1 large text |
| **Focus indicator** | 3:1 contrast, visible outline |
| **Touch target** | 44x44px recommended for mobile |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move to next button |
| Shift+Tab | Move to previous button |
| Enter | Activate button |
| Space | Activate button |

### ARIA Attributes

| Attribute | Use Case |
|-----------|----------|
| `aria-label` | Icon-only buttons |
| `aria-pressed` | Toggle buttons |
| `aria-expanded` | Dropdown triggers |
| `aria-disabled` | Disabled state |
| `aria-describedby` | Additional context |

### Focus Management

```css
button:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}
```

---

## 7. Animation and Micro-interactions

### Timing Guidelines

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover | 150-200ms | ease-out |
| Active/press | 100ms | ease-in-out |
| Loading spinner | 1000ms | linear (infinite) |
| Success flash | 300ms | ease-out |

### Hover Effects

```css
/* Lift effect */
transform: translateY(-2px);
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);

/* Scale effect (subtle) */
transform: scale(1.02);

/* Glow effect (NFT premium) */
box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
```

### Active/Press Effects

```css
transform: translateY(0) scale(0.98);
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
```

### Loading State Animation

```css
/* Spinner rotation */
@keyframes spin {
  to { transform: rotate(360deg); }
}
animation: spin 1s linear infinite;
```

### NFT-Specific Animations

| Animation | Trigger | Implementation |
|-----------|---------|----------------|
| **Shimmer** | Premium CTA | CSS gradient animation |
| **Pulse** | Live indicator | `animate-pulse` |
| **Bounce** | Success state | `animate-bounce` once |
| **Ripple** | Click feedback | Material-style ripple |

---

## 8. NFT Marketplace-Specific Patterns

### OpenSea OS2 Patterns

- Clean, rounded buttons (6px radius)
- Clear hierarchy with primary/secondary
- Wallet connect prominent in header
- Ghost buttons for secondary actions

### Blur Patterns

- Dense, data-rich interface
- Speed tier buttons (Slow/Normal/Fast)
- Real-time price integration
- Minimal visual fluff

### LooksRare Patterns

- Reward-centric button copy
- Staking integration CTAs
- Community governance buttons

### Recommended Zuno Patterns

| Pattern | Implementation |
|---------|----------------|
| **Buy Now** | Primary gradient, pulse on hover |
| **Place Bid** | Secondary outline, glow on focus |
| **Connect Wallet** | Ghost with wallet icon, prominent |
| **Make Offer** | Outline variant, pill shape |
| **Share** | Icon-only, ghost variant |
| **Favorite** | Icon-only, toggle state |

---

## 9. Implementation Recommendations

### For Button Debug Page

1. **Variant Showcase**
   - Display all variants side-by-side
   - Show light/dark mode versions
   - Include NFT-specific variants

2. **State Matrix**
   - Grid showing all variants in all states
   - Interactive hover/click testing

3. **Size Comparison**
   - Visual size chart
   - Touch target indicators

4. **Icon Patterns**
   - Leading, trailing, icon-only examples
   - Common NFT icon combinations

5. **Button Groups**
   - Horizontal, vertical, split examples
   - Toolbar patterns

6. **Accessibility Demo**
   - Keyboard navigation test
   - Focus indicator visibility
   - Screen reader labels

7. **Animation Playground**
   - Toggle animations on/off
   - Adjust timing parameters
   - Reduced motion preview

### Code Structure

```typescript
// Extended button variants for NFT marketplace
const buttonVariants = cva({
  variants: {
    variant: {
      // ... existing variants
      gradient: "bg-gradient-to-r from-primary to-secondary text-white",
      glass: "backdrop-blur-xl bg-white/10 border border-white/20",
      glow: "shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]",
    },
    size: {
      // ... existing sizes
      xs: "h-7 px-2.5 text-xs",
      xl: "h-12 px-8 text-lg",
    },
  },
});
```

---

## 10. Unresolved Questions

1. Should we implement 3D/depth effects for premium NFT actions?
2. What is the preferred loading spinner style (circular, dots, pulse)?
3. Should button groups support mixed variants?
4. Do we need skeleton button placeholders for async states?
5. What haptic feedback patterns should be implemented for mobile?

---

## Sources

- [10 Button Design Best Practices for 2025](https://niftybuttons.com/blog/10-button-design-best-practices-2025)
- [Motion UI Trends 2025: Micro-Interactions](https://www.betasofttechnology.com/motion-ui-trends-and-micro-interactions/)
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [Button and Link Text Accessibility: 2025 WCAG 2.2](https://www.allaccessible.org/blog/how-to-create-effective-button-and-link-text-for-accessible-websites)
- [Shadcn UI Ecosystem 2025](https://www.devkit.best/blog/mdx/shadcn-ui-ecosystem-complete-guide-2025)
- [OpenSea NFT Marketplace Trends 2025](https://medium.com/@jackjill7659/opensea-nft-marketplace-trends-2025-2ae7f1a73f6c)
- [NFT Marketplace UI designs on Dribbble](https://dribbble.com/tags/nft-marketplace-ui)

---

*Report generated for Zuno Marketplace UI button debug page implementation.*
