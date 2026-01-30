"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/shared/utils/tailwind-utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          // Base styles with frosted glass effect
          "z-50 w-fit max-w-xs",
          "bg-frosted-2/95 backdrop-blur-xl",
          "text-os-gray-100 text-xs text-balance",
          "border border-border-subtle",
          "rounded-[8px]",
          "px-3 py-2",
          "shadow-[0_8px_30px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)_inset]",

          // Smooth fade animation with spring physics
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",

          // Slide animations based on side
          "data-[side=bottom]:slide-in-from-top-3",
          "data-[side=left]:slide-in-from-right-3",
          "data-[side=right]:slide-in-from-left-3",
          "data-[side=top]:slide-in-from-bottom-3",

          // Exit slide animations
          "data-[state=closed]:data-[side=bottom]:slide-out-to-top-2",
          "data-[state=closed]:data-[side=left]:slide-out-to-right-2",
          "data-[state=closed]:data-[side=right]:slide-out-to-left-2",
          "data-[state=closed]:data-[side=top]:slide-out-to-bottom-2",

          // Transition timing
          "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",

          // Origin for scale animation
          "origin-(--radix-tooltip-content-transform-origin)",

          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className={cn(
            // Arrow styling to match frosted glass tooltip
            "fill-frosted-2/95",
            "stroke-border-subtle",
            "stroke-[0.5px]",
            "z-50",
            "size-2.5",
            "translate-y-[calc(-50%_-_1px)]",
            "rotate-45",
            "rounded-[1px]",
            "backdrop-blur-xl",
            // Drop shadow for depth
            "drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
          )}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

// Enhanced tooltip with custom styling options
interface EnhancedTooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  variant?: "default" | "info" | "success" | "warning" | "error";
  showArrow?: boolean;
}

function EnhancedTooltipContent({
  className,
  variant = "default",
  showArrow = true,
  sideOffset = 8,
  children,
  ...props
}: EnhancedTooltipContentProps) {
  const variantStyles = {
    default: "bg-frosted-2/95 text-os-gray-100 border-border-subtle",
    info: "bg-info-bg/95 text-os-info border-info-border",
    success: "bg-success-bg/95 text-os-success border-success-border",
    warning: "bg-warning-bg/95 text-os-warning border-warning-border",
    error: "bg-error-bg/95 text-os-error border-error-border",
  };

  const arrowFillStyles = {
    default: "fill-frosted-2/95",
    info: "fill-info-bg/95",
    success: "fill-success-bg/95",
    warning: "fill-warning-bg/95",
    error: "fill-error-bg/95",
  };

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content-enhanced"
        sideOffset={sideOffset}
        className={cn(
          // Base styles
          "z-50 w-fit max-w-xs",
          "backdrop-blur-xl",
          "text-xs text-balance",
          "rounded-[8px]",
          "px-3 py-2",
          "shadow-[0_8px_30px_rgba(0,0,0,0.2)]",

          // Variant styles
          variantStyles[variant],

          // Animations
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-3",
          "data-[side=left]:slide-in-from-right-3",
          "data-[side=right]:slide-in-from-left-3",
          "data-[side=top]:slide-in-from-bottom-3",
          "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "origin-(--radix-tooltip-content-transform-origin)",

          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <TooltipPrimitive.Arrow
            className={cn(
              arrowFillStyles[variant],
              "stroke-border-subtle",
              "stroke-[0.5px]",
              "z-50",
              "size-2.5",
              "translate-y-[calc(-50%_-_1px)]",
              "rotate-45",
              "rounded-[1px]",
              "backdrop-blur-xl",
              "drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            )}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  EnhancedTooltipContent,
};
