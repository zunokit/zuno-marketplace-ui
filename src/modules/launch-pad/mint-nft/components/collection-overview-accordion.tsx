"use client";

import type { CollectionOverviewProps, OverviewSectionData } from "@/shared/types/collection-info.types";
import { cn } from "@/shared/utils/tailwind-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

export function CollectionOverviewAccordion({
  data,
  className,
}: CollectionOverviewProps) {
  return (
    <div className={cn("px-6 py-4 space-y-4", className)}>
      <Accordion type="multiple" defaultValue={["overview"]} className="w-full">
        <AccordionItem value="overview" className="!border-primary !bg-transparent border-0">
          <AccordionTrigger className="hover:no-underline cursor-pointer [&>svg]:text-foreground py-2 relative z-10">
            <h2 className="text-xl font-bold text-wrap">Overview</h2>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="text">
              {/* Description */}
              <p className="text-sm leading-normal mb-5 last:mb-0">
                {data.description}
              </p>

              {/* Role in Gameplay */}
              <SectionContent section={data.roleInGameplay} />

              {/* RPG Progression */}
              <SectionContent section={data.rpgProgression} />

              {/* Flexible Usage */}
              <SectionContent section={data.flexibleUsage} />

              {/* Ecosystem */}
              <p className="text-sm leading-normal mb-5 last:mb-0">
                {data.ecosystem}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function SectionContent({ section }: { section: OverviewSectionData }) {
  return (
    <>
      <p className="text-sm leading-normal mb-5 last:mb-0">
        <em className="not-italic text-brand">
          <strong>{section.title}</strong>
        </em>
      </p>
      <ol className="ml-4 pb-6 last:pb-0" style={{ listStyle: "outside" }}>
        {section.items.map((item, index) => (
          <li key={index} className="my-0 text-sm">
            {item}
          </li>
        ))}
      </ol>
    </>
  );
}
