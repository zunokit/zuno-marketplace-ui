"use client";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/utils/tailwind-utils";

export default function ChainTabsSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="fixed left-0 right-0 top-[50px] md:top-[65px] xl:top-[60px] z-40 bg-background border-b border-border-subtle transition-all duration-150">
      <div className="mx-auto py-3 w-full md:px-6 lg:px-8">
        {isMobile ? (
          // Mobile skeleton
          <div className="bg-muted rounded-[8px] p-2">
            <div className="w-full h-12 bg-card border border-border-subtle rounded-[8px] animate-pulse"></div>
          </div>
        ) : (
          // Desktop skeleton
          <div className="flex space-x-1 overflow-x-auto">
            {/* "All Chains" tab skeleton */}
            <div className={cn("flex items-center h-10 px-3 rounded-[8px] bg-muted animate-pulse")}>
              <div className="w-5 h-5 rounded-full bg-muted-foreground/30"></div>
              <div className="ml-2 w-20 h-4 bg-muted-foreground/30 rounded"></div>
            </div>

            {/* Generate 5 chain tab skeletons */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={cn("flex items-center h-10 px-3 rounded-[8px] bg-muted animate-pulse")}
              >
                <div className="w-5 h-5 rounded-full bg-muted-foreground/30"></div>
                <div className="ml-2 w-16 h-4 bg-muted-foreground/30 rounded"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
