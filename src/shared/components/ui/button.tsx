import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/tailwind-utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none font-sans transition-all duration-150 ease-out",
  {
    variants: {
      variant: {
        // OpenSea primary button (highlighted actions) with glow effect
        default:
          "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground border border-primary/50 rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.1)_inset] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4),0_0_0_1px_rgba(255,255,255,0.15)_inset] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

        // OpenSea secondary button (most common) with frosted glass
        secondary:
          "bg-secondary/80 backdrop-blur-md text-secondary-foreground border border-border-subtle rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-secondary hover:border-border-medium hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

        // Destructive/Error button with glow
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive/50 rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(var(--destructive-rgb),0.4)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-destructive/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

        // Success button with glow
        success:
          "bg-success text-success-foreground border border-success/50 rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(var(--success-rgb),0.4)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-success/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

        // Outline button (frosted glass) with enhanced hover
        outline:
          "bg-card/50 backdrop-blur-xl text-foreground border border-border-subtle rounded-[6px] hover:bg-accent/80 hover:border-border-strong hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.05)_inset] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

        // Ghost button (no background) with subtle hover
        ghost: "text-muted-foreground rounded-[6px] hover:bg-hover-bg/80 hover:text-foreground active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-muted/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",

        // Link-style button
        link: "text-info underline-offset-4 hover:underline hover:opacity-80 focus-visible:ring-2 focus-visible:ring-info/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 px-6 has-[>svg]:px-4 text-base",
        icon: "size-9 rounded-full p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
