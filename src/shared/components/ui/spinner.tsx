import { Loader2Icon } from "lucide-react";

import { cn } from "@/shared/utils/tailwind-utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva("animate-spin ease-in-out", {
  variants: {
    variant: {
      default: "text-primary",
      glow: "text-primary drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.7)]",
      secondary: "text-muted-foreground",
      success: "text-os-success drop-shadow-[0_0_10px_rgba(71,187,100,0.7)]",
      destructive: "text-destructive drop-shadow-[0_0_10px_rgba(var(--destructive-rgb),0.7)]",
      info: "text-os-info drop-shadow-[0_0_10px_rgba(88,157,255,0.7)]",
      warning: "text-os-warning drop-shadow-[0_0_10px_rgba(255,171,43,0.7)]",
      subtle: "text-os-gray-300/70",
    },
    size: {
      default: "size-4",
      sm: "size-3",
      lg: "size-6",
      xl: "size-10",
      "2xl": "size-14",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface SpinnerProps
  extends React.ComponentProps<"svg">,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, variant, size, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
