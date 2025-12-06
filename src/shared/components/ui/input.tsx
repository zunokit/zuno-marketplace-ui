import * as React from "react";

import { cn } from "@/shared/utils/tailwind-utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // OpenSea input styling
        "flex h-10 w-full min-w-0 rounded-[8px] border bg-frosted-1 px-3 py-2 text-sm text-foreground font-sans",
        "border-border-subtle placeholder:text-os-gray-300",
        "transition-all duration-150 outline-none",
        "hover:border-border-medium",
        "focus:border-border-strong focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "selection:bg-frosted-6 selection:text-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Input };
