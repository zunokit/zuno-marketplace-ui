"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/shared/utils/tailwind-utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full transition-all duration-200",
  {
    variants: {
      size: {
        xs: "size-6",
        sm: "size-8",
        default: "size-10",
        lg: "size-12",
        xl: "size-16",
        "2xl": "size-20",
      },
      variant: {
        default: "",
        ring: "ring-2 ring-primary ring-offset-2 ring-offset-background",
        glow: "ring-2 ring-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]",
        bordered: "ring-2 ring-border-subtle",
        frosted: "ring-1 ring-white/20 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
    },
  }
);

const avatarFallbackVariants = cva(
  "flex size-full items-center justify-center rounded-full font-medium",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        frosted: "bg-frosted-1/80 backdrop-blur-sm text-white border border-white/10",
        gradient: "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

function Avatar({ className, size, variant, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, variant }), className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

interface AvatarFallbackProps
  extends React.ComponentProps<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

function AvatarFallback({
  className,
  variant,
  ...props
}: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants, avatarFallbackVariants };
