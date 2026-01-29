import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/tailwind-utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none font-sans",
  {
    variants: {
      variant: {
        // OpenSea primary button (highlighted actions)
        default:
          "bg-primary text-primary-foreground border border-border-medium hover:bg-primary/90 hover:border-border-strong shadow-os-inset font-medium rounded-[6px]",

        // OpenSea secondary button (most common)
        secondary:
          "bg-secondary text-secondary-foreground border border-border-subtle hover:bg-hover-bg hover:border-border-medium shadow-os-inset rounded-[6px]",

        // Destructive/Error button
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive hover:bg-destructive/90 rounded-[6px]",

        // Success button
        success:
          "bg-success text-success-foreground border border-success hover:bg-success/90 rounded-[6px]",

        // Outline button (frosted glass)
        outline:
          "bg-card border border-border-subtle text-foreground hover:bg-accent hover:border-border-strong backdrop-blur-xl rounded-[6px]",

        // Ghost button (no background)
        ghost: "text-muted-foreground hover:bg-hover-bg hover:text-foreground rounded-[6px]",

        // Link-style button
        link: "text-info underline-offset-4 hover:underline hover:opacity-80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
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
