"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/shared/utils/tailwind-utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base styles with frosted glass effect
        "peer size-5 shrink-0 rounded-[6px] border border-border-subtle bg-frosted-1",
        "backdrop-blur-sm transition-all duration-200 ease-out",
        "hover:border-border-medium hover:bg-frosted-2",
        // Focus styles with glow
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-info/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Checked state with glow
        "data-[state=checked]:border-os-success data-[state=checked]:bg-os-success/20",
        "data-[state=checked]:shadow-[0_0_12px_rgba(71,187,100,0.3)]",
        "data-[state=checked]:hover:bg-os-success/30",
        // Indeterminate state
        "data-[state=indeterminate]:border-os-info data-[state=indeterminate]:bg-os-info/20",
        "data-[state=indeterminate]:shadow-[0_0_12px_rgba(131,195,255,0.3)]",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-subtle disabled:hover:bg-frosted-1",
        "disabled:data-[state=checked]:shadow-none disabled:data-[state=indeterminate]:shadow-none",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "flex items-center justify-center text-current",
          "transition-all duration-200 ease-out",
          "data-[state=checked]:text-os-success",
          "data-[state=indeterminate]:text-os-info"
        )}
      >
        {/* Check icon with scale animation */}
        <CheckIcon
          className={cn(
            "size-3.5 transition-transform duration-200",
            "scale-0 data-[state=checked]:scale-100"
          )}
          strokeWidth={3}
        />
        {/* Minus icon for indeterminate state */}
        <MinusIcon
          className={cn(
            "size-3.5 absolute transition-transform duration-200",
            "scale-0 data-[state=indeterminate]:scale-100"
          )}
          strokeWidth={3}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
