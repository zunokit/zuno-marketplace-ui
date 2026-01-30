"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/shared/utils/tailwind-utils";

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "sm" | "default" | "lg";
}

function Switch({ className, size = "default", ...props }: SwitchProps) {
  // Size configurations
  const sizeClasses = {
    sm: {
      root: "h-5 w-9",
      thumb: "size-3.5 data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-0.5",
    },
    default: {
      root: "h-6 w-11",
      thumb: "size-4 data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0.5",
    },
    lg: {
      root: "h-7 w-[52px]",
      thumb: "size-5 data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5",
    },
  };

  const { root: rootSize, thumb: thumbSize } = sizeClasses[size];

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // Base styles with frosted glass effect
        "peer inline-flex shrink-0 items-center rounded-full border border-border-subtle",
        "bg-frosted-1 backdrop-blur-sm",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:border-border-medium",
        // Focus styles with glow
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-info/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Checked state with glow effect
        "data-[state=checked]:border-os-success data-[state=checked]:bg-os-success/30",
        "data-[state=checked]:shadow-[0_0_16px_rgba(71,187,100,0.4)]",
        "data-[state=checked]:hover:bg-os-success/40",
        // Unchecked state
        "data-[state=unchecked]:bg-frosted-1",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-subtle",
        "disabled:data-[state=checked]:shadow-none",
        rootSize,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Base thumb styles
          "pointer-events-none block rounded-full",
          "bg-os-gray-300 shadow-sm",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          // Checked state - white thumb with glow
          "data-[state=checked]:bg-white data-[state=checked]:shadow-[0_0_8px_rgba(255,255,255,0.5)]",
          // Disabled state
          "disabled:data-[state=checked]:shadow-none",
          thumbSize
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
export type { SwitchProps };
