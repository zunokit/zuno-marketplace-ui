# Phase 03: Overview Accordion Component

**Status**: completed
**Priority**: HIGH
**Effort**: 1 hour
**Blocked By**: Phase 01, Phase 02

---

## Overview

Create the Overview accordion component using shadcn Accordion, matching the visual appearance of the original Mantine HTML.

---

## Context Links

- **Original HTML**: `info.txt` (Overview section)
- **Reference Component**: `src/modules/launch-pad/mint-nft/components/mint-accordions.tsx`
- **shadcn Accordion**: `src/shared/components/ui/accordion.tsx`
- **Types**: `src/shared/types/collection-info.types.ts`

---

## Requirements

### Functional Requirements
1. Create collapsible accordion for Overview content
2. Display all sections: description, role in gameplay, RPG progression, flexible usage, ecosystem
3. Use shadcn Accordion as base
4. Match original HTML visual appearance

### Non-Functional Requirements
1. Follow project naming conventions (kebab-case, PascalCase components)
2. Use `cn()` utility for class merging
3. "use client" directive for interactivity
4. Proper TypeScript types

---

## Visual Matching Strategy

### Original HTML Key Styles:
```html
<!-- Container -->
class="manteine-Accordion-item !border-primary text !bg-transparent !border-0"

<!-- Control/Trigger -->
class="hover:bg-transparent pl-5"
data-chevron-position="right"

<!-- Chevron -->
class="rotate-180" when active
color="currentColor" width="20" height="20"

<!-- Label -->
class="text-sm text py-4"
<h2 class="text-xl font-bold text-wrap">Overview</h2>

<!-- Content -->
class="text-secondary"
<p class="text-sm leading-normal mb-5 last:mb-0">

<!-- Section Headers -->
<em class="not-italic text-brand"><strong>...</strong></em>
<h3 class="text !text-lg pt-1 pb-2" level="2">

<!-- Lists -->
<ol class="ml-4 pb-6 last:pb-0">
<li class="my-0 text-sm" index="0">
```

### Component Structure:
```tsx
<div className="bg-layer-01 p-4 space-y-4 rounded-xl">
  <Accordion type="single" collapsible defaultValue="overview">
    <AccordionItem value="overview" className="border-none">
      <AccordionTrigger className="hover:no-underline py-4 pl-4">
        <h2 className="text-xl font-bold text-wrap text-foreground">Overview</h2>
      </AccordionTrigger>
      <AccordionContent>
        {/* Content sections */}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>
```

---

## Architecture

### New File: `src/modules/launch-pad/mint-nft/components/collection-overview-accordion.tsx`

```tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { cn } from "@/shared/utils/tailwind-utils";
import type { CollectionOverviewProps } from "@/shared/types/collection-info.types";

export function CollectionOverviewAccordion({
  data,
  className,
}: CollectionOverviewProps) {
  return (
    <div className={cn("bg-layer-01 p-4 space-y-4 rounded-xl", className)}>
      <Accordion type="single" collapsible defaultValue="overview" className="w-full">
        <AccordionItem value="overview" className="border-none">
          <AccordionTrigger className="hover:no-underline py-4 pl-4">
            <h2 className="text-xl font-bold text-wrap text-foreground">Overview</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-secondary">
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

function SectionContent({ section }: { section: { title: string; items: string[] } }) {
  return (
    <>
      <p className="text-sm leading-normal mb-5 last:mb-0">
        <em className="not-italic text-brand">
          <strong>{section.title}</strong>
        </em>
      </p>
      <ol className="ml-4 pb-6 last:pb-0" style={{ listStyle: "outside" }}>
        {section.items.map((item, index) => (
          <li key={index} className="my-0 text-sm" index={index.toString()}>
            {item}
          </li>
        ))}
      </ol>
    </>
  );
}
```

---

## Implementation Steps

1. Create component file with "use client"
2. Import shadcn Accordion components
3. Define component with props interface
4. Build accordion structure
5. Add description paragraph
6. Create SectionContent sub-component for reusable sections
7. Add all sections (roleInGameplay, rpgProgression, flexibleUsage, ecosystem)
8. Apply CSS classes matching original HTML
9. Test render

---

## Related Code Files

**Files to Create:**
- `src/modules/launch-pad/mint-nft/components/collection-overview-accordion.tsx`

**Files to Reference:**
- `src/modules/launch-pad/mint-nft/components/mint-accordions.tsx` - similar pattern
- `src/shared/components/ui/accordion.tsx` - base component

---

## Success Criteria

- [x] Component renders without errors
- [x] Accordion expands/collapses correctly
- [x] All content sections display
- [x] Visual appearance matches original HTML
- [x] TypeScript compiles
- [x] Follows code standards (naming, imports)

---

## Risk Assessment

**Risk**: Visual mismatch due to Mantine → shadcn differences
**Mitigation**: Use custom CSS classes, reference mint-accordions.tsx patterns

---

## Security Considerations

None - display component only, no user input handling

---

## Next Steps

After completion → Phase 04: Build utility accordion component
