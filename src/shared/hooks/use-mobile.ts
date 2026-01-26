import * as React from "react";

// Default: 1024 to match desktop menu breakpoint (lg). Use 768 for Tailwind md.
export const MOBILE_BREAKPOINT = 1024;
/** Tailwind md breakpoint (768px). Use for dialog/drawer, sheets, etc. */
export const MD_BREAKPOINT = 768;

/**
 * @param breakpoint - Max width (exclusive) for "mobile". Default 1024. Use MD_BREAKPOINT (768) for below md.
 */
export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < breakpoint);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isMobile;
}
