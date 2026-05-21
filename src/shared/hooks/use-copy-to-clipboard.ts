"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCopyToClipboardOptions {
  /** How long (ms) the `copied` flag stays true before auto-resetting. */
  resetAfterMs?: number;
}

export interface UseCopyToClipboardReturn {
  /** True between a successful copy and the auto-reset timeout. */
  copied: boolean;
  /** Last error from `navigator.clipboard.writeText`, if any. */
  error: Error | null;
  /** Copy `value` to the clipboard. Returns true on success. */
  copy: (value: string) => Promise<boolean>;
  /** Force-reset the `copied` flag immediately. */
  reset: () => void;
}

/**
 * Wraps `navigator.clipboard.writeText` with a transient `copied` flag so
 * any UI can render "Copy" / "Copied!" states without duplicating the
 * setTimeout dance.
 *
 * Falls back to the legacy `document.execCommand('copy')` path on browsers
 * (or contexts) where `navigator.clipboard` is undefined — notably
 * non-HTTPS test pages and some embedded webviews.
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { resetAfterMs = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCopied(false);
  }, []);

  const copy = useCallback(
    async (value: string): Promise<boolean> => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          // Fallback for environments without the async Clipboard API.
          const textarea = document.createElement("textarea");
          textarea.value = value;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(textarea);
          if (!ok) throw new Error("execCommand('copy') returned false");
        }

        setError(null);
        setCopied(true);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, resetAfterMs);

        return true;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        setCopied(false);
        return false;
      }
    },
    [resetAfterMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { copied, error, copy, reset };
}
