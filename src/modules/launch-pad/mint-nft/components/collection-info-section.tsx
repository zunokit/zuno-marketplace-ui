"use client";

import type { CollectionOverviewData, CollectionUtilityData } from "@/shared/types/collection-info.types";
import { CollectionOverviewAccordion } from "./collection-overview-accordion";
import { CollectionUtilityAccordion } from "./collection-utility-accordion";
import { cn } from "@/shared/utils/tailwind-utils";

interface CollectionInfoSectionProps {
  overview?: CollectionOverviewData | null;
  utility?: CollectionUtilityData | null;
  className?: string;
}

export function CollectionInfoSection({
  overview,
  utility,
  className,
}: CollectionInfoSectionProps) {
  if (!overview && !utility) {
    return null;
  }

  return (
    <div className={cn("w-full space-y-0", className)}>
      {overview && <CollectionOverviewAccordion data={overview} />}
      {utility && <CollectionUtilityAccordion data={utility} />}
    </div>
  );
}
