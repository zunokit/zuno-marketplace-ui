"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/shared/utils/tailwind-utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        gradient: "bg-primary/20",
        success: "bg-os-success/20",
        glow: "bg-primary/20",
        info: "bg-os-info/20",
        warning: "bg-os-warning/20",
        destructive: "bg-destructive/20",
        shimmer: "bg-primary/20",
      },
      size: {
        sm: "h-1.5",
        default: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary",
        gradient:
          "bg-gradient-to-r from-primary via-primary/80 to-primary drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.6)]",
        success:
          "bg-os-success drop-shadow-[0_0_10px_rgba(71,187,100,0.6)]",
        glow: "bg-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.7)]",
        info: "bg-os-info drop-shadow-[0_0_10px_rgba(88,157,255,0.6)]",
        warning: "bg-os-warning drop-shadow-[0_0_10px_rgba(255,171,43,0.6)]",
        destructive: "bg-destructive drop-shadow-[0_0_10px_rgba(var(--destructive-rgb),0.6)]",
        shimmer:
          "bg-gradient-to-r from-primary via-primary/70 to-primary bg-[length:200%_100%] animate-[shimmer_2s_infinite_linear]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressIndicatorVariants> {}

function Progress({
  className,
  value,
  variant,
  size,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ variant, size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(progressIndicatorVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress, progressVariants, progressIndicatorVariants };
