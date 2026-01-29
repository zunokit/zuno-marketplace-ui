import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/tailwind-utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[6px] border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-150 overflow-hidden font-sans",
  {
    variants: {
      variant: {
        // Default badge (frosted glass)
        default: "bg-frosted-2 text-os-gray-300 border-border-subtle",

        // Secondary (same as default for OpenSea)
        secondary: "bg-frosted-2 text-os-gray-300 border-border-subtle",

        // Success/Verified badge
        success: "bg-success-bg-medium text-os-success border-success-border",

        // Destructive/Error badge
        destructive: "bg-error-bg-medium text-os-error border-error-border",

        // Info badge
        info: "bg-info-bg-light text-os-info border-info-border",

        // Warning badge
        warning: "bg-warning-bg-medium text-os-warning border-warning-border",

        // NFT Rarity: Legendary
        legendary: "bg-legendary-bg text-os-legendary border-legendary-border font-medium",

        // NFT Rarity: Epic
        epic: "bg-epic-bg text-os-epic border-epic-border font-medium",

        // NFT Rarity: Rare
        rare: "bg-rare-bg text-os-rare border-rare-border font-medium",

        // Outline (subtle border only)
        outline: "text-os-gray-300 border-border-subtle bg-transparent [a&]:hover:bg-frosted-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
