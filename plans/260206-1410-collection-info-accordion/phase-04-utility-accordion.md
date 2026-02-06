# Phase 04: Utility Accordion Component

**Status**: completed
**Priority**: HIGH
**Effort**: 45 minutes
**Blocked By**: Phase 01, Phase 02

---

## Overview

Create the Utility accordion component using shadcn Accordion, displaying a list of utility items with labels and descriptions.

---

## Context Links

- **Original HTML**: `info.txt` (Utility section)
- **Reference Component**: `src/modules/launch-pad/mint-nft/components/mint-accordions.tsx`
- **shadcn Accordion**: `src/shared/components/ui/accordion.tsx`
- **Types**: `src/shared/types/collection-info.types.ts`

---

## Requirements

### Functional Requirements
1. Create collapsible accordion for Utility content
2. Display list of utility items with bold labels and descriptions
3. Use shadcn Accordion as base
4. Match original HTML visual appearance

### Non-Functional Requirements
1. Follow project naming conventions
2. Use `cn()` utility for class merging
3. "use client" directive
4. Proper TypeScript types

---

## Visual Matching Strategy

### Original HTML Key Styles (Utility Section):
```html
<!-- Heading -->
<h3 class="text !text-lg pt-1 pb-2" level="2">Utility</h3>

<!-- List Items -->
<ol class="ml-4 pb-6 last:pb-0">
  <li class="my-0 text-sm" index="0">
    <p class="text-sm leading-normal mb-5 last:mb-0">
      <em class="not-italic text-brand">
        <strong>Necessary Gameplay Asset:</strong>
      </em>
      A Pilot is required to enter any race...
    </p>
  </li>
</ol>
```

---

## Architecture

### New File: `src/modules/launch-pad/mint-nft/components/collection-utility-accordion.tsx`

```tsx
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
    <div className={cn("bg-layer-01 p-4 space-y-4 rounded-xl", className)}>
      <Accordion type="single" collapsible defaultValue="utility" className="w-full">
        <AccordionItem value="utility" className="border-none">
          <AccordionTrigger className="hover:no-underline py-4 pl-4">
            <h2 className="text-xl font-bold text-wrap text-foreground">{data.title}</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-secondary">
              <ol className="ml-4 pb-6 last:pb-0" style={{ listStyle: "outside" }}>
                {data.items.map((item, index) => (
                  <li key={index} className="my-0 text-sm" index={index.toString()}>
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
```

---

## Implementation Steps

1. Create component file with "use client"
2. Import shadcn Accordion components
3. Define component with props interface
4. Build accordion structure
5. Map over items array
6. Apply CSS classes matching original HTML
7. Test render

---

## Related Code Files

**Files to Create:**
- `src/modules/launch-pad/mint-nft/components/collection-utility-accordion.tsx`

**Files to Reference:**
- `src/modules/launch-pad/mint-nft/components/collection-overview-accordion.tsx` - similar pattern
- `src/modules/launch-pad/mint-nft/components/mint-accordions.tsx` - reference

---

## Success Criteria

- [x] Component renders without errors
- [x] Accordion expands/collapses correctly
- [x] All utility items display with labels
- [x] Visual appearance matches original HTML
- [x] TypeScript compiles (component file)
- [x] Follows code standards

---

## Risk Assessment

**Risk**: Minimal - simpler component than overview

**Mitigation**: Reference overview accordion patterns

---

## Security Considerations

None - display component only

---

## Next Steps

After completion → Phase 05: Create wrapper component
