# NFT Drawer Component Redesign - OpenSea Design System

## Overview

Complete redesign of the shadcn drawer component for NFT marketplace with glassmorphism effects, spring animations, and proper dark theme integration.

---

## Design Specifications

### 1. Frosted Glass Backdrop

```typescript
// Overlay with glassmorphism effect
const drawerOverlayStyles = `
  fixed inset-0 z-50
  bg-[#101010]/80                    // Dark base with opacity
  backdrop-blur-[20px]               // Heavy blur for depth
  -webkit-backdrop-blur-[20px]       // Safari support
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0
  data-[state=open]:fade-in-0
`;
```

**CSS Custom Properties:**
```css
--drawer-overlay-bg: rgba(16, 16, 16, 0.8);
--drawer-backdrop-blur: 20px;
--drawer-overlay-transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
```

---

### 2. Drawer Content - Glassmorphism Panel

```typescript
const drawerContentStyles = `
  fixed z-50 flex flex-col
  bg-[#26272d]/95                    // OpenSea dark background
  backdrop-blur-[32px]               // Heavy glass effect
  -webkit-backdrop-filter: blur(32px)
  border border-white/[0.08]         // Subtle border
  shadow-[0_-8px_40px_rgba(0,0,0,0.4)] // Elevation shadow
`;

// Direction-specific styles
const bottomDrawerStyles = `
  inset-x-0 bottom-0
  mt-24 max-h-[85vh]
  rounded-t-[24px]                   // Large top radius
  border-t border-white/[0.08]
`;

const rightDrawerStyles = `
  inset-y-0 right-0
  w-full sm:max-w-[420px]            // Responsive width
  border-l border-white/[0.08]
  rounded-l-[16px]                   // Left radius
`;

const leftDrawerStyles = `
  inset-y-0 left-0
  w-full sm:max-w-[320px]
  border-r border-white/[0.08]
  rounded-r-[16px]
`;
```

---

### 3. Enhanced Drag Handle

```typescript
const dragHandleStyles = `
  mx-auto mt-4 mb-2
  w-[48px] h-[5px]                   // Compact size
  rounded-full
  bg-white/20                        // Subtle white
  transition-all duration-200
  hover:bg-white/30                  // Hover feedback
  active:bg-white/40                 // Active feedback
  cursor-grab active:cursor-grabbing
`;

// Container for handle
const dragHandleContainerStyles = `
  flex flex-col items-center
  pt-4 pb-2
  cursor-grab active:cursor-grabbing
  touch-none                         // Prevent text selection
`;
```

---

### 4. Spring-Based Animations

```typescript
// Framer Motion configuration
const drawerAnimations = {
  // Bottom drawer spring
  bottom: {
    initial: { y: "100%" },
    animate: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    exit: {
      y: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 35
      }
    }
  },

  // Side drawer spring
  side: {
    initial: { x: "100%" },
    animate: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 28,
        mass: 0.9
      }
    },
    exit: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 450,
        damping: 38
      }
    }
  },

  // Overlay fade
  overlay: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 }
    }
  }
};
```

**CSS Keyframe Alternative:**
```css
@keyframes drawer-slide-up {
  from {
    transform: translateY(100%);
    opacity: 0.8;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes drawer-slide-right {
  from {
    transform: translateX(-100%);
    opacity: 0.8;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.drawer-animate-in {
  animation: drawer-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-animate-out {
  animation: drawer-slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}
```

---

### 5. Dark Theme Color System

```typescript
const drawerColors = {
  // Backgrounds
  background: {
    primary: "#26272d",      // Main drawer bg
    secondary: "#34353c",    // Nested sections
    tertiary: "#101010",     // Deepest layer
  },

  // Frosted glass layers
  frosted: {
    1: "rgba(255, 255, 255, 0.04)",   // Subtle
    2: "rgba(255, 255, 255, 0.08)",   // Light
    3: "rgba(255, 255, 255, 0.12)",   // Medium
    4: "rgba(255, 255, 255, 0.16)",   // Strong
    6: "rgba(255, 255, 255, 0.32)",   // Heavy
  },

  // Text colors
  text: {
    primary: "#ffffff",
    secondary: "#acadae",    // OpenSea gray-300
    muted: "rgba(255, 255, 255, 0.5)",
  },

  // Borders
  border: {
    subtle: "rgba(255, 255, 255, 0.08)",
    medium: "rgba(255, 255, 255, 0.12)",
    strong: "rgba(255, 255, 255, 0.16)",
  }
};
```

---

### 6. Typography & Spacing

```typescript
const drawerTypography = {
  // Header title
  title: `
    text-[17px]                        // OpenSea size
    font-semibold
    text-white
    tracking-[-0.01em]
    leading-[1.4]
  `,

  // Description
  description: `
    text-[14px]
    text-[#acadae]
    leading-[1.5]
    font-normal
  `,

  // Section labels
  sectionLabel: `
    text-[12px]
    font-medium
    uppercase
    tracking-[0.05em]
    text-[#acadae]
  `,

  // Body text
  body: `
    text-[14px]
    text-white/90
    leading-[1.6]
  `
};

const drawerSpacing = {
  header: "px-6 pt-6 pb-4",        // 24px sides, 24px top, 16px bottom
  body: "px-6 py-4",               // 24px sides, 16px vertical
  footer: "px-6 pt-4 pb-8",        // 24px sides, 16px top, 32px bottom
  sectionGap: "gap-6",             // 24px between sections
  itemGap: "gap-3",                // 12px between items
};
```

---

### 7. Shadow & Elevation System

```typescript
const drawerShadows = {
  // Bottom drawer - upward shadow
  bottom: `
    shadow-[0_-8px_40px_rgba(0,0,0,0.4)]
    shadow-[0_-4px_20px_rgba(0,0,0,0.3)]
  `,

  // Side drawer - directional shadow
  side: `
    shadow-[-8px_0_40px_rgba(0,0,0,0.4)]
    shadow-[-4px_0_20px_rgba(0,0,0,0.3)]
  `,

  // Inner glow for premium feel
  innerGlow: `
    shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
  `,

  // Focus ring
  focusRing: `
    focus:ring-2
    focus:ring-white/20
    focus:ring-offset-0
  `
};
```

---

### 8. Interactive States

```typescript
const drawerInteractiveStates = {
  // Hover states
  hover: {
    background: "hover:bg-white/[0.04]",
    border: "hover:border-white/[0.12]",
    text: "hover:text-white",
  },

  // Active/pressed states
  active: {
    background: "active:bg-white/[0.08]",
    scale: "active:scale-[0.98]",
  },

  // Focus states
  focus: {
    ring: "focus:outline-none focus:ring-2 focus:ring-white/20",
    border: "focus:border-white/[0.16]",
  },

  // Disabled states
  disabled: {
    opacity: "disabled:opacity-40",
    cursor: "disabled:cursor-not-allowed",
  }
};
```

---

## Complete Implementation

### Enhanced Drawer Component

```typescript
// src/shared/components/ui/drawer-enhanced.tsx
"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils/tailwind-utils";

// ============================================
// SPRING ANIMATION CONFIGS
// ============================================
const springConfigs = {
  bottom: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  side: {
    type: "spring" as const,
    stiffness: 350,
    damping: 28,
    mass: 0.9,
  },
  exit: {
    type: "spring" as const,
    stiffness: 400,
    damping: 35,
  },
};

// ============================================
// ENHANCED OVERLAY
// ============================================
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50",
        "bg-[#101010]/80 backdrop-blur-[20px]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// ENHANCED DRAG HANDLE
// ============================================
function DrawerHandle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center pt-4 pb-2",
        "cursor-grab active:cursor-grabbing touch-none",
        className
      )}
    >
      <div
        className={cn(
          "w-[48px] h-[5px] rounded-full",
          "bg-white/20",
          "transition-all duration-200",
          "hover:bg-white/30 active:bg-white/40"
        )}
      />
    </div>
  );
}

// ============================================
// ENHANCED CONTENT
// ============================================
function DrawerContent({
  className,
  children,
  showHandle = true,
  direction = "bottom",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showHandle?: boolean;
  direction?: "bottom" | "top" | "right" | "left";
}) {
  const directionStyles = {
    bottom: cn(
      "inset-x-0 bottom-0 mt-24 max-h-[85vh]",
      "rounded-t-[24px]",
      "border-t border-white/[0.08]",
      "shadow-[0_-8px_40px_rgba(0,0,0,0.4)]"
    ),
    top: cn(
      "inset-x-0 top-0 mb-24 max-h-[80vh]",
      "rounded-b-[24px]",
      "border-b border-white/[0.08]",
      "shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
    ),
    right: cn(
      "inset-y-0 right-0 w-full sm:max-w-[420px]",
      "rounded-l-[16px]",
      "border-l border-white/[0.08]",
      "shadow-[-8px_0_40px_rgba(0,0,0,0.4)]"
    ),
    left: cn(
      "inset-y-0 left-0 w-full sm:max-w-[320px]",
      "rounded-r-[16px]",
      "border-r border-white/[0.08]",
      "shadow-[8px_0_40px_rgba(0,0,0,0.4)]"
    ),
  };

  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        data-vaul-drawer-direction={direction}
        className={cn(
          "fixed z-50 flex flex-col",
          "bg-[#26272d]/95 backdrop-blur-[32px]",
          "outline-none",
          directionStyles[direction],
          className
        )}
        {...props}
      >
        {showHandle && direction === "bottom" && <DrawerHandle />}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

// ============================================
// ENHANCED HEADER
// ============================================
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1.5",
        "px-6 pt-6 pb-4",
        "text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// ENHANCED FOOTER
// ============================================
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col gap-3",
        "px-6 pt-4 pb-8",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// ENHANCED TITLE
// ============================================
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "text-[17px] font-semibold text-white",
        "tracking-[-0.01em] leading-[1.4]",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// ENHANCED DESCRIPTION
// ============================================
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        "text-[14px] text-[#acadae]",
        "leading-[1.5] font-normal",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// DRAWER BODY (NEW)
// ============================================
function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn(
        "flex-1 overflow-auto",
        "px-6 py-4",
        "scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
        className
      )}
      {...props}
    />
  );
}

// ============================================
// EXPORTS
// ============================================
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerHandle,
};
```

---

## Usage Examples

### NFT Purchase Drawer

```typescript
<Drawer open={isOpen} onOpenChange={setIsOpen}>
  <DrawerTrigger asChild>
    <Button>Buy NFT</Button>
  </DrawerTrigger>

  <DrawerContent direction="bottom" className="max-h-[90vh]">
    <DrawerHeader>
      <DrawerTitle>Complete Purchase</DrawerTitle>
      <DrawerDescription>
        Review the details before confirming your purchase
      </DrawerDescription>
    </DrawerHeader>

    <DrawerBody className="space-y-6">
      {/* NFT Preview Card */}
      <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.08]">
        <img src={nft.image} className="rounded-lg w-full aspect-square" />
        <div className="mt-3 flex justify-between items-center">
          <span className="text-white font-medium">{nft.name}</span>
          <span className="text-[#acadae]">{nft.price} ETH</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-[14px]">
          <span className="text-[#acadae]">Item Price</span>
          <span className="text-white">{nft.price} ETH</span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="text-[#acadae]">Platform Fee (2.5%)</span>
          <span className="text-white">{fee} ETH</span>
        </div>
        <div className="h-px bg-white/[0.08]" />
        <div className="flex justify-between text-[15px] font-semibold">
          <span className="text-white">Total</span>
          <span className="text-white">{total} ETH</span>
        </div>
      </div>
    </DrawerBody>

    <DrawerFooter>
      <Button className="w-full h-12 bg-white text-[#26272d] hover:bg-white/90 font-semibold rounded-xl">
        Confirm Purchase
      </Button>
      <Button variant="outline" className="w-full h-12 border-white/[0.12] hover:bg-white/[0.04]">
        Cancel
      </Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Wallet Sidebar Drawer

```typescript
<Drawer open={isOpen} onOpenChange={setIsOpen}>
  <DrawerContent direction="right" showHandle={false}>
    <DrawerHeader className="border-b border-white/[0.08]">
      <div className="flex items-center justify-between">
        <DrawerTitle>My Wallet</DrawerTitle>
        <DrawerClose className="p-2 rounded-lg hover:bg-white/[0.04]">
          <X className="w-5 h-5 text-[#acadae]" />
        </DrawerClose>
      </div>
    </DrawerHeader>

    <DrawerBody className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#34353c] to-[#26272d] rounded-2xl p-5 border border-white/[0.08]">
        <span className="text-[12px] uppercase tracking-wider text-[#acadae]">
          Total Balance
        </span>
        <div className="mt-2 text-3xl font-bold text-white">
          {balance} ETH
        </div>
        <div className="mt-1 text-[14px] text-[#acadae]">
          ${usdValue} USD
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
          >
            <action.icon className="w-6 h-6 text-white" />
            <span className="text-[12px] text-[#acadae]">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-[12px] uppercase tracking-wider text-[#acadae] mb-3">
          Recent Activity
        </h4>
        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.08] flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-[#acadae]" />
                </div>
                <div>
                  <p className="text-[14px] text-white">{activity.title}</p>
                  <p className="text-[12px] text-[#acadae]">{activity.time}</p>
                </div>
              </div>
              <span className="text-[14px] font-medium text-white">
                {activity.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DrawerBody>
  </DrawerContent>
</Drawer>
```

---

## CSS Variables (Add to globals.css)

```css
:root {
  /* Drawer-specific variables */
  --drawer-bg: #26272d;
  --drawer-bg-transparent: rgba(38, 39, 45, 0.95);
  --drawer-backdrop: rgba(16, 16, 16, 0.8);
  --drawer-border: rgba(255, 255, 255, 0.08);
  --drawer-handle: rgba(255, 255, 255, 0.2);
  --drawer-handle-hover: rgba(255, 255, 255, 0.3);

  /* Animation timing */
  --drawer-transition-enter: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  --drawer-transition-exit: 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  /* Shadows */
  --drawer-shadow-bottom: 0 -8px 40px rgba(0, 0, 0, 0.4);
  --drawer-shadow-side: -8px 0 40px rgba(0, 0, 0, 0.4);

  /* Blur values */
  --drawer-blur-content: 32px;
  --drawer-blur-overlay: 20px;
}
```

---

## Accessibility Considerations

1. **Focus Management**: Trap focus within drawer when open
2. **Keyboard Navigation**: ESC to close, Tab to navigate
3. **Screen Readers**: Proper ARIA labels and descriptions
4. **Reduced Motion**: Respect `prefers-reduced-motion`
5. **Touch Gestures**: Swipe to dismiss on mobile

```typescript
// Reduced motion support
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animationConfig = prefersReducedMotion
  ? { duration: 0 }
  : springConfigs.bottom;
```

---

## Browser Support

- **Chrome/Edge**: Full support (backdrop-filter)
- **Firefox**: Full support (backdrop-filter)
- **Safari**: Full support (-webkit-backdrop-filter)
- **Mobile**: iOS Safari, Chrome Mobile supported

---

## Files Modified

1. `/src/shared/components/ui/drawer-enhanced.tsx` - New enhanced drawer component
2. `/src/app/globals.css` - Add drawer CSS variables

---

## Unresolved Questions

None. Design specifications complete.