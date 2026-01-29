"use client";

/* no extra hooks needed */
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Grid, List, Search } from "lucide-react";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";

export default function EditionSelector() {
  const {
    mockEditions,
    selectedEdition,
    setSelectedEdition,
    editionFilter,
    setEditionFilter,
    editionSortBy,
    setEditionSortBy,
    editionViewMode,
    setEditionViewMode,
  } = useMintState();

  const filteredEditions = mockEditions
    .filter(edition => edition.name.toLowerCase().includes(editionFilter.toLowerCase()))
    .sort((a, b) => {
      switch (editionSortBy) {
        case "price":
          return Number(a.price) - Number(b.price);
        case "remaining":
          return b.remaining - a.remaining;
        case "newest":
          return Number(b.id) - Number(a.id);
        default:
          return 0;
      }
    });

  const selectedEditionData = mockEditions.find(e => e.id === selectedEdition);

  return (
    <div className="my-5 space-y-3">
      <div className="flex justify-between items-center gap-5">
        <h3 className="text-lg font-medium font-sans text-foreground dark:text-foreground">
          Select Edition <span className="text-primary">*</span>
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-os-gray-300" />
            <Input
              placeholder="Search editions..."
              value={editionFilter}
              onChange={e => setEditionFilter(e.target.value)}
              className="pl-10 h-9 w-48"
            />
          </div>
          <Select
            value={editionSortBy}
            onValueChange={(value: "price" | "remaining" | "newest") => setEditionSortBy(value)}
          >
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="remaining">Remaining</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-border-subtle">
            <Button
              variant={editionViewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setEditionViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={editionViewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setEditionViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {selectedEditionData && (
        <div className="p-4 bg-info/10 border border-info/20 rounded-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xs overflow-hidden">
              <Image
                src={selectedEditionData.imageUrl}
                alt={selectedEditionData.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium text-foreground dark:text-foreground">
                {selectedEditionData.name}
              </h4>
              <div className="flex items-center gap-4 text-sm text-os-gray-300">
                <span>{selectedEditionData.price} ETH</span>
                <span>
                  {selectedEditionData.remaining} / {selectedEditionData.maxSupply} remaining
                </span>
                <span>Max {selectedEditionData.perWalletLimit} per wallet</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          editionViewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        }
      >
        {filteredEditions.map(edition => (
          <div
            key={edition.id}
            className={`
              border rounded-[6px] cursor-pointer transition-all duration-200 hover:shadow-md border-border-subtle
              ${
                selectedEdition === edition.id
                  ? "border-info bg-info/10"
                  : "border-border-subtle hover:border-border-subtle/60"
              }
              ${editionViewMode === "list" ? "p-3" : "p-4"}
            `}
            onClick={() => setSelectedEdition(edition.id)}
          >
            {editionViewMode === "grid" ? (
              <div className="space-y-3">
                <div className="relative aspect-square rounded-xs overflow-hidden">
                  <Image src={edition.imageUrl} alt={edition.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground dark:text-foreground">
                    {edition.name}
                  </h4>
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-os-gray-300">Price</span>
                      <span className="font-medium text-foreground dark:text-foreground">
                        {edition.price} ETH
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-os-gray-300">Remaining</span>
                      <span className="text-foreground dark:text-foreground">
                        {edition.remaining} / {edition.maxSupply}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-os-gray-300">Per wallet</span>
                      <span className="text-foreground dark:text-foreground">
                        {edition.perWalletLimit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xs overflow-hidden flex-shrink-0">
                  <Image src={edition.imageUrl} alt={edition.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground dark:text-foreground">
                    {edition.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-4 text-sm text-os-gray-300">
                    <span>{edition.price} ETH</span>
                    <span>
                      {edition.remaining} / {edition.maxSupply} remaining
                    </span>
                    <span>Max {edition.perWalletLimit} per wallet</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEditions.length === 0 && (
        <div className="text-center py-8 text-os-gray-300">
          No editions found matching your search.
        </div>
      )}
    </div>
  );
}
