# Mobile Bottom Navigation Research: Consolidating Multiple Bars

## Problem Statement

Current mobile UI has 3 stacked bars at bottom:
1. **Footer** - Fixed with theme toggle, links
2. **SelectionBar** - Buy/Sell toggle, slider, item count
3. **CTA Bar** - "Make offer" button

This consumes excessive screen space on mobile devices.

---

## Research Findings

### 1. Consolidation Strategies

| Pattern | Description | Best For |
|---------|-------------|----------|
| **Sticky Mini-Footer** | Compact 56-64px bar with 1-2 high-priority actions | Mobile SaaS, e-commerce, onboarding flows |
| **Auto-Hide + Reveal-on-Intent** | Hides on scroll down, reappears on upward swipe | Content-heavy apps, browsing experiences |
| **Floating Action Button (FAB)** | Primary CTA combined with bottom nav | Single-primary-action screens |
| **Contextual Bottom Sheets** | Expandable panels replace fixed secondary nav | Complex actions, filters, secondary options |
| **Hybrid Collapsed Bar** | Combines multiple elements into single expandable bar | Marketplaces with buy/sell toggles |

### 2. NFT Marketplace Patterns (OpenSea, Blur)

**OpenSea Mobile Pattern:**
- Minimalist bottom tab bar (4-5 icons)
- "Buy Now"/"Make Offer" actions in **bottom sheet** on item detail
- Primary CTA as **center floating action button** on key screens
- Contextual actions appear only when relevant

**Blur Mobile Pattern:**
- Clean, dark-mode interface (pro-trader focused)
- **Quick-action sweep button** for batch operations
- Real-time data ticker integrated into nav area
- **Bottom sheet** for bid placement
- Portfolio quick-view accessible from nav

**Common NFT Marketplace Patterns:**
```
┌─────────────────────────────┐
│      [Content Area]         │
│                             │
├─────────────────────────────┤
│  🏠    🔍    ➕    💼    👤  │
│ Home  Search  ACT Portfolio Profile
│         (FAB-style)         │
└─────────────────────────────┘
```

### 3. Hide/Show Behavior

**Recommended Scroll Pattern:**
| Scroll Direction | Action | Rationale |
|------------------|--------|-----------|
| **Down** | Hide non-critical bars | Maximize content viewing area |
| **Up** | Reveal all bars | Signal user wants to navigate/act |
| **Pause/Stop** | Keep CTA visible | Maintain conversion opportunity |

**Implementation:**
```javascript
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY + 20) {
    // Scrolling down - hide footer/selection bar
    footer.style.transform = 'translateY(100%)';
  } else if (currentScrollY < lastScrollY - 20) {
    // Scrolling up - show all bars
    footer.style.transform = 'translateY(0)';
  }
  lastScrollY = currentScrollY;
});
```

**Animation Specs:**
- Duration: 300-500ms ease-in-out
- Height: 56-64px per bar
- Safe area: Respect `env(safe-area-inset-bottom)`

### 4. Mobile vs Desktop Priority

| Element | Desktop | Mobile | Action |
|---------|---------|--------|--------|
| Footer links | Show all | Hide/Move to menu | Move to hamburger menu |
| Theme toggle | Footer | Settings menu | Relocate |
| Buy/Sell toggle | Always visible | Collapsed/Sheet | Convert to bottom sheet |
| Item count | Text display | Badge/dot | Simplify |
| Slider | Full width | Compact/stepped | Reduce or modal |
| "Make Offer" CTA | Visible | Always sticky | Keep visible always |

---

## Specific Recommendations

### Option 1: Consolidated Single Bar (Recommended)

Combine SelectionBar + CTA into one collapsible bar:

```
┌─────────────────────────────────────┐
│ [Buy/Sell toggle] [Slider] [OFFER] │  ← 64px height
└─────────────────────────────────────┘
```

- Buy/Sell toggle as segmented control
- Slider for quantity (compact version)
- "Make Offer" as prominent primary button
- Footer completely hidden on mobile (move to menu)

### Option 2: Contextual Bottom Sheet

- Show only "Make Offer" CTA sticky at bottom
- Tapping CTA opens bottom sheet with:
  - Buy/Sell toggle
  - Quantity slider
  - Final price
  - Confirm button

### Option 3: Floating Action Pattern

- Hide footer entirely on mobile
- SelectionBar auto-hides on scroll down
- FAB-style "Make Offer" button (circular, elevated)
- SelectionBar reappears on scroll up

### Option 4: Progressive Disclosure

| State | Visible Elements |
|-------|------------------|
| **Browsing** | Only CTA button (compact) |
| **Item Selected** | SelectionBar + CTA |
| **Scroll Down** | Only CTA (sticky) |
| **Scroll Up** | Full bars restored |

---

## Implementation Priority

1. **Immediate:** Hide footer on mobile, move theme toggle to header/menu
2. **Short-term:** Combine SelectionBar + CTA into single bar
3. **Medium-term:** Implement scroll-based hide/show
4. **Long-term:** Consider bottom sheet pattern for complex selections

---

## Key Metrics to Track

- CTA click-through rate (should not decrease)
- Scroll depth (ensure users see content)
- Conversion rate (primary goal)
- Time-to-action (should improve)

---

## Unresolved Questions

1. Does the slider need real-time preview or can it be stepped buttons on mobile?
2. Should the Buy/Sell toggle persist state across sessions?
3. Is there analytics data showing which footer elements are actually used?
4. What is the minimum viable item count display (badge vs number)?

---

## Sources

- [Bottom navigation bar in mobile apps: The complete 2025 guide](https://blog.appmysite.com/bottom-navigation-bar-in-mobile-apps-heres-all-you-need-to-know/)
- [10 modern footer UX patterns for 2025](https://www.eleken.co/blog-posts/footer-ux)
- [Mobile vs Desktop Design: Complete Analysis](https://www.newform.community/post/mobile-vs-desktop-design-complete-analysis)
- [OpenSea Mobile App UX/UI Design](https://aafereen.design/opensea)
- [Blur NFT Marketplace Development](https://www.clarisco.com/blur-nft-marketplace-development)
- [CTA Button Design Best Practices](https://www.unifiedinfotech.net/blog/top-5-cta-button-design-that-increase-conversions/)
