"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/shared/utils/tailwind-utils";

function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50",
        "bg-gradient-to-b from-black/40 via-black/60 to-black/70",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "transition-all duration-300 ease-out",
        className
      )}
      {...props}
    />
  );
}

function DrawerDragHandle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2",
        "flex items-center justify-center",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:top-3",
        "group-data-[vaul-drawer-direction=top]/drawer-content:bottom-3",
        "group-data-[vaul-drawer-direction=left]/drawer-content:hidden",
        "group-data-[vaul-drawer-direction=right]/drawer-content:hidden",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-white/5 blur-sm" />
        {/* Main handle bar */}
        <div
          className={cn(
            "relative h-1.5 w-10 rounded-full",
            "bg-[#34353c]",
            "ring-1 ring-white/10",
            "transition-all duration-200",
            "group-hover/drawer-content:bg-[#3d3e45]",
            "group-active/drawer-content:scale-95"
          )}
        />
      </div>
    </div>
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          // Base styles
          "group/drawer-content fixed z-50 flex flex-col",
          "bg-[#26272d]/95 backdrop-blur-xl",
          "border-[#34353c]",
          "shadow-2xl shadow-black/40",
          // Animation classes
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          // Bottom direction (default)
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0",
          "data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[85vh]",
          "data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=bottom]:data-[state=closed]:slide-out-to-bottom",
          "data-[vaul-drawer-direction=bottom]:data-[state=open]:slide-in-from-bottom",
          // Top direction
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0",
          "data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[85vh]",
          "data-[vaul-drawer-direction=top]:rounded-b-2xl data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=top]:data-[state=closed]:slide-out-to-top",
          "data-[vaul-drawer-direction=top]:data-[state=open]:slide-in-from-top",
          // Right direction
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0",
          "data-[vaul-drawer-direction=right]:w-[85vw] data-[vaul-drawer-direction=right]:sm:max-w-md",
          "data-[vaul-drawer-direction=right]:border-l",
          "data-[vaul-drawer-direction=right]:data-[state=closed]:slide-out-to-right",
          "data-[vaul-drawer-direction=right]:data-[state=open]:slide-in-from-right",
          // Left direction
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0",
          "data-[vaul-drawer-direction=left]:w-[85vw] data-[vaul-drawer-direction=left]:sm:max-w-md",
          "data-[vaul-drawer-direction=left]:border-r",
          "data-[vaul-drawer-direction=left]:data-[state=closed]:slide-out-to-left",
          "data-[vaul-drawer-direction=left]:data-[state=open]:slide-in-from-left",
          className
        )}
        {...props}
      >
        {/* Drag handle for top/bottom drawers */}
        <DrawerDragHandle />
        {/* Content wrapper with proper spacing */}
        <div className="flex-1 overflow-auto">{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1.5 p-6 pb-4",
        "border-b border-[#34353c]/50",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:pt-10",
        "group-data-[vaul-drawer-direction=top]/drawer-content:pb-10",
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col gap-3 p-6 pt-4",
        "border-t border-[#34353c]/50",
        className
      )}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "text-[#fcfcfc] text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-[#acadae] text-sm leading-relaxed", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
