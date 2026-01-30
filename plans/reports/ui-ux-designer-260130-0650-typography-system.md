# Typography System for Zuno NFT Marketplace

## Overview

Comprehensive typography system inspired by OpenSea design language. Uses GT America as primary typeface with carefully crafted type scale, weights, and spacing optimized for NFT marketplace interfaces.

---

## 1. Font Family Recommendations

### Primary Font: GT America (Recommended)

GT America is OpenSea's signature typeface - a neo-grotesque sans-serif combining Swiss typography with American gothic styles.

```css
/* GT America Font Stack */
--font-gt-america: "GT America", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-gt-america-mono: "GT America Mono", "SF Mono", "Monaco", "Inconsolata", monospace;
```

**Font Variants:**
- GT America Regular (400)
- GT America Medium (500)
- GT America Bold (700)
- GT America Mono Regular (400)
- GT America Mono Medium (500)

### Free Alternative: Inter + JetBrains Mono

For projects without GT America license:

```typescript
// layout.tsx
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
```

### Alternative Options

| Font | Use Case | Character |
|------|----------|-----------|
| **Inter** | Body text, UI | Clean, highly legible |
| **Space Grotesk** | Headlines | Modern, geometric |
| **DM Sans** | Headlines | Friendly, approachable |
| **Plus Jakarta Sans** | All-purpose | Contemporary, versatile |
| **Satoshi** | All-purpose | Premium feel (similar to GT America) |

---

## 2. Type Scale

### Base Scale (OpenSea Inspired)

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-2xs` | 10px | 12px | Fine print, timestamps |
| `text-xs` | 12px | 16px | Captions, labels, metadata |
| `text-sm` | 14px | 20px | Body small, buttons, nav |
| `text-base` | 16px | 24px | Body text, inputs |
| `text-lg` | 18px | 28px | Lead paragraphs |
| `text-xl` | 20px | 30px | Card titles, section headers |
| `text-2xl` | 24px | 32px | Page subtitles |
| `text-3xl` | 30px | 40px | Page titles |
| `text-4xl` | 36px | 44px | Hero sections |
| `text-5xl` | 48px | 56px | Major headlines |
| `text-6xl` | 60px | 68px | Display headlines |

### NFT Marketplace Specific Scale

```typescript
// src/shared/theme/typography.ts
export const typography = {
  // Display sizes for hero sections
  display: {
    xl: { size: "4rem", lineHeight: "4.5rem", letterSpacing: "-0.02em" },    // 64px
    lg: { size: "3.5rem", lineHeight: "4rem", letterSpacing: "-0.02em" },     // 56px
    md: { size: "3rem", lineHeight: "3.5rem", letterSpacing: "-0.01em" },     // 48px
    sm: { size: "2.5rem", lineHeight: "3rem", letterSpacing: "-0.01em" },     // 40px
  },

  // Headings
  heading: {
    h1: { size: "2.5rem", lineHeight: "3rem", letterSpacing: "-0.01em" },     // 40px
    h2: { size: "2rem", lineHeight: "2.5rem", letterSpacing: "-0.01em" },      // 32px
    h3: { size: "1.5rem", lineHeight: "2rem", letterSpacing: "0" },           // 24px
    h4: { size: "1.25rem", lineHeight: "1.75rem", letterSpacing: "0" },       // 20px
    h5: { size: "1rem", lineHeight: "1.5rem", letterSpacing: "0.01em" },      // 16px
    h6: { size: "0.875rem", lineHeight: "1.25rem", letterSpacing: "0.01em" }, // 14px
  },

  // Body text
  body: {
    xl: { size: "1.25rem", lineHeight: "1.875rem", letterSpacing: "0" },      // 20px
    lg: { size: "1.125rem", lineHeight: "1.75rem", letterSpacing: "0" },      // 18px
    base: { size: "1rem", lineHeight: "1.5rem", letterSpacing: "0" },         // 16px
    sm: { size: "0.875rem", lineHeight: "1.375rem", letterSpacing: "0" },     // 14px
    xs: { size: "0.75rem", lineHeight: "1.25rem", letterSpacing: "0.01em" },  // 12px
  },

  // UI elements
  ui: {
    button: { size: "0.875rem", lineHeight: "1.25rem", letterSpacing: "0" },  // 14px
    label: { size: "0.75rem", lineHeight: "1rem", letterSpacing: "0.02em" },  // 12px
    caption: { size: "0.75rem", lineHeight: "1rem", letterSpacing: "0.01em" }, // 12px
    overline: { size: "0.625rem", lineHeight: "0.875rem", letterSpacing: "0.08em" }, // 10px
  },

  // Monospace (for prices, wallet addresses, token IDs)
  mono: {
    lg: { size: "1.125rem", lineHeight: "1.5rem", letterSpacing: "0" },       // 18px
    base: { size: "0.875rem", lineHeight: "1.25rem", letterSpacing: "0" },    // 14px
    sm: { size: "0.75rem", lineHeight: "1rem", letterSpacing: "0.02em" },     // 12px
  },
};
```

---

## 3. Font Weights

### Weight Scale

| Weight | Value | Usage |
|--------|-------|-------|
| `font-light` | 300 | Large display text, elegant headings |
| `font-normal` | 400 | Body text, descriptions, UI elements |
| `font-medium` | 500 | Headings, buttons, emphasis |
| `font-semibold` | 600 | Strong emphasis, active states |
| `font-bold` | 700 | Headlines, prices, CTAs |
| `font-extrabold` | 800 | Hero headlines, maximum impact |

### Weight Guidelines

```css
/* Headings: Medium (500) for GT America elegance */
.heading {
  font-weight: 500;
}

