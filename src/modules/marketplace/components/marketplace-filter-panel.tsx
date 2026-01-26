import React, { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion";
import { X } from "lucide-react";
import { randomImage } from "@/shared/utils/mock/randomImage";

interface MarketplaceFilterPanelProps {
  onClose: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
  selectedTraits?: string[];
  onTraitsChange?: (traits: string[]) => void;
  isOpen?: boolean;
}

interface TraitItem {
  name: string;
  count: number;
  floor: string;
  percentage: string;
}

interface TraitCategory {
  name: string;
  totalCount: number;
  items: TraitItem[];
}

const TRAIT_CATEGORIES: TraitCategory[] = [
  {
    name: "Background",
    totalCount: 10,
    items: [
      { name: "Path", count: 21, floor: "--", percentage: "21%" },
      { name: "Orchard", count: 21, floor: "--", percentage: "21%" },
      { name: "Library", count: 21, floor: "--", percentage: "21%" },
      { name: "Martian Desert", count: 20, floor: "0.01000", percentage: "20%" },
      { name: "Terrace", count: 20, floor: "--", percentage: "20%" },
      { name: "Hell", count: 20, floor: "--", percentage: "20%" },
      { name: "Forgotten Quarry", count: 20, floor: "--", percentage: "20%" },
      { name: "Crashed UFO", count: 20, floor: "--", percentage: "20%" },
      { name: "Field", count: 19, floor: "0.00300", percentage: "19%" },
      { name: "Tree House", count: 19, floor: "--", percentage: "19%" },
    ],
  },
  {
    name: "Body",
    totalCount: 13,
    items: [
      { name: "Blue", count: 25, floor: "0.005", percentage: "25%" },
      { name: "Green", count: 22, floor: "--", percentage: "22%" },
      { name: "Red", count: 20, floor: "0.008", percentage: "20%" },
      { name: "Yellow", count: 18, floor: "--", percentage: "18%" },
      { name: "Purple", count: 15, floor: "0.010", percentage: "15%" },
      { name: "Orange", count: 14, floor: "--", percentage: "14%" },
      { name: "Pink", count: 12, floor: "0.012", percentage: "12%" },
      { name: "Brown", count: 10, floor: "--", percentage: "10%" },
      { name: "Gray", count: 8, floor: "0.015", percentage: "8%" },
      { name: "Black", count: 7, floor: "--", percentage: "7%" },
      { name: "White", count: 6, floor: "0.020", percentage: "6%" },
      { name: "Cyan", count: 5, floor: "--", percentage: "5%" },
      { name: "Magenta", count: 4, floor: "0.025", percentage: "4%" },
    ],
  },
  {
    name: "Clothes",
    totalCount: 38,
    items: [
      { name: "T-Shirt Red", count: 30, floor: "--", percentage: "30%" },
      { name: "T-Shirt Blue", count: 28, floor: "0.005", percentage: "28%" },
      { name: "T-Shirt Green", count: 25, floor: "--", percentage: "25%" },
      { name: "Hoodie Black", count: 23, floor: "0.008", percentage: "23%" },
      { name: "Hoodie Gray", count: 22, floor: "--", percentage: "22%" },
      { name: "Hoodie White", count: 20, floor: "0.010", percentage: "20%" },
      { name: "Jacket Leather", count: 18, floor: "--", percentage: "18%" },
      { name: "Jacket Denim", count: 17, floor: "0.012", percentage: "17%" },
      { name: "Jacket Bomber", count: 16, floor: "--", percentage: "16%" },
      { name: "Sweater Red", count: 15, floor: "0.015", percentage: "15%" },
      { name: "Sweater Blue", count: 14, floor: "--", percentage: "14%" },
      { name: "Sweater Green", count: 13, floor: "0.018", percentage: "13%" },
      { name: "Tank Top", count: 12, floor: "--", percentage: "12%" },
      { name: "Polo Shirt", count: 11, floor: "0.020", percentage: "11%" },
      { name: "Button Up", count: 10, floor: "--", percentage: "10%" },
      { name: "Flannel", count: 9, floor: "0.022", percentage: "9%" },
      { name: "Vest", count: 8, floor: "--", percentage: "8%" },
      { name: "Cardigan", count: 7, floor: "0.025", percentage: "7%" },
      { name: "Blazer", count: 6, floor: "--", percentage: "6%" },
      { name: "Suit", count: 5, floor: "0.030", percentage: "5%" },
      { name: "Tuxedo", count: 4, floor: "--", percentage: "4%" },
      { name: "Dress Shirt", count: 4, floor: "0.035", percentage: "4%" },
      { name: "Hawaiian Shirt", count: 3, floor: "--", percentage: "3%" },
      { name: "Jersey", count: 3, floor: "0.040", percentage: "3%" },
      { name: "Sweatshirt", count: 3, floor: "--", percentage: "3%" },
      { name: "Pullover", count: 2, floor: "0.045", percentage: "2%" },
      { name: "Windbreaker", count: 2, floor: "--", percentage: "2%" },
      { name: "Parka", count: 2, floor: "0.050", percentage: "2%" },
      { name: "Peacoat", count: 2, floor: "--", percentage: "2%" },
      { name: "Trench Coat", count: 1, floor: "0.055", percentage: "1%" },
      { name: "Rain Coat", count: 1, floor: "--", percentage: "1%" },
      { name: "Overcoat", count: 1, floor: "0.060", percentage: "1%" },
      { name: "Cape", count: 1, floor: "--", percentage: "1%" },
      { name: "Poncho", count: 1, floor: "0.065", percentage: "1%" },
      { name: "Kimono", count: 1, floor: "--", percentage: "1%" },
      { name: "Robe", count: 1, floor: "0.070", percentage: "1%" },
      { name: "Tunic", count: 1, floor: "--", percentage: "1%" },
      { name: "Armor", count: 1, floor: "0.100", percentage: "1%" },
    ],
  },
];

export default function FilterSidebar({
  onClose,
  priceRange,
  onPriceRangeChange,
  onStatusChange,
  onSortChange,
  selectedTraits = [],
  onTraitsChange,
  isOpen = true,
}: MarketplaceFilterPanelProps) {
  const traitKey = (cat: string, name: string) => `${cat}:${name}`;
  const isTraitSelected = (cat: string, name: string) => selectedTraits.includes(traitKey(cat, name));
  const toggleTrait = (cat: string, name: string) => {
    if (!onTraitsChange) return;
    const key = traitKey(cat, name);
    if (selectedTraits.includes(key)) {
      onTraitsChange(selectedTraits.filter((t) => t !== key));
    } else {
      onTraitsChange([...selectedTraits, key]);
    }
  };
  const [isMobile, setIsMobile] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [traitsSearch, setTraitsSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [expandedTraitCategory, setExpandedTraitCategory] = useState<Record<string, boolean>>({});

  const TRAIT_VISIBLE_INITIAL = 6;
  const toggleTraitCategoryExpand = (name: string) => {
    setExpandedTraitCategory((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setMinPrice(priceRange[0].toString());
    setMaxPrice(priceRange[1].toString());
  }, [priceRange]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value);
    const min = parseFloat(value) || 0;
    onPriceRangeChange([min, priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value);
    const max = parseFloat(value) || 1;
    onPriceRangeChange([priceRange[0], max]);
  };

  const filterContent = (
    <div className="overflow-y-auto scrollbar-hide relative pt-12 h-full flex-1 min-h-0">
      <Accordion type="multiple" defaultValue={["status", "price", "traits"]} className="w-full">
        {/* Status Accordion */}
        <AccordionItem value="status" className="m_fe19b709 !border-primary text !bg-transparent last:border-b-0 m_9bd7b098 border-b">
          <AccordionTrigger className="mantine-focus-auto m_6939a5e9 bg-transparent hover:bg-transparent hover:no-underline p-0 m_4ba585b8 w-full flex items-center justify-between [&[data-state=open]>svg]:rotate-180">
            <span className="text py-4 text text-base w-full m_df3ffa0f">
              <div className="flex items-center">Status</div>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="p-0">
              <div className="m_46b77525">
                <div role="radiogroup">
                  <div
                    className="text flex items-stretch gap-x-6 gap-y-4 flex-col m_4081bf90"
                    style={{ "--group-gap": "var(--mantine-spacing-md)", "--group-align": "center", "--group-justify": "flex-start", "--group-wrap": "wrap" } as React.CSSProperties}
                  >
                    {/* Show all option */}
                    <div className="m_f3f1af94 m_5f75b09e" data-label-position="right" data-checked="true" style={{ "--radio-color": "var(--mantine-color-blue-filled)" } as React.CSSProperties}>
                      <div className="m_5f6e695e">
                        <div className="hidden m_89c4f5e4" data-label-position="right">
                          <input
                            className="mantine-focus-auto m_8a3dbb89"
                            name="mantine-vt8rh9wos"
                            id="mantine-nzwp0c3s8"
                            type="radio"
                            value="all"
                            checked
                            onChange={() => onStatusChange("all")}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 5 5" aria-hidden="true" className="m_f3ed6b2b">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
                          </svg>
                        </div>
                        <div className="flex-1 m_d3ea56bb">
                          <label className="group flex items-center outline-none px-0 gap-x-2 text-base cursor-pointer m_8ee546b8" htmlFor="mantine-nzwp0c3s8">
                            <div className="relative shrink-0 border rounded-full size-5 border-brand group-hover:border-brand-darker transition-colors">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-200 size-2.5 bg-brand group-hover:bg-brand-darker" />
                            </div>
                            <div className="empty:hidden w-full truncate">
                              <div className="transition-colors text-primary text-sm">
                                <div className="flex justify-between">
                                  <span>Show all</span>
                                  <span className="text-secondary">2,500</span>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* Buy now option */}
                    <div className="m_f3f1af94 m_5f75b09e" data-label-position="right" style={{ "--radio-color": "var(--mantine-color-blue-filled)" } as React.CSSProperties}>
                      <div className="m_5f6e695e">
                        <div className="hidden m_89c4f5e4" data-label-position="right">
                          <input
                            className="mantine-focus-auto m_8a3dbb89"
                            name="mantine-vt8rh9wos"
                            id="mantine-w72yjvppi"
                            type="radio"
                            value="buy_now"
                            onChange={() => onStatusChange("buy_now")}
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 5 5" aria-hidden="true" className="m_f3ed6b2b">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
                          </svg>
                        </div>
                        <div className="flex-1 m_d3ea56bb">
                          <label className="group flex items-center outline-none px-0 gap-x-2 text-base cursor-pointer m_8ee546b8" htmlFor="mantine-w72yjvppi">
                            <div className="relative shrink-0 border rounded-full size-5 bg-button-secondary border-primary group-hover:border-interactive-hover group-active:bg-button-secondary-active transition-colors">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-200 size-2.5 scale-50 bg-transparent" />
                            </div>
                            <div className="empty:hidden w-full truncate">
                              <div className="transition-colors text-primary text-sm">
                                <div className="flex justify-between">
                                  <span>Buy now</span>
                                  <span className="text-secondary">9</span>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Accordion */}
        <AccordionItem value="price" className="m_fe19b709 !border-primary text !bg-transparent last:border-b-0 m_9bd7b098 border-b">
          <AccordionTrigger className="mantine-focus-auto m_6939a5e9 bg-transparent hover:bg-transparent hover:no-underline p-0 m_4ba585b8 w-full flex items-center justify-between [&[data-state=open]>svg]:rotate-180">
            <span className="text py-4 text text-base w-full m_df3ffa0f">
              <div className="flex items-center">
                <div className="flex items-center w-full">
                  <span>Price</span>
                </div>
              </div>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="p-0">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm text-secondary">
                  <div className="grow h-auto">
                    <div className="h-10 pl-3 border transition-colors flex items-center rounded space-x-2 overflow-hidden bg-transparent border-interactive hover:border-interactive-hover focus:border-interactive-focus focus-within:border-interactive-focus pr-3 Input_input__z9lBV">
                      <input
                        className="px-0 h-5 w-full text-sm text bg-transparent placeholder:text-placeholder rounded-none border-0 outline-none"
                        placeholder="MIN"
                        id="min-filter"
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                      />
                    </div>
                  </div>
                  <span className="px-2 flex-none whitespace-nowrap">to</span>
                  <div className="grow">
                    <div className="h-10 pl-3 border transition-colors flex items-center rounded space-x-2 overflow-hidden bg-transparent border-interactive hover:border-interactive-hover focus:border-interactive-focus focus-within:border-interactive-focus pr-3 Input_input__z9lBV">
                      <input
                        className="px-0 h-5 w-full text-sm text bg-transparent placeholder:text-placeholder rounded-none border-0 outline-none"
                        placeholder="MAX"
                        id="max-filter"
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Traits Accordion */}
        <AccordionItem value="traits" className="m_fe19b709 !border-primary text !bg-transparent last:border-b-0 m_9bd7b098 border-b">
          <AccordionTrigger className="mantine-focus-auto m_6939a5e9 bg-transparent hover:bg-transparent hover:no-underline p-0 m_4ba585b8 w-full flex items-center justify-between [&[data-state=open]>svg]:rotate-180">
            <span className="text py-4 text text-base w-full m_df3ffa0f">
              <div className="flex items-center">Traits</div>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="p-0">
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <div className="w-full flex items-center space-x-2 border transition-colors hover:border-interactive-hover focus:border-interactive-focus focus-within:border-interactive border-light bg-transparent disabled:bg-transparent rounded p-2 h-9 mb-2">
                    <svg
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 text-secondary"
                      color="currentColor"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M9.86686 15.8333C13.5488 15.8333 16.5335 12.8486 16.5335 9.16667C16.5335 5.48477 13.5488 2.5 9.86686 2.5C6.18496 2.5 3.2002 5.48477 3.2002 9.16667C3.2002 12.8486 6.18496 15.8333 9.86686 15.8333Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M18.2002 17.5L14.5752 13.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      className="px-0 h-5 w-full text-sm text bg-transparent placeholder:text-placeholder rounded-none border-0 outline-none"
                      placeholder="Search Traits"
                      value={traitsSearch}
                      onChange={(e) => setTraitsSearch(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    data-test-id={viewMode === "list" ? "undefined-list" : "undefined-grid"}
                    className="inline-flex justify-center items-center rounded text-sm transition bg-button-secondary hover:bg-button-secondary-hover active:bg-button-secondary-active disabled:bg-button-secondary-disabled text-primary disabled:text-disabled size-9 py-0 px-2"
                    onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                  >
                    {viewMode === "list" ? (
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="20"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-current"
                      >
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" color="currentColor" width="20" height="20">
                        <rect width="6" height="6" x="3.084" y="3" fill="currentColor" rx="1" />
                        <rect width="6" height="6" x="11.084" y="3" fill="currentColor" rx="1" />
                        <rect width="6" height="6" x="3.084" y="11" fill="currentColor" rx="1" />
                        <rect width="6" height="6" x="11.084" y="11" fill="currentColor" rx="1" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Nested Accordion for Traits - collapsed by default to reduce scroll */}
                <Accordion type="multiple" defaultValue={[]} className="w-full">
                  {TRAIT_CATEGORIES.map((category, categoryIndex) => (
                    <AccordionItem
                      key={category.name}
                      value={category.name.toLowerCase()}
                      className="m_fe19b709 !border-primary text !bg-transparent m_9bd7b098 border-b-0"
                    >
                      <AccordionTrigger className="mantine-focus-auto m_6939a5e9 bg-transparent hover:bg-transparent hover:no-underline p-0 m_4ba585b8 w-full flex items-center justify-between py-3 [&[data-state=open]>svg]:rotate-180">
                        <span className="text w-full flex items-center justify-between text text-sm m_df3ffa0f">
                          <div className="flex">
                            <span className="capitalize">{category.name}</span>
                          </div>
                          <span className="text-secondary">{category.totalCount}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="p-0">
                          {viewMode === "list" ? (
                            <div className="flex flex-col">
                              {category.items
                                .filter(
                                  (t) =>
                                    !traitsSearch ||
                                    t.name.toLowerCase().includes(traitsSearch.toLowerCase().trim())
                                )
                                .map((trait) => (
                                  <label
                                    key={trait.name}
                                    className="group inline-flex items-center gap-x-2 text-base cursor-pointer py-2.5 px-1"
                                    onClick={() => toggleTrait(category.name, trait.name)}
                                  >
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={isTraitSelected(category.name, trait.name)}
                                      readOnly
                                    />
                                    <span
                                      aria-hidden="true"
                                      className="transition shrink-0 flex items-center justify-center border size-5 rounded bg-button-secondary border-primary group-hover:border-interactive-hover group-active:bg-button-secondary-active"
                                    >
                                      <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={
                                          "transition scale-50 " +
                                          (isTraitSelected(category.name, trait.name)
                                            ? "text-primary"
                                            : "text-transparent")
                                        }
                                        width="16"
                                        height="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    </span>
                                  <div className="empty:hidden w-full truncate">
                                    <div className="transition text-primary">
                                      <div className="select-none">
                                        <div className="flex items-center justify-between text-sm mb-0.5 gap-2">
                                          <span className="truncate">{trait.name}</span>
                                          <span className="shrink-0">{trait.count}</span>
                                        </div>
                                        <div className="flex text-xs text-secondary">
                                          <div>{trait.floor} floor</div>
                                          <div className="ml-auto" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 py-3">
                              {category.items
                                .filter(
                                  (t) =>
                                    !traitsSearch ||
                                    t.name.toLowerCase().includes(traitsSearch.toLowerCase().trim())
                                )
                                .map((trait, index) => (
                                  <button
                                    key={trait.name}
                                    type="button"
                                    onClick={() => toggleTrait(category.name, trait.name)}
                                    className={
                                      "flex flex-col relative w-full overflow-hidden transition bg-layer-01 border rounded-lg group hover:bg-layer-02 hover:border-interactive-hover " +
                                      (isTraitSelected(category.name, trait.name)
                                        ? "ring-2 ring-primary border-primary"
                                        : "")
                                    }
                                  >
                                  <div className="w-full overflow-hidden">
                                    <div className="relative transition-transform duration-300 group-hover:scale-110 min-h-[98px] 3xl:min-h-[173px] w-full bg-layer-03">
                                      <img src={`${randomImage()}&id=${categoryIndex * 10 + index}`} alt={trait.name} className="overflow-hidden w-full" />
                                    </div>
                                  </div>
                                  <div className="p-1.5 text-left w-full">
                                    <div className="text-xs text truncate py-1.5">{trait.name}</div>
                                    <div className="flex items-center justify-between text-xxs text-secondary">
                                      <div>
                                        <span className="text">{trait.floor}</span>{" "}
                                      </div>
                                      <div>{trait.percentage}</div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // Mobile - Use Fullscreen Sheet
  if (isMobile) {
    return (
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <SheetContent
          side="left"
          className="w-full sm:max-w-full p-0 h-full fixed"
        >
          <div className="h-full flex flex-col">
            <SheetHeader className="flex items-center justify-between w-full absolute z-10 p-4 top-0 left-0 bg-background">
              <SheetTitle className="text font-semibold text-lg">Filters</SheetTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6 text font-semibold cursor-pointer ml-auto" onClick={onClose}>
                <X className="size-6" />
              </Button>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              {filterContent}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop - Regular sidebar
  return (
    <div className="w-[240px] 3xl:w-[390px] shrink-0 bg-background border-r h-full">
      <div className="relative flex flex-col bg-background p-4 pb-0 h-full overflow-hidden">
        <div className="flex items-center justify-between w-full absolute z-10 p-4 top-0 left-0 bg-background">
          <h4 className="text font-semibold text-lg">Filters</h4>
          <button className="text font-semibold cursor-pointer ml-auto" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              className="size-6"
              color="currentColor"
              width="20"
              height="20"
            >
              <path d="M15.625 4.375L4.375 15.625M15.625 15.625L4.375 4.375" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {filterContent}
      </div>
    </div>
  );
}
