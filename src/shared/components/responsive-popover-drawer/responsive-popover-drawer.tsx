"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useIsMobile, MD_BREAKPOINT } from "@/shared/hooks/use-mobile";
import { XIcon } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";

export interface ResponsivePopoverDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Render the trigger. Spread props onto the trigger so it can receive onClick (mobile) or PopoverTrigger merge (desktop). */
  renderTrigger: (props: { onClick?: () => void }) => React.ReactNode;
  children: React.ReactNode;
  /** Title in drawer header on mobile. Optional for popover. */
  title?: React.ReactNode;
  /** Popover: side. Default "top" for bottom-anchored triggers. */
  side?: "top" | "right" | "bottom" | "left";
  /** Popover: align. Default "end". */
  align?: "start" | "center" | "end";
  contentClassName?: string;
  /** Show close button in drawer header on mobile. Default true. */
  showCloseButton?: boolean;
  /** When false, popover does not close on outside click (e.g. selecting NFTs). Default true. */
  closeOnInteractOutside?: boolean;
}

/**
 * Responsive: Popover on desktop (md+), bottom Drawer on mobile (below md / 768px).
 * Use for cart, menus, or lightweight panels anchored to a trigger.
 */
export function ResponsivePopoverDrawer({
  open,
  onOpenChange,
  renderTrigger,
  children,
  title,
  side = "top",
  align = "end",
  contentClassName,
  showCloseButton = true,
  closeOnInteractOutside = true,
}: ResponsivePopoverDrawerProps) {
  const isMobile = useIsMobile(MD_BREAKPOINT);

  if (isMobile) {
    return (
      <>
        {renderTrigger({ onClick: () => onOpenChange(true) })}
        <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
          <DrawerContent
            className={cn(
              "max-h-[90vh] flex flex-col",
              "rounded-t-os-2xl border-t border-border-subtle"
            )}
          >
            <DrawerHeader className="flex flex-row items-start justify-between gap-4 border-b border-border-subtle px-4 py-3">
              <div className="flex flex-col gap-0.5 min-w-0">
                {title != null && (
                  <DrawerTitle className="text-left font-sans">{title}</DrawerTitle>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-os-lg p-1.5 opacity-70 transition hover:opacity-100 hover:bg-hover-bg -mt-0.5 -mr-1 shrink-0"
                  aria-label="Close"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </DrawerHeader>
            <ScrollArea className="flex-1">
              <div className={cn("p-4", contentClassName)}>{children}</div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{renderTrigger({})}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={8}
        className={cn("w-72 p-0", contentClassName)}
        onInteractOutside={!closeOnInteractOutside ? e => e.preventDefault() : undefined}
      >
        {title != null && (
          <div className="border-b border-border-subtle px-4 py-3">
            <h3 className="font-medium font-sans text-sm">{title}</h3>
          </div>
        )}
        <div className="p-4 max-h-[min(60vh,400px)] overflow-y-auto">{children}</div>
      </PopoverContent>
    </Popover>
  );
}