/* Body: Normal (400) for readability */
.body {
  font-weight: 400;
}

/* Prices/CTAs: Bold (700) for emphasis */
.price,
.cta {
  font-weight: 700;
}

/* Monospace: Medium (500) for numbers */
.mono-number {
  font-family: var(--font-mono);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
```

---

## 4. Line Heights

### Line Height Scale

| Token | Value | Usage |
|-------|-------|-------|
| `leading-none` | 1 | Headlines, single lines |
| `leading-tight` | 1.25 | Headings, compact text |
| `leading-snug` | 1.375 | Subheadings, short paragraphs |
| `leading-normal` | 1.5 | Body text (default) |
| `leading-relaxed` | 1.625 | Long paragraphs, readability |
| `leading-loose` | 2 | Maximum readability, spacious |

### NFT Marketplace Specific

```css
/* Tight for headlines */
.headline {
  line-height: 1.2;
}

/* Normal for body */
.body-text {
  line-height: 1.5;
}

/* Relaxed for descriptions */
.description {
  line-height: 1.6;
}

/* Mono numbers - tight for alignment */
.token-id,
.price-eth {
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
}
```

---

## 5. Letter Spacing

### Tracking Scale

| Token | Value | Usage |
|-------|-------|-------|
| `tracking-tighter` | -0.05em | Large display text |
| `tracking-tight` | -0.025em | Headlines, headings |
| `tracking-normal` | 0 | Body text (default) |
| `tracking-wide` | 0.025em | Small caps, labels |
| `tracking-wider` | 0.05em | Uppercase text, buttons |
| `tracking-widest` | 0.1em | Overlines, badges |

### NFT Marketplace Usage

```css
/* Display headlines - slight negative tracking */
.display-xl {
  letter-spacing: -0.02em;
}

/* Uppercase labels - wide tracking */
.label-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Overlines - widest tracking */
.overline {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.625rem;
}

/* Mono text - slight positive tracking for readability */
.mono-text {
  letter-spacing: 0.02em;
}
```

---

## 6. Typography Hierarchy

### Visual Hierarchy Map

```
┌─────────────────────────────────────────────────────────┐
│  DISPLAY (64px, Bold)                                   │
│  "Discover Extraordinary NFTs"                          │
│  Hero headlines, landing pages                          │
├─────────────────────────────────────────────────────────┤
│  H1 (40px, Medium)                                      │
│  Page titles, collection names                          │
├─────────────────────────────────────────────────────────┤
│  H2 (32px, Medium)                                      │
│  Section headers, category titles                       │
├─────────────────────────────────────────────────────────┤
│  H3 (24px, Medium)                                      │
│  Card titles, NFT names                                 │
├─────────────────────────────────────────────────────────┤
│  H4 (20px, Medium)                                      │
│  Subsection headers, modal titles                       │
├─────────────────────────────────────────────────────────┤
│  H5 (16px, Medium)                                      │
│  Widget titles, filter headers                          │
├─────────────────────────────────────────────────────────┤
│  H6 (14px, Medium)                                      │
│  Small headers, list titles                             │
├─────────────────────────────────────────────────────────┤
│  BODY LARGE (18px, Normal)                              │
│  Lead paragraphs, featured descriptions                 │
├─────────────────────────────────────────────────────────┤
│  BODY (16px, Normal)                                    │
│  Main content, descriptions                             │
├─────────────────────────────────────────────────────────┤
│  BODY SMALL (14px, Normal)                              │
│  Secondary text, metadata                               │
├─────────────────────────────────────────────────────────┤
│  CAPTION (12px, Normal)                                 │
│  Timestamps, small labels                               │
├─────────────────────────────────────────────────────────┤
│  OVERLINE (10px, Medium)                                │
│  Tags, badges, category labels                          │
└─────────────────────────────────────────────────────────┘
```

### Component Typography Patterns

```typescript
// NFT Card Typography
const nftCardTypography = {
  name: "text-lg font-medium leading-tight",           // 18px, medium
  collection: "text-sm text-muted-foreground",         // 14px, gray
  price: "text-base font-bold font-mono",              // 16px, bold, mono
  currency: "text-sm font-mono text-muted-foreground", // 14px, mono
  creator: "text-xs text-muted-foreground",            // 12px
};

// Collection Card Typography
const collectionCardTypography = {
  name: "text-xl font-medium",                         // 20px
  floor: "text-sm font-mono",                          // 14px, mono
  volume: "text-xs font-mono text-muted-foreground",   // 12px, mono
};

// Navigation Typography
const navTypography = {
  logo: "text-2xl font-bold tracking-tight",           // 24px
  link: "text-sm font-medium",                         // 14px
  dropdown: "text-sm",                                 // 14px
};

// Form Typography
const formTypography = {
  label: "text-sm font-medium",                        // 14px
  input: "text-base",                                  // 16px
  helper: "text-xs text-muted-foreground",             // 12px
  error: "text-xs text-destructive",                   // 12px
};
```

---

## 7. Responsive Typography

### Mobile-First Approach

```typescript
// src/shared/theme/responsive-typography.ts
export const responsiveTypography = {
  // Display sizes scale down on mobile
  display: {
    xl: {
      mobile: "2.5rem",    // 40px
      tablet: "3rem",      // 48px
      desktop: "4rem",     // 64px
    },
    lg: {
      mobile: "2rem",      // 32px
      tablet: "2.5rem",    // 40px
      desktop: "3.5rem",   // 56px
    },
  },

  // Headings
  h1: {
    mobile: "1.75rem",     // 28px
    tablet: "2rem",        // 32px
    desktop: "2.5rem",     // 40px
  },
  h2: {
    mobile: "1.5rem",      // 24px
    tablet: "1.75rem",     // 28px
    desktop: "2rem",       // 32px
  },
  h3: {
    mobile: "1.25rem",     // 20px
    tablet: "1.375rem",    // 22px
    desktop: "1.5rem",     // 24px
  },

  // Body stays consistent for readability
  body: {
    mobile: "1rem",        // 16px
    tablet: "1rem",        // 16px
    desktop: "1rem",       // 16px
  },
};
```

### Tailwind Implementation

```css
/* globals.css - Responsive typography utilities */
@layer utilities {
  .text-responsive-display {
    font-size: 2.5rem;
    line-height: 1.2;
  }

  @media (min-width: 768px) {
    .text-responsive-display {
      font-size: 3rem;
      line-height: 1.15;
    }
  }

  @media (min-width: 1024px) {
    .text-responsive-display {
      font-size: 4rem;
      line-height: 1.1;
    }
  }

  .text-responsive-h1 {
    font-size: 1.75rem;
    line-height: 1.3;
  }

  @media (min-width: 768px) {
    .text-responsive-h1 {
      font-size: 2rem;
    }
  }

  @media (min-width: 1024px) {
    .text-responsive-h1 {
      font-size: 2.5rem;
    }
  }
}
```

### Component Usage

```tsx
// Responsive heading component
export const ResponsiveHeading = ({
  level = 1,
  children,
  className,
}: HeadingProps) => {
  const baseClasses = {
    1: "text-[1.75rem] md:text-[2rem] lg:text-[2.5rem] font-medium leading-tight",
    2: "text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-medium leading-tight",
    3: "text-[1.25rem] md:text-[1.375rem] lg:text-[1.5rem] font-medium leading-snug",
    4: "text-lg md:text-xl font-medium leading-snug",
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return <Tag className={cn(baseClasses[level], className)}>{children}</Tag>;
};
```

---

## 8. Code Snippets for Implementation

### 1. CSS Custom Properties

```css
/* globals.css */
:root {
  /* Font families */
  --font-sans: var(--font-gt-america, var(--font-inter, system-ui, sans-serif));
  --font-mono: var(--font-gt-america-mono, var(--font-jetbrains, monospace));

  /* Font sizes */
  --text-2xs: 0.625rem;   /* 10px */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */

  /* Line heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

### 2. Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-gt-america)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-gt-america-mono)", "var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
    },
  },
};

export default config;
```

### 3. Typography Components

```typescript
// src/shared/components/typography/index.ts

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Heading component
const headingVariants = cva("font-sans tracking-tight", {
  variants: {
    level: {
      1: "text-4xl md:text-5xl font-medium leading-tight",
      2: "text-3xl md:text-4xl font-medium leading-tight",
      3: "text-2xl md:text-3xl font-medium leading-snug",
      4: "text-xl md:text-2xl font-medium leading-snug",
      5: "text-lg md:text-xl font-medium leading-snug",
      6: "text-base md:text-lg font-medium leading-snug",
    },
  },
  defaultVariants: {
    level: 1,
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = ({
  className,
  level = 1,
  as,
  children,
  ...props
}: HeadingProps) => {
  const Tag = as || (`h${level}` as keyof JSX.IntrinsicElements);
  return (
    <Tag className={cn(headingVariants({ level }), className)} {...props}>
      {children}
    </Tag>
  );
};

// Text component
const textVariants = cva("font-sans", {
  variants: {
    size: {
      xl: "text-lg md:text-xl leading-relaxed",
      lg: "text-base md:text-lg leading-relaxed",
      base: "text-base leading-normal",
      sm: "text-sm leading-normal",
      xs: "text-xs leading-normal",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    color: "default",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export const Text = ({
  className,
  size,
  weight,
  color,
  as = "p",
  children,
  ...props
}: TextProps) => {
  const Tag = as;
  return (
    <Tag
      className={cn(textVariants({ size, weight, color }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

// Monospace component (for prices, addresses)
const monoVariants = cva("font-mono tabular-nums", {
  variants: {
    size: {
      lg: "text-base md:text-lg",
      base: "text-sm",
      sm: "text-xs",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "medium",
  },
});

export interface MonoProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof monoVariants> {}

export const Mono = ({
  className,
  size,
  weight,
  children,
  ...props
}: MonoProps) => {
  return (
    <span className={cn(monoVariants({ size, weight }), className)} {...props}>
      {children}
    </span>
  );
};

// Label component
const labelVariants = cva("font-sans uppercase tracking-wider", {
  variants: {
    size: {
      sm: "text-xs",
      base: "text-sm",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    size: "sm",
    weight: "medium",
  },
});

export interface LabelProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof labelVariants> {}

export const Label = ({
  className,
  size,
  weight,
  children,
  ...props
}: LabelProps) => {
  return (
    <span className={cn(labelVariants({ size, weight }), className)} {...props}>
      {children}
    </span>
  );
};
```

### 4. Usage Examples

```tsx
// Example: NFT Card with proper typography
import { Heading, Text, Mono, Label } from "@/shared/components/typography";

export const NFTCard = ({ nft }: { nft: NFT }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    {/* NFT Image */}
    <div className="aspect-square rounded-md overflow-hidden mb-4">
      <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
    </div>

    {/* Collection Label */}
    <Label size="sm" className="text-muted-foreground mb-1">
      {nft.collection.name}
    </Label>

    {/* NFT Name */}
    <Heading level={4} className="mb-2 line-clamp-1">
      {nft.name}
    </Heading>

    {/* Price */}
    <div className="flex items-center gap-2">
      <Mono size="base" weight="semibold" className="text-foreground">
        {nft.price} ETH
      </Mono>
      <Text size="xs" color="muted">
        ${nft.priceUsd}
      </Text>
    </div>

    {/* Last Sale */}
    <Text size="xs" color="muted" className="mt-2">
      Last sale: <Mono size="sm">{nft.lastSale} ETH</Mono>
    </Text>
  </div>
);

// Example: Collection Header
export const CollectionHeader = ({ collection }: { collection: Collection }) => (
  <div className="space-y-6">
    <Heading level={1}>{collection.name}</Heading>

    <Text size="lg" color="muted" className="max-w-2xl">
      {collection.description}
    </Text>

    <div className="flex gap-8">
      <div>
        <Label size="sm" className="text-muted-foreground block mb-1">
          Floor Price
        </Label>
        <Mono size="lg" weight="semibold">
          {collection.floorPrice} ETH
        </Mono>
      </div>
      <div>
        <Label size="sm" className="text-muted-foreground block mb-1">
          Total Volume
        </Label>
        <Mono size="lg" weight="semibold">
          {collection.totalVolume} ETH
        </Mono>
      </div>
      <div>
        <Label size="sm" className="text-muted-foreground block mb-1">
          Items
        </Label>
        <Mono size="lg" weight="semibold">
          {collection.itemCount.toLocaleString()}
        </Mono>
      </div>
    </div>
  </div>
);
```

### 5. Font Loading Strategy

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Primary font - Inter as GT America alternative
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

// Monospace font for prices and addresses
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Zuno Marketplace",
  description: "Discover, collect, and sell extraordinary NFTs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

---

## 9. Typography Tokens Summary

### Design Tokens

```json
{
  "typography": {
    "fontFamily": {
      "sans": {
        "value": ["GT America", "Inter", "system-ui", "sans-serif"],
        "type": "fontFamilies"
      },
      "mono": {
        "value": ["GT America Mono", "JetBrains Mono", "monospace"],
        "type": "fontFamilies"
      }
    },
    "fontSize": {
      "2xs": { "value": "10px", "type": "fontSizes" },
      "xs": { "value": "12px", "type": "fontSizes" },
      "sm": { "value": "14px", "type": "fontSizes" },
      "base": { "value": "16px", "type": "fontSizes" },
      "lg": { "value": "18px", "type": "fontSizes" },
      "xl": { "value": "20px", "type": "fontSizes" },
      "2xl": { "value": "24px", "type": "fontSizes" },
      "3xl": { "value": "30px", "type": "fontSizes" },
      "4xl": { "value": "36px", "type": "fontSizes" },
      "5xl": { "value": "48px", "type": "fontSizes" },
      "6xl": { "value": "60px", "type": "fontSizes" }
    },
    "fontWeight": {
      "light": { "value": 300, "type": "fontWeights" },
      "normal": { "value": 400, "type": "fontWeights" },
      "medium": { "value": 500, "type": "fontWeights" },
      "semibold": { "value": 600, "type": "fontWeights" },
      "bold": { "value": 700, "type": "fontWeights" },
      "extrabold": { "value": 800, "type": "fontWeights" }
    },
    "lineHeight": {
      "none": { "value": 1, "type": "lineHeights" },
      "tight": { "value": 1.25, "type": "lineHeights" },
      "snug": { "value": 1.375, "type": "lineHeights" },
      "normal": { "value": 1.5, "type": "lineHeights" },
      "relaxed": { "value": 1.625, "type": "lineHeights" },
      "loose": { "value": 2, "type": "lineHeights" }
    },
    "letterSpacing": {
      "tighter": { "value": "-0.05em", "type": "letterSpacing" },
      "tight": { "value": "-0.025em", "type": "letterSpacing" },
      "normal": { "value": "0", "type": "letterSpacing" },
      "wide": { "value": "0.025em", "type": "letterSpacing" },
      "wider": { "value": "0.05em", "type": "letterSpacing" },
      "widest": { "value": "0.1em", "type": "letterSpacing" }
    }
  }
}
```

---

## 10. Best Practices

### Do's

- Use `font-medium` (500) for headings to maintain OpenSea's elegant aesthetic
- Apply `tabular-nums` to all numeric values for alignment
- Use monospace fonts for wallet addresses, token IDs, and prices
- Maintain consistent line-height ratios across breakpoints
- Use negative letter-spacing for large display text
- Apply uppercase + wide tracking for labels and overlines

### Don'ts

- Don't use font weights below 400 for body text
- Don't use line-height below 1.2 for readable text
- Don't mix more than 2 font families
- Don't use font sizes below 12px for UI elements
- Don't apply letter-spacing to body paragraphs
- Don't use bold (700) for body text

### Accessibility

- Minimum font size: 12px for UI elements
- Line height: minimum 1.5 for body text
- Contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Allow text resizing up to 200% without breaking layout
- Use semantic HTML elements (h1-h6, p, etc.)

---

## Files Created/Modified

| File | Purpose |
|------|---------|
| `globals.css` | CSS custom properties, utility classes |
| `tailwind.config.ts` | Extended font configuration |
| `src/shared/components/typography/index.ts` | Typography components |
| `src/shared/theme/typography.ts` | TypeScript tokens |

---

## Unresolved Questions

1. Should we purchase GT America license or use free alternatives?
2. Do we need additional font weights (light 300, extrabold 800)?
3. Should we implement fluid typography with `clamp()`?
4. Any specific Vietnamese character requirements for font selection?
