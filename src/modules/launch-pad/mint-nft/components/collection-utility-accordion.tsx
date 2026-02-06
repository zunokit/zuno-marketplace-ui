"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { cn } from "@/shared/utils/tailwind-utils";
import type { CollectionUtilityProps } from "@/shared/types/collection-info.types";

export function CollectionUtilityAccordion({
  data,
  className,
}: CollectionUtilityProps) {
  return (
    <div className={cn("px-6 py-4 space-y-4", className)}>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="utility" className="!border-primary !bg-transparent border-0">
          <AccordionTrigger className="hover:underline hover:no-underline [&>svg]:text-foreground">
            <h2 className="text-xl font-bold text-wrap">{data.title}</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="text">
              <ol className="ml-4 pb-6 last:pb-0" style={{ listStyle: "outside" }}>
                {data.items.map((item, index) => (
                  <li key={index} className="my-0 text-sm">
                    <p className="text-sm leading-normal mb-5 last:mb-0">
                      <em className="not-italic text-brand">
                        <strong>{item.label}:</strong>
                      </em>
                      {item.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
