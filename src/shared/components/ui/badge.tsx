import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/tailwind-utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[6px] border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden font-sans",
  {
    variants: {
      variant: {
        // Default badge (frosted glass)
        default: "bg-frosted-2 text-os-gray-300 border-border-subtle hover:bg-frosted-1 hover:border-border-medium",

        // Secondary (same as default for OpenSea)
        secondary: "bg-frosted-2 text-os-gray-300 border-border-subtle hover:bg-frosted-1 hover:border-border-medium",

        // Success/Verified badge
        success: "bg-success-bg-medium text-os-success border-success-border hover:bg-success-bg hover:shadow-[0_0_12px_rgba(var(--success-rgb),0.3)]",

        // Destructive/Error badge
        destructive: "bg-error-bg-medium text-os-error border-error-border hover:bg-error-bg hover:shadow-[0_0_12px_rgba(var(--error-rgb),0.3)]",

        // Info badge
        info: "bg-info-bg-light text-os-info border-info-border hover:bg-info-bg hover:shadow-[0_0_12px_rgba(var(--info-rgb),0.3)]",

        // Warning badge
        warning: "bg-warning-bg-medium text-os-warning border-warning-border hover:bg-warning-bg hover:shadow-[0_0_12px_rgba(var(--warning-rgb),0.3)]",

        // NFT Rarity: Legendary
        legendary: "bg-legendary-bg text-os-legendary border-legendary-border font-medium hover:shadow-[0_0_16px_rgba(var(--legendary-rgb),0.4)]",

        // NFT Rarity: Epic
        epic: "bg-epic-bg text-os-epic border-epic-border font-medium hover:shadow-[0_0_16px_rgba(var(--epic-rgb),0.4)]",

        // NFT Rarity: Rare
        rare: "bg-rare-bg text-os-rare border-rare-border font-medium hover:shadow-[0_0_16px_rgba(var(--rare-rgb),0.4)]",

        // Outline (subtle border only)
        outline: "text-os-gray-300 border-border-subtle bg-transparent hover:bg-frosted-2 hover:border-border-medium",

        // Frosted glass variant with enhanced blur
        frosted: `
          bg-frosted-2/80
          backdrop-blur-xl
          text-os-gray-100
          border-border-subtle
          shadow-[0_2px_8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.05)_inset]
          hover:bg-frosted-1
          hover:border-border-medium
          hover:shadow-[0_4px_16px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.08)_inset]
          hover:-translate-y-0.5
          active:scale-[0.98]
          active:translate-y-0
        `,

        // Gradient variant
        gradient: `
          bg-gradient-to-r from-primary/90 via-primary to-primary/90
          text-primary-foreground
          border-primary/30
          shadow-[0_2px_8px_rgba(var(--primary-rgb),0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset]
          hover:shadow-[0_4px_16px_rgba(var(--primary-rgb),0.5),0_0_0_1px_rgba(255,255,255,0.15)_inset]
          hover:-translate-y-0.5
          active:scale-[0.98]
          active:translate-y-0
        `,

        // Glow variant for special highlights
        glow: `
          bg-frosted-2
          text-os-info
          border-os-info/30
          shadow-[0_0_12px_rgba(var(--info-rgb),0.3)]
          hover:shadow-[0_0_20px_rgba(var(--info-rgb),0.5)]
          hover:border-os-info/50
          hover:-translate-y-0.5
          active:scale-[0.98]
        `,

        // Subtle variant for minimal UI
        subtle: `
          bg-transparent
          text-os-gray-300
          border-transparent
          hover:bg-frosted-2
          hover:text-os-gray-100
        `,

        // Dot variant with status indicator
        dot: `
          bg-frosted-2
          text-os-gray-300
          border-border-subtle
          pl-1.5
          before:content-['']
          before:w-1.5
          before:h-1.5
          before:rounded-full
          before:bg-current
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
