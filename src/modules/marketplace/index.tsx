"use client";

import { useState, useMemo, useCallback, Component, ReactNode, useEffect } from "react";
import { cn } from "@/shared/utils/tailwind-utils";
import ControlBar from "@/modules/marketplace/components/ControlBar";
import NFTListView from "@/modules/marketplace/components/NFTListView";
import NFTGrid from "@/modules/marketplace/components/NFTGrid";
import FilterSidebar from "@/modules/marketplace/components/FilterSidebar";
import SellerModal from "@/modules/marketplace/components/SellerModal";
import { useNFTSelection } from "@/modules/marketplace/hooks/useNFTSelection";
import { useMyItems } from "@/modules/marketplace/hooks/useMyItems";
import HeroHeader from "@/modules/marketplace/components/HeroHeader";
import CollectionNav from "@/modules/marketplace/components/CollectionNav";
import BottomActionBar from "@/modules/marketplace/components/BottomActionBar";
import type { Collection } from "@/shared/utils/mock/collection";
import type { Nft } from "@/modules/marketplace/types";
import { NftStatus } from "@/modules/marketplace/types";
import { debounce } from "lodash";

interface SortingState {
  id: string;
  desc: boolean;
}

interface ColumnFilter {
  id: string;
  value: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    console.error("Error in NFTListView:", error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium">Something went wrong</h3>
            <p className="text-os-gray-300">Please try refreshing the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ShopNFTsProps {
  contractAddress: string;
  initialCollection: Collection;
}

export default function ShopNFTs({ contractAddress, initialCollection }: ShopNFTsProps) {
  const [collection] = useState(initialCollection);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("items");
  const [view, setView] = useState<"grid" | "list" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0.001, 0.1]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedNFT, setSelectedNFT] = useState<Nft | null>(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [filteredAndSortedNFTs, setFilteredAndSortedNFTs] = useState<Nft[]>([]);

  const isConnected = true;
  const address = "0x1234567890123456789012345678901234567890";

  const { nfts: myItemsNFTs, isLoading: myItemsLoading } = useMyItems({
    contractAddress,
    address: address || "",
    isConnected: isConnected || false,
  });

  const safeNFTs = useMemo(
    () =>
      Array.isArray(myItemsNFTs)
        ? myItemsNFTs.filter(
            (nft): nft is Nft =>
              nft != null && typeof nft === "object" && typeof nft.id === "string"
          )
        : [],
    [myItemsNFTs]
  );

  const searchValue = useMemo(
    () =>
      typeof columnFilters.find((f: ColumnFilter) => f.id === "item")?.value === "string"
        ? (columnFilters.find((f: ColumnFilter) => f.id === "item")?.value as string)
        : "",
    [columnFilters]
  );

  const sortValue = useMemo(
    () => (sorting[0]?.desc === false ? "low-to-high" : "high-to-low"),
    [sorting]
  );

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    const [min, max] = range;
    const validPriceRange: [number, number] = [
      isNaN(min) ? 0 : min,
      isNaN(max) ? Infinity : Math.max(min, max),
    ];
    setPriceRange(validPriceRange);
  }, []);

  const filterAndSortNFTs = useCallback(
    (nfts: Nft[]) => {
      return nfts
        .filter(nft => {
          if (statusFilter === "listed" && nft.status !== NftStatus.Listed) return false;
          if (statusFilter === "not-listed" && nft.status === NftStatus.Listed) return false;

          const price = nft.mintPrice ? Number(nft.mintPrice) : 0;
          if (isNaN(price)) return false;
          if (price < priceRange[0] || price > priceRange[1]) return false;

          if (!searchValue) return true;
          const name = typeof nft.name === "string" ? nft.name.toLowerCase() : "";
          return name.includes(searchValue.toLowerCase());
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "price-low":
              return (Number(a.mintPrice) || 0) - (Number(b.mintPrice) || 0);
            case "price-high":
              return (Number(b.mintPrice) || 0) - (Number(a.mintPrice) || 0);
            case "recent":
            default:
              if (a.status === NftStatus.Listed && b.status !== NftStatus.Listed) return -1;
              if (a.status !== NftStatus.Listed && b.status === NftStatus.Listed) return 1;
              return 0;
          }
        });
    },
    [searchValue, priceRange, statusFilter, sortBy]
  );

  useEffect(() => {
    const filtered = filterAndSortNFTs(safeNFTs);
    setFilteredAndSortedNFTs(filtered);
  }, [safeNFTs, statusFilter, sortBy, priceRange, searchValue, filterAndSortNFTs]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("cartUpdate", {
        detail: { itemCount: selectedNFTs.length },
      })
    );
  }, [selectedNFTs]);

  const onSelectedNFTsChange = useCallback(
    (ids: Set<string>) => {
      setSelectedNFTs(Array.from(ids));
      const visibleNFTs = safeNFTs.map(nft => ({
        ...nft,
        selected: ids.has(nft.id),
      }));
      const filtered = filterAndSortNFTs(visibleNFTs);
      setFilteredAndSortedNFTs(filtered);
    },
    [safeNFTs, filterAndSortNFTs]
  );

  const { 
    sliderValue, 
    isSliding, 
    handleSliderChange,
    handleItemCountChange,
    handleIndividualSelection 
  } = useNFTSelection({
    initialNFTs: safeNFTs,
    onVisibleNFTsChange: setFilteredAndSortedNFTs,
    onSelectedNFTsChange,
  });

  const [actionMode, setActionMode] = useState<"buy" | "sell">("buy");

  const handleNFTSelection = useCallback(
    (id: string) => {
      handleIndividualSelection(id, !selectedNFTs.includes(id));
    },
    [handleIndividualSelection, selectedNFTs]
  );

  const handleNFTCardClick = useCallback((nft: Nft) => {
    setSelectedNFT(nft);
    setShowSellerModal(true);
  }, []);

  const debouncedSetColumnFilters = useMemo(
    () =>
      debounce((value: string) => {
        setColumnFilters([{ id: "item", value }]);
      }, 500),
    []
  );

  const debouncedSetSorting = useMemo(
    () =>
      debounce((value: string) => {
        setSorting([{ id: "mintPrice", desc: value === "high-to-low" }]);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetColumnFilters.cancel();
      debouncedSetSorting.cancel();
    };
  }, [debouncedSetColumnFilters, debouncedSetSorting]);

  if (!collection) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Collection Found</h3>
          <p className="text-os-gray-300">Collection not available</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "items":
        return (
          <div className="flex transition-all duration-300 ease-in-out">
            {/* Desktop Filter Sidebar */}
            <div
              className={cn(
                "hidden md:block w-0 shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
                showFilters && "w-56"
              )}
            >
              {showFilters && (
                <FilterSidebar
                  onClose={() => setShowFilters(false)}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onStatusChange={setStatusFilter}
                  onSortChange={setSortBy}
                  isOpen={true}
                />
              )}
            </div>

            {/* Mobile Filter Sheet */}
            {showFilters && (
              <div className="md:hidden">
                <FilterSidebar
                  onClose={() => setShowFilters(false)}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onStatusChange={setStatusFilter}
                  onSortChange={setSortBy}
                  isOpen={showFilters}
                />
              </div>
            )}

            <div className="flex-1 transition-all duration-300 ease-in-out min-w-0">
              <div className="flex flex-col h-[calc(100vh-200px)]">
                <ControlBar
                  view={view}
                  setView={setView}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  searchValue={searchValue}
                  onSearch={debouncedSetColumnFilters}
                  sortValue={sortValue}
                  onSort={debouncedSetSorting}
                  totalItems={filteredAndSortedNFTs.length}
                />

                <div className="flex-1 min-h-[400px] md:pb-20 relative">
                  {myItemsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredAndSortedNFTs.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">No Items Found</h3>
                        <p className="text-os-gray-300">Adjust your filters to see more items.</p>
                      </div>
                    </div>
                  ) : view === "list" ? (
                    <ErrorBoundary>
                      <div className="absolute inset-0">
                        <NFTListView
                          type="seller"
                          nfts={filteredAndSortedNFTs}
                          sorting={sorting}
                          setSorting={setSorting}
                          columnFilters={columnFilters}
                          setColumnFilters={setColumnFilters}
                          onSelect={handleNFTSelection}
                          onCardClick={handleNFTCardClick}
                          selectedNFTs={selectedNFTs}
                        />
                      </div>
                    </ErrorBoundary>
                  ) : (
                    <NFTGrid
                      type="seller"
                      nfts={filteredAndSortedNFTs}
                      view={view === "compact" ? "compact" : "grid"}
                      showFilters={showFilters}
                      isSliding={isSliding}
                      onSelect={handleNFTSelection}
                      onCardClick={handleNFTCardClick}
                      selectedNFTs={selectedNFTs}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "offers":
        return (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">No Offers Available</h3>
              <p className="text-os-gray-300">There are currently no offers for this collection</p>
            </div>
          </div>
        );

      case "holders":
        return (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">Holders</h3>
              <p className="text-os-gray-300">Holders information coming soon</p>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">Activity</h3>
              <p className="text-os-gray-300">Activity feed coming soon</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-foreground transition-all duration-150">
      <main className="w-full mx-auto relative">
        {/* Hero Header */}
        <div className="w-full">
          <HeroHeader collection={collection} videoUrl={collection.banner} useMockData={true} />
        </div>

        {/* Collection Navigation - Single navigation, no duplicates */}
        <div className="px-0 sm:px-4 md:px-6 lg:px-8">
          <CollectionNav
            collectionSlug={contractAddress}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Content based on active tab */}
        <div className="px-0 sm:px-4 md:px-6 lg:px-8">{renderContent()}</div>
      </main>

      {showSellerModal && selectedNFT && (
        <SellerModal nft={selectedNFT} open={showSellerModal} onOpenChange={setShowSellerModal} />
      )}

      <BottomActionBar
        mode={actionMode}
        onModeChange={setActionMode}
        itemCount={selectedNFTs.length}
        maxItems={safeNFTs.length}
        sliderValue={sliderValue}
        onSliderChange={handleSliderChange}
        onItemCountChange={(count) => handleItemCountChange(String(count))}
        onBuyFloor={() => console.log("Buy floor clicked", selectedNFTs)}
        onMakeOffer={() => console.log("Make offer clicked", selectedNFTs)}
      />
    </div>
  );
}
