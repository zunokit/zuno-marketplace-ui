import * as React from "react";

import { cn } from "@/shared/utils/tailwind-utils";

// Card variant types
type CardVariant = "default" | "frosted" | "gradient";

// Card props interface
interface CardProps extends React.ComponentProps<"div"> {
  variant?: CardVariant;
  hoverable?: boolean;
}

// Card component with OpenSea design improvements
function Card({ className, variant = "default", hoverable = true, ...props }: CardProps) {
  // Base classes for all variants
  const baseClasses =
    "relative flex flex-col gap-6 text-card-foreground rounded-[8px] transition-all duration-300 ease-out";

  // Variant-specific classes
  const variantClasses = {
    default: "bg-card border border-border-subtle py-6 shadow-os-inset",
    frosted:
      "bg-card/80 backdrop-blur-xl border border-border-subtle/50 py-6 shadow-lg shadow-black/5",
    gradient:
      "bg-card p-[1px] before:absolute before:inset-0 before:rounded-[8px] before:bg-gradient-to-br before:from-blue-500/30 before:via-purple-500/20 before:to-pink-500/30 before:p-[1px] before:-z-10",
  };

  // Hover effect classes
  const hoverClasses = hoverable
    ? {
        default: "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 hover:border-border-medium",
        frosted: "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:bg-card/90",
        gradient: "hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 hover:before:from-blue-500/50 hover:before:via-purple-500/40 hover:before:to-pink-500/50",
      }
    : {
        default: "",
        frosted: "",
        gradient: "",
      };

  // Inner content wrapper for gradient variant
  const contentClasses = variant === "gradient" ? "bg-card rounded-[7px] py-6 flex flex-col gap-6 h-full" : "";

  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(baseClasses, variantClasses[variant], hoverClasses[variant], className)}
      {...props}
    >
      {variant === "gradient" ? <div className={contentClasses}>{props.children}</div> : props.children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-medium font-sans", className)} // OpenSea uses medium weight
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-os-gray-300 text-sm font-sans", className)} // OpenSea gray text
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-between gap-4 px-6 [.border-t]:pt-6",
        className
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
export type { CardProps, CardVariant };
