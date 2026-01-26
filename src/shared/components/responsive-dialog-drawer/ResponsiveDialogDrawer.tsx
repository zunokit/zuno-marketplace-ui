"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useIsMobile, MD_BREAKPOINT } from "@/shared/hooks/use-mobile";
import { XIcon } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";

export interface ResponsiveDialogDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  /** Show close button in header. Default true. */
  showCloseButton?: boolean;
}

/**
 * Responsive modal: Dialog on desktop (md+), bottom Drawer on mobile (below md / 768px).
 * Use for forms, details, and purchase flows that benefit from a drawer on small screens.
 */
export function ResponsiveDialogDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  contentClassName,
  showCloseButton = true,
}: ResponsiveDialogDrawerProps) {
  const isMobile = useIsMobile(MD_BREAKPOINT);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
        <DrawerContent
          className={cn(
            "max-h-[90vh] flex flex-col",
            "rounded-t-os-2xl border-t border-border-subtle"
          )}
        >
          <DrawerHeader className="flex flex-row items-start justify-between gap-4 border-b border-border-subtle px-4 py-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <DrawerTitle className="text-left font-sans">{title}</DrawerTitle>
              {description != null && (
                <DrawerDescription className="text-left">{description}</DrawerDescription>
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
          <ScrollArea className="flex-1 px-4 py-4">
            <div className={cn("grid gap-4 pb-4", contentClassName)}>{children}</div>
          </ScrollArea>
          {footer != null && (
            <DrawerFooter className="border-t border-border-subtle px-4 py-3">
              {footer}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[600px]", contentClassName)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description != null && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4">{children}</div>
        {footer != null && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
