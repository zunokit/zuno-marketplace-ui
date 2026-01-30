import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/tailwind-utils";

const alertVariants = cva(
  "relative w-full rounded-[8px] border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border-subtle",
        destructive:
          "text-destructive bg-destructive/10 border-destructive/30 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90 shadow-[0_0_15px_rgba(var(--destructive-rgb),0.15)]",
        success:
          "bg-os-success/10 border-os-success/30 text-os-success [&>svg]:text-os-success *:data-[slot=alert-description]:text-os-success/90 shadow-[0_0_15px_rgba(71,187,100,0.15)]",
        warning:
          "bg-os-warning/10 border-os-warning/30 text-os-warning [&>svg]:text-os-warning *:data-[slot=alert-description]:text-os-warning/90 shadow-[0_0_15px_rgba(255,171,43,0.15)]",
        info:
          "bg-os-info/10 border-os-info/30 text-os-info [&>svg]:text-os-info *:data-[slot=alert-description]:text-os-info/90 shadow-[0_0_15px_rgba(88,157,255,0.15)]",
        frosted:
          "bg-frosted-1/80 border-white/10 text-foreground shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-os-gray-300 col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
