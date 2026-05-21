"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a debounced copy of `value`. The returned value only
 * changes after `delayMs` have passed without further updates to the
 * input value.
 *
 * Typical use:
 *
 *   const [query, setQuery] = useState("");
 *   const debouncedQuery = useDebounce(query, 300);
 *
 *   useEffect(() => {
 *     // runs at most once per 300ms of typing
 *     searchApi(debouncedQuery);
 *   }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (delayMs <= 0) {
      setDebouncedValue(value);
      return;
    }

    const id = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(id);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Returns a debounced version of `callback`. The returned function
 * keeps the same identity across renders (so it can be safely passed
 * to children) but only fires the underlying callback after `delayMs`
 * have passed without further calls.
 *
 * The hook also exposes a `cancel` helper to drop any pending call,
 * which is useful for "submit immediately" buttons that should
 * preempt the debounce.
 *
 * Typical use:
 *
 *   const onSearch = useCallback((q: string) => { ... }, []);
 *   const debouncedSearch = useDebouncedCallback(onSearch, 300);
 *
 *   <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export interface DebouncedCallback<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: () => void;
}

export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number = 300,
): DebouncedCallback<TArgs> {
  // Keep the latest callback + timer in refs so we don't re-create
  // the debounced function on every render; React strict-mode renders
  // twice and we don't want to leak timers in that case either.
  const callbackRef = useRef(callback);
  const timerRef = useRef<number | null>(null);
  const delayRef = useRef(delayMs);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    delayRef.current = delayMs;
  }, [delayMs]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Lazily build the debounced function exactly once per hook
  // instance. useState initializer runs at mount, never during render,
  // so the lint rule against reading refs during render is satisfied.
  const [debounced] = useState<DebouncedCallback<TArgs>>(() => {
    const fn = ((...args: TArgs) => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      if (delayRef.current <= 0) {
        callbackRef.current(...args);
        return;
      }
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        callbackRef.current(...args);
      }, delayRef.current);
    }) as DebouncedCallback<TArgs>;

    fn.cancel = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    return fn;
  });

  return debounced;
}
