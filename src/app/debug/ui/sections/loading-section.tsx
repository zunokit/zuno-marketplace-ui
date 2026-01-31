"use client";

import * as React from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Progress } from "@/shared/components/ui/progress";

export function LoadingSection() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Spinner</h4>
        <div className="flex flex-wrap items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="default" />
          <Spinner size="lg" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Skeleton</h4>
        <div className="space-y-3 max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Progress Bar</h4>
        <div className="max-w-md">
          <Progress value={progress} />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Card Skeleton</h4>
        <div className="max-w-sm rounded-lg border border-border-subtle p-4 space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
