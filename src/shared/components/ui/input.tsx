import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/tailwind-utils";

/**
 * Input variants for different visual states
 * Includes frosted glass effect, focus glow, and error/success states
 */
const inputVariants = cva(
  [
    // Base layout
    "flex h-10 w-full min-w-0 rounded-[8px] border px-3 py-2 text-sm text-foreground font-sans",
    "outline-none",

    // Frosted glass effect
    "bg-white/5 backdrop-blur-sm",

    // Border styling
    "border-border-subtle",

    // Placeholder
    "placeholder:text-os-gray-300",

    // Smooth transitions (300ms)
    "transition-all duration-300 ease-out",

    // Hover state
    "hover:border-border-medium hover:bg-white/[0.07]",

    // Focus state with animated glow
    "focus:border-border-strong",
    "focus:bg-white/[0.08]",
    "focus:shadow-[0_0_20px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.1)]",

    // Disabled state
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

    // File input styling
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",

    // Selection styling
    "selection:bg-frosted-6 selection:text-foreground",
  ],
  {
    variants: {
      state: {
        default: "",
        error: [
          "border-destructive/50 bg-error-bg-light",
          "hover:border-destructive/70 hover:bg-error-bg-medium",
          "focus:border-destructive focus:shadow-[0_0_20px_rgba(226,71,86,0.15),0_0_0_1px_rgba(226,71,86,0.3)]",
        ],
        success: [
          "border-success/50 bg-success-bg-light",
          "hover:border-success/70 hover:bg-success-bg-medium",
          "focus:border-success focus:shadow-[0_0_20px_rgba(71,187,100,0.15),0_0_0_1px_rgba(71,187,100,0.3)]",
        ],
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

/**
 * Props for the Input component
 * Extends HTML input props with variant props for state styling
 */
interface InputProps
  extends Omit<React.ComponentProps<"input">, "state">,
    VariantProps<typeof inputVariants> {}

/**
 * Enhanced Input component with frosted glass effect,
 * animated focus glow, and improved error/success states
 */
function Input({ className, type, state, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-state={state}
      className={cn(inputVariants({ state }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
export type { InputProps };
