"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";
import { cn } from "@/shared/utils/tailwind-utils";

type BaseButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export interface CopyButtonProps
  extends Omit<BaseButtonProps, "onClick" | "children"> {
  /** The string copied to the clipboard. */
  value: string;
  /**
   * Optional label rendered alongside the icon. Omit for an icon-only button
   * (which is the typical use case for "copy address" / "copy contract").
   */
  label?: string;
  /** Optional override for the tooltip text in the resting state. */
  tooltipLabel?: string;
  /** Optional override for the tooltip text after a successful copy. */
  tooltipCopiedLabel?: string;
  /** Toast title shown via sonner on success. Pass `null` to disable. */
  toastMessage?: string | null;
}

/**
 * Drop-in clipboard button. Renders an icon-only `Button` by default and
 * swaps between a `Copy` and `Check` icon for ~2s after each successful
 * copy. Surfaces a `sonner` toast and an accessible tooltip out of the
 * box.
 *
 * Use this anywhere we have to copy a wallet address, a contract address,
 * an event id, or a shareable URL. Replaces the ad-hoc
 * `navigator.clipboard.writeText` + setTimeout pattern that lived in
 * profile-header, marketplace-collection-hero, collection-info-panel, etc.
 */
export function CopyButton({
  value,
  label,
  tooltipLabel = "Copy",
  tooltipCopiedLabel = "Copied!",
  toastMessage = "Copied to clipboard",
  variant = "ghost",
  size = label ? "sm" : "icon",
  className,
  disabled,
  ...buttonProps
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  const handleClick = async () => {
    const ok = await copy(value);
    if (ok && toastMessage) {
      toast.success(toastMessage);
    } else if (!ok) {
      toast.error("Couldn't copy to clipboard");
    }
  };

  const button = (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || !value}
      aria-label={label ? undefined : copied ? tooltipCopiedLabel : tooltipLabel}
      aria-live="polite"
      className={cn("gap-2", className)}
      {...buttonProps}
    >
      {copied ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      {label ? <span>{copied ? tooltipCopiedLabel : label}</span> : null}
    </Button>
  );

  if (label) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{copied ? tooltipCopiedLabel : tooltipLabel}</TooltipContent>
    </Tooltip>
  );
}
