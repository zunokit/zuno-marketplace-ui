# Zuno NFT Marketplace - Color System Documentation

**Report Date:** 2026-01-30
**Designer:** ui-ux-designer
**Work Context:** E:/zuno-marketplace-ui

---

## Table of Contents

1. [Overview](#overview)
2. [Primary Colors](#primary-colors)
3. [Secondary Colors](#secondary-colors)
4. [Gray Scale (50-950)](#gray-scale-50-950)
5. [Semantic Colors](#semantic-colors)
6. [Status Colors](#status-colors)
7. [Rarity Colors](#rarity-colors)
8. [Transparency Effects](#transparency-effects)
9. [Dark Theme Colors](#dark-theme-colors)
10. [Light Theme Colors](#light-theme-colors)
11. [Usage Guidelines](#usage-guidelines)
12. [CSS Variables Reference](#css-variables-reference)

---

## Overview

The Zuno NFT Marketplace color system is designed with an OpenSea-inspired aesthetic, optimized for both dark and light modes. The system prioritizes:

- **WCAG 2.1 AA compliance** for accessibility
- **Frosted glass effects** for modern UI depth
- **Clear visual hierarchy** for NFT browsing
- **Consistent rarity indication** across the platform

---

## Primary Colors

### Brand Primary (OpenSea Gray-300 Inspired)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--primary` | `#acadae` | Primary text, icons, subtle CTAs |
| `--primary-foreground` | `#0d1117` (light) / `#ffffff` (dark) | Text on primary backgrounds |

**Usage Examples:**
```css
/* Primary button styling */
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

/* Navigation links */
.nav-link {
  color: var(--primary);
}
.nav-link:hover {
  color: #ffffff;
}
```

### Primary Scale (Extended)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `primary-50` | `#f8fafc` | Lightest backgrounds |
| `primary-100` | `#f1f5f9` | Hover states (light mode) |
| `primary-200` | `#e2e8f0` | Subtle borders |
| `primary-300` | `#acadae` | **Main primary color** |
| `primary-400` | `#94a3b8` | Secondary text |
| `primary-500` | `#64748b` | Muted elements |
| `primary-600` | `#475569` | Dark mode accents |
| `primary-700` | `#334155` | Deep backgrounds |
| `primary-800` | `#1e293b` | Card backgrounds |
| `primary-900` | `#0f172a` | Dark backgrounds |
| `primary-950` | `#020617` | Deepest backgrounds |

---

## Secondary Colors

### Frosted Glass Secondary

| Token | Value | Usage |
|-------|-------|-------|
| `--secondary` | `rgba(255, 255, 255, 0.08)` (dark) / `#f3f4f6` (light) | Secondary buttons, badges |
| `--secondary-foreground` | `#ffffff` (dark) / `#0d1117` (light) | Text on secondary |

**Usage Examples:**
```css
/* Secondary button - frosted effect */
.btn-secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
}

/* Filter badges */
.badge-filter {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
}
```

---

## Gray Scale (50-950)

### OpenSea Gray Palette

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--os-gray-50` | `#fcfcfc` | Lightest backgrounds |
| `--os-gray-100` | `#f9f9f9` | Card backgrounds (light) |
| `--os-gray-300` | `#acadae` | Primary gray, secondary text |
| `--os-gray-400` | `#34353c` | Dark mode card bg |
| `--os-gray-500` | `#26272d` | Dark mode elevated surfaces |
| `--os-gray-700` | `#101010` | Dark mode backgrounds |

### Extended Gray Scale (Tailwind Compatible)

| Token | Hex Value (Light) | Hex Value (Dark) | Usage |
|-------|-------------------|------------------|-------|
| `gray-50` | `#f9fafb` | `#18181b` | Light backgrounds |
| `gray-100` | `#f3f4f6` | `#27272a` | Hover states |
| `gray-200` | `#e5e7eb` | `#3f3f46` | Borders |
| `gray-300` | `#d1d5db` | `#52525b` | Muted text |
| `gray-400` | `#9ca3af` | `#71717a` | Placeholder text |
| `gray-500` | `#6b7280` | `#a1a1aa` | Secondary text |
| `gray-600` | `#4b5563` | `#d4d4d8` | Body text |
| `gray-700` | `#374151` | `#e4e4e7` | Headings |
| `gray-800` | `#1f2937` | `#f4f4f5` | High emphasis |
| `gray-900` | `#111827` | `#fafafa` | Maximum emphasis |
| `gray-950` | `#030712` | `#ffffff` | Pure contrast |

---

## Semantic Colors

### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--foreground` | `#0d1117` | `#f8fafc` | Primary text |
| `--muted-foreground` | `#374151` | `#acadae` | Secondary text |
| `--card-foreground` | `#0d1117` | `#f8fafc` | Card text |
| `--popover-foreground` | `#0d1117` | `#f8fafc` | Dropdown text |
| `--dialog-foreground` | `#0d1117` | `#f8fafc` | Modal text |

### Background Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | `#ffffff` | `#0a0a0a` | Page background |
| `--card` | `#f9fafb` | `#1e1e1e` | Card surfaces |
| `--popover` | `#ffffff` | `#1e1e1e` | Dropdown menus |
| `--dialog` | `#ffffff` | `#0e0a1a` | Modal overlays |
| `--muted` | `#f9fafb` | `#1a1525` | Muted sections |
| `--accent` | `#ddf4ff` | `rgba(255,255,255,0.12)` | Accent backgrounds |

### Border Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--border` | `#d1d5db` | `rgba(255,255,255,0.08)` | Default borders |
| `--border-muted` | `#e5e7eb` | `rgba(255,255,255,0.04)` | Subtle borders |
| `--input` | `#d1d5db` | `rgba(255,255,255,0.08)` | Input borders |
| `--ring` | `#0969da` | `rgba(255,255,255,0.16)` | Focus rings |

---

## Status Colors

### Success (Green)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--success` | `#1a7f37` | `#47bb64` | Success states |
| `--success-foreground` | `#ffffff` | `#ffffff` | Text on success |
| `--color-os-success` | `#1a7f37` | `#47bb64` | OpenSea success |

**Transparency Variants:**
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success-bg-light` | `#dafbe1` (light) / `rgb(71 187 100/8%)` (dark) | Light success bg |
| `--color-success-bg-medium` | `#aceebb` (light) / `rgb(71 187 100/16%)` (dark) | Medium success bg |
| `--color-success-border` | `#1a7f37` (light) / `rgba(71, 187, 100, 0.3)` (dark) | Success borders |

### Error/Destructive (Red)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--destructive` | `#cf222e` | `#e24756` | Error states |
| `--destructive-foreground` | `#ffffff` | `#ffffff` | Text on error |
| `--color-os-error` | `#cf222e` | `#e24756` | OpenSea error |

**Transparency Variants:**
| Token | Value | Usage |
|-------|-------|-------|
| `--color-error-bg-light` | `#ffebe9` (light) / `rgb(226 71 86/8%)` (dark) | Light error bg |
| `--color-error-bg-medium` | `#ffcecb` (light) / `rgb(226 71 86/16%)` (dark) | Medium error bg |
| `--color-error-border` | `#cf222e` (light) / `rgba(226, 71, 86, 0.3)` (dark) | Error borders |

### Warning (Yellow/Amber)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--warning` | `#bf8700` | `#ffcc00` | Warning states |
| `--warning-foreground` | `#ffffff` | `#0d1117` | Text on warning |
| `--color-os-warning` | `#bf8700` | `#ffcc00` | OpenSea warning |

**Transparency Variants:**
| Token | Value | Usage |
|-------|-------|-------|
| `--color-warning-bg-light` | `#fff8c5` (light) / `rgb(255 204 0/8%)` (dark) | Light warning bg |
| `--color-warning-bg-medium` | `#fae17d` (light) / `rgb(255 204 0/16%)` (dark) | Medium warning bg |
| `--color-warning-border` | `#9a6700` (light) / `rgba(255, 204, 0, 0.3)` (dark) | Warning borders |

### Info (Blue)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--info` | `#0969da` | `#83c3ff` | Info states |
| `--info-foreground` | `#ffffff` | `#ffffff` | Text on info |
| `--color-os-info` | `#0969da` | `#83c3ff` | OpenSea info |

**Transparency Variants:**
| Token | Value | Usage |
|-------|-------|-------|
| `--color-info-bg-light` | `#ddf4ff` (light) / `rgb(131 195 255/8%)` (dark) | Light info bg |
| `--color-info-bg-medium` | `#b6e3ff` (light) / `rgb(131 195 255/16%)` (dark) | Medium info bg |
| `--color-info-border` | `#0969da` (light) / `rgba(131, 195, 255, 0.3)` (dark) | Info borders |

---

## Rarity Colors

NFT rarity indication system with consistent color coding across the platform.

### Common

| Token | Value | Usage |
|-------|-------|-------|
| `--rarity-common` | `#9ca3af` | Common NFTs |
| `--rarity-common-bg` | `#f3f4f6` | Common badge bg |
| `--rarity-common-border` | `#d1d5db` | Common borders |

### Uncommon

| Token | Value | Usage |
|-------|-------|-------|
| `--rarity-uncommon` | `#22c55e` | Uncommon NFTs |
| `--rarity-uncommon-bg` | `#dcfce7` | Uncommon badge bg |
| `--rarity-uncommon-border` | `#86efac` | Uncommon borders |

### Rare (Blue)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-os-rare` | `#0969da` | `#00a3ff` | Rare NFTs |
| `--color-rare-bg` | `#ddf4ff` | `rgb(0 163 255/30%)` | Rare badge bg |
| `--color-rare-bg-light` | `#eef8ff` | `rgb(0 163 255/8%)` | Light rare bg |
| `--color-rare-border` | `#0969da` | `rgba(0, 163, 255, 0.5)` | Rare borders |

**Usage Example:**
```css
.badge-os-rare {
  background-color: var(--color-rare-transparent);
  color: #00a3ff;
  border: 1px solid rgba(0, 163, 255, 0.5);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
}
```

### Epic (Purple)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-os-epic` | `#8250df` | `#d358ff` | Epic NFTs |
| `--color-epic-bg` | `#fbefff` | `rgb(211 88 255/30%)` | Epic badge bg |
| `--color-epic-bg-light` | `#fdf7ff` | `rgb(211 88 255/8%)` | Light epic bg |
| `--color-epic-border` | `#8250df` | `rgba(211, 88, 255, 0.5)` | Epic borders |

**Usage Example:**
```css
.badge-os-epic {
  background-color: var(--color-epic-transparent);
  color: #d358ff;
  border: 1px solid rgba(211, 88, 255, 0.5);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
}
```

### Legendary (Orange/Gold)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-os-legendary` | `#bf8700` | `#ff8a00` | Legendary NFTs |
| `--color-legendary-bg` | `#fff8c5` | `rgb(255 138 0/30%)` | Legendary badge bg |
| `--color-legendary-bg-light` | `#fffbdd` | `rgb(255 138 0/8%)` | Light legendary bg |
| `--color-legendary-border` | `#bf8700` | `rgba(255, 138, 0, 0.5)` | Legendary borders |

**Usage Example:**
```css
.badge-os-legendary {
  background-color: var(--color-legendary-transparent);
  color: #ff8a00;
  border: 1px solid rgba(255, 138, 0, 0.5);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
}
```

### Rarity Color Summary Table

| Rarity | Dark Mode | Light Mode | Use Case |
|--------|-----------|------------|----------|
| Common | `#9ca3af` | `#6b7280` | Standard items |
| Uncommon | `#22c55e` | `#16a34a` | Slightly rare |
| Rare | `#00a3ff` | `#0969da` | Blue tier |
| Epic | `#d358ff` | `#8250df` | Purple tier |
| Legendary | `#ff8a00` | `#bf8700` | Gold tier |

---

## Transparency Effects

### Frosted Glass System

The frosted glass effect creates depth and modern UI aesthetics.

| Token | Dark Mode Value | Light Mode Value | Usage |
|-------|-----------------|------------------|-------|
| `--frosted-1` | `rgb(255 255 255/4%)` | `#f3f4f6` | Subtle backgrounds |
| `--frosted-2` | `rgb(255 255 255/8%)` | `#e5e7eb` | Card backgrounds |
| `--frosted-6` | `rgb(255 255 255/32%)` | `#d1d5db` | Strong frosted |
| `--frosted-7` | `rgb(255 255 255/50%)` | `#9ca3af` | Maximum frosted |

**CSS Variable Mapping:**
```css
--color-frosted-1: var(--frosted-1);
--color-frosted-2: var(--frosted-2);
--color-frosted-6: var(--frosted-6);
--color-frosted-7: var(--frosted-7);
```

### Border Transparency

| Token | Dark Mode Value | Light Mode Value | Usage |
|-------|-----------------|------------------|-------|
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | `#d1d5db` | Subtle borders |
| `--border-medium` | `rgba(255, 255, 255, 0.12)` | `#9ca3af` | Medium borders |
| `--border-strong` | `rgba(255, 255, 255, 0.16)` | `#6b7280` | Strong borders |

### Overlay Effects

| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| `--overlay-bg` | `rgb(0 0 0/60%)` | `rgba(0, 0, 0, 0.75)` | Modal overlays |
| `--color-overlay` | `rgb(0 0 0/60%)` | `rgba(0, 0, 0, 0.75)` | Backdrops |

### Interactive State Transparency

| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| `--hover-bg` | `rgba(255, 255, 255, 0.04)` | `#f3f4f6` | Hover states |
| `--active-bg` | `rgba(255, 255, 255, 0.08)` | `#e5e7eb` | Active states |
| `--color-hover-bg` | `rgba(255, 255, 255, 0.04)` | `#f3f4f6` | Hover backgrounds |
| `--color-active-bg` | `rgba(255, 255, 255, 0.08)` | `#e5e7eb` | Active backgrounds |

### Frosted Glass Component Example

```css
.card-os-frosted {
  background-color: var(--color-frosted-2);
  border: 1px solid var(--color-border-subtle);
  border-radius: 8px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.2s ease;
}

.card-os-frosted:hover {
  border-color: rgba(255, 255, 255, 0.16);
}
```

---

## Dark Theme Colors

### Base Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.145 0 0)` / `#0a0a0a` | Page background |
| `--foreground` | `oklch(0.985 0 0)` / `#f8fafc` | Primary text |

### UI Elements

| Token | Value | Usage |
|-------|-------|-------|
| `--card` | `oklch(0.205 0 0)` / `#1e1e1e` | Card surfaces |
| `--popover` | `oklch(0.205 0 0)` / `#1e1e1e` | Dropdowns |
| `--dialog` | `oklch(0.08 0.015 280)` / `#0e0a1a` | Modals |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `oklch(0.922 0 0)` / `#acadae` | Primary elements |
| `--secondary` | `oklch(0.269 0 0)` / `rgba(255,255,255,0.08)` | Secondary elements |
| `--muted` | `oklch(0.12 0.01 280)` / `#1a1525` | Muted sections |
| `--muted-foreground` | `oklch(0.708 0 0)` / `#acadae` | Secondary text |
| `--accent` | `oklch(0.269 0 0)` / `rgba(255,255,255,0.12)` | Accents |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--destructive` | `oklch(0.704 0.191 22.216)` / `#e24756` | Errors |
| `--success` | `oklch(0.65 0.17 150)` / `#47bb64` | Success |
| `--warning` | `oklch(0.78 0.15 90)` / `#ffcc00` | Warnings |
| `--info` | `oklch(0.65 0.2 235)` / `#83c3ff` | Info |

### Border & Input

| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `oklch(0.22 0.02 270)` / `#3a3450` | Borders |
| `--border-muted` | `oklch(1 0 0 / 5%)` | Subtle borders |
| `--input` | `oklch(1 0 0 / 15%)` | Input fields |
| `--ring` | `oklch(0.556 0 0)` | Focus rings |

### Interactive States

| Token | Value | Usage |
|-------|-------|-------|
| `--hover` | `oklch(0.17 0.01 280)` / `#2a2535` | Hover state |
| `--active` | `oklch(0.22 0.015 280)` | Active state |

---

## Light Theme Colors

### Base Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#ffffff` | Page background |
| `--foreground` | `#0d1117` | Primary text |

### UI Elements

| Token | Value | Usage |
|-------|-------|-------|
| `--card` | `#f9fafb` | Card surfaces |
| `--popover` | `#ffffff` | Dropdowns |
| `--dialog` | `#ffffff` | Modals |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#1a1a1a` | Primary elements |
| `--secondary` | `#f3f4f6` | Secondary elements |
| `--muted` | `#f9fafb` | Muted sections |
| `--muted-foreground` | `#374151` | Secondary text |
| `--accent` | `#ddf4ff` | Accents |
| `--accent-foreground` | `#0969da` | Text on accent |

### Status Colors (WCAG AA Compliant)

| Token | Value | Contrast Ratio |
|-------|-------|----------------|
| `--destructive` | `#cf222e` | 5.01:1 |
| `--success` | `#1a7f37` | 4.84:1 |
| `--warning` | `#9a6700` | 4.5:1 |
| `--info` | `#0969da` | 5.88:1 |

### Border & Input

| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `#d1d5db` | Borders |
| `--border-muted` | `#e5e7eb` | Subtle borders |
| `--input` | `#d1d5db` | Input fields |
| `--ring` | `#0969da` | Focus rings |

### Interactive States

| Token | Value | Usage |
|-------|-------|-------|
| `--hover` | `#f3f4f6` | Hover state |
| `--active` | `#e5e7eb` | Active state |

---

## Usage Guidelines

### Do's and Don'ts

#### Primary Colors

**DO:**
- Use `--primary` for primary CTAs (Buy, Mint, Connect)
- Use `--primary` for active states and selections
- Use `--primary` for important notifications

**DON'T:**
- Use primary colors for background elements
- Use primary colors for less important text
- Use primary colors for decorative elements only

#### Neutral Colors

**DO:**
- Use neutral colors for text and backgrounds
- Use neutral colors for dividers and borders
- Use neutral colors for supporting elements

**DON'T:**
- Use neutral colors for primary CTAs
- Use neutral colors for important alerts
- Use neutral colors for interactive elements

### NFT Card Color Usage

```typescript
// NFT Card with proper color usage
const NFTCard = () => (
  <div className="bg-card border border-border rounded-lg overflow-hidden">
    {/* Image container with overlay on hover */}
    <div className="aspect-square relative group">
      <img src={nft.image} alt={nft.name} />
      <div className="absolute inset-0 bg-overlay opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="btn-os-primary">Buy Now</button>
      </div>
      {/* Rarity badge */}
      <span className="badge-os-legendary absolute top-2 right-2">Legendary</span>
    </div>
    {/* Content */}
    <div className="p-4">
      <h3 className="text-foreground font-semibold">{nft.name}</h3>
      <p className="text-muted-foreground text-sm">{nft.collection}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-os-success font-medium">{nft.price} ETH</span>
        <span className="text-muted-foreground text-sm">{nft.likes} likes</span>
      </div>
    </div>
  </div>
);
```

### Button Color Usage

```css
/* Primary Button */
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

/* Secondary Button (Frosted) */
.btn-secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
}

/* Success Button */
.btn-success {
  background-color: var(--success);
  color: var(--success-foreground);
}

/* Destructive Button */
.btn-destructive {
  background-color: var(--destructive);
  color: var(--destructive-foreground);
}
```

### Form Input Color Usage

```css
.input-os {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border-subtle);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  font-size: 14px;
  transition: all 0.15s ease;
}

.input-os:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.input-os:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
}

.input-os::placeholder {
  color: rgb(172, 173, 174);
}
```

---

## CSS Variables Reference

### Complete Variable List

```css
/* ==================== BASE THEME ==================== */
--background
--foreground
--card
--card-foreground
--popover
--popover-foreground
--dialog
--dialog-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--destructive-foreground
--success
--success-foreground
--warning
--warning-foreground
--info
--info-foreground
--border
--border-muted
--input
--ring
--hover
--active
--scrollbar-thumb
--scrollbar-track
--chart-1
--chart-2
--chart-3
--chart-4
--chart-5
--sidebar
--sidebar-foreground
--sidebar-primary
--sidebar-primary-foreground
--sidebar-accent
--sidebar-accent-foreground
--sidebar-border
--sidebar-ring

/* ==================== OPENSEA GRAYS ==================== */
--color-os-gray-50
--color-os-gray-100
--color-os-gray-300
--color-os-gray-400
--color-os-gray-500
--color-os-gray-700

/* ==================== OPENSEA SEMANTIC ==================== */
--color-os-success
--color-os-error
--color-os-info
--color-os-warning
--color-os-rare
--color-os-legendary
--color-os-epic

/* ==================== FROSTED/TRANSPARENCY ==================== */
--frosted-1
--frosted-2
--frosted-6
--frosted-7
--color-frosted-1
--color-frosted-2
--color-frosted-6
--color-frosted-7
--border-subtle
--border-medium
--border-strong
--color-border-subtle
--color-border-medium
--color-border-strong
--hover-bg
--active-bg
--color-hover-bg
--color-active-bg
--overlay-bg
--color-overlay

/* ==================== STATUS TRANSPARENCIES ==================== */
--color-success-bg-light
--color-success-bg-medium
--color-success-border
--color-success-transparent-1
--color-success-transparent-2
--color-error-bg-light
--color-error-bg-medium
--color-error-border
--color-error-transparent-1
--color-error-transparent-2
--color-warning-bg-light
--color-warning-bg-medium
--color-warning-border
--color-warning-transparent-1
--color-warning-transparent-2
--color-info-bg-light
--color-info-bg-medium
--color-info-border

/* ==================== RARITY TRANSPARENCIES ==================== */
--color-rare-bg
--color-rare-bg-light
--color-rare-border
--color-rare-transparent
--color-rare-transparent-1
--color-legendary-bg
--color-legendary-bg-light
--color-legendary-border
--color-legendary-transparent
--color-legendary-transparent-1
--color-epic-bg
--color-epic-bg-light
--color-epic-border
--color-epic-transparent
--color-epic-transparent-1

/* ==================== RADIUS ==================== */
--radius
--radius-sm
--radius-md
--radius-lg
--radius-xl
```

---

## Accessibility Notes

### Contrast Ratios (WCAG 2.1 AA)

| Combination | Ratio | Status |
|-------------|-------|--------|
| `#0d1117` on `#ffffff` | 15.8:1 | AAA |
| `#374151` on `#ffffff` | 7.4:1 | AAA |
| `#1a7f37` on `#ffffff` | 4.84:1 | AA |
| `#cf222e` on `#ffffff` | 5.01:1 | AA |
| `#0969da` on `#ffffff` | 5.88:1 | AA |
| `#ffffff` on `#0a0a0a` | 19.5:1 | AAA |
| `#acadae` on `#0a0a0a` | 7.2:1 | AAA |
| `#47bb64` on `#0a0a0a` | 8.4:1 | AAA |

### Color Blindness Considerations

- Rarity colors use distinct hues (blue, purple, orange) that remain distinguishable for most color vision deficiencies
- Always pair rarity colors with text labels
- Use patterns or icons in addition to color for critical information

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Main CSS variables and theme definitions |
| `src/shared/components/theme-provider.tsx` | Theme context provider |
| `src/shared/components/layout/dark-mode/ModeToggle.tsx` | Theme toggle component |

---

## Unresolved Questions

1. Should we add a "Mythic" rarity tier above Legendary (e.g., red/crimson color)?
2. Do we need additional chart colors for data visualization beyond the current 5?
3. Should we implement CSS custom properties for animation durations/easings?
