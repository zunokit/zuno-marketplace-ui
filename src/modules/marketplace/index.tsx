"use client";

import { useState, useMemo, useCallback, Component, ReactNode, useEffect } from "react";
import { cn } from "@/shared/utils/tailwind-utils";
import MarketplaceToolbar from "@/modules/marketplace/components/marketplace-toolbar";
import { MarketplaceMobileTabs } from "@/modules/marketplace/components/marketplace-mobile-tabs";
import MarketplaceNFTTable from "@/modules/marketplace/components/marketplace-nft-table";
import MarketplaceNFTGrid from "@/modules/marketplace/components/marketplace-nft-grid";
import MarketplaceFilterPanel from "@/modules/marketplace/components/marketplace-filter-panel";
import MarketplaceListModal from "@/modules/marketplace/components/marketplace-list-modal";
import {
  useInfiniteMarketplaceItems,
  type MarketplaceFilters,
} from "@/modules/marketplace/queries";
import { useNFTSelectionStore } from "@/shared/stores/use-nft-selection-store";
import MarketplaceCollectionHero from "@/modules/marketplace/components/marketplace-collection-hero";
import MarketplaceCollectionTabs from "@/modules/marketplace/components/marketplace-collection-tabs";
import type { Collection } from "@/shared/utils/mock/collection";
import type { Nft } from "@/modules/marketplace/types";
import { NftStatus } from "@/modules/marketplace/types";

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
    console.error("Error in MarketplaceNFTTable:", error);
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
  const [activeTab, setActiveTab] = useState("items");
  const [view, setView] = useState<"grid" | "list" | "compact">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0.001, 0.1]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<Nft | null>(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

  // Zustand store for NFT selection
  const { selectedNFTs, toggle, setMaxItems, setAvailableNFTs } = useNFTSelectionStore();

  const isConnected = true;
  const address = "0x1234567890123456789012345678901234567890";

  // Create filters object for infinite query
  const filters: MarketplaceFilters = useMemo(
    () => ({
      priceRange,
      status: statusFilter,
      sortBy,
      selectedTraits,
      search: searchQuery,
    }),
    [priceRange, statusFilter, sortBy, selectedTraits, searchQuery]
  );

  // Use infinite query hook instead of useMarketplaceUserItems
  const {
    items: nfts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteMarketplaceItems(contractAddress, filters, {
    enabled: isConnected && !!address,
  });

  // Safe NFTs for compatibility with existing code
  const safeNFTs = nfts;

  // Update max items and available NFTs in store when NFTs change
  useEffect(() => {
    setMaxItems(nfts.length);
    setAvailableNFTs(nfts.map(nft => nft.id));
  }, [nfts, setMaxItems, setAvailableNFTs]);

  // Dispatch cart update event when selection changes
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("cartUpdate", {
        detail: { itemCount: selectedNFTs.length },
      })
    );
  }, [selectedNFTs]);

  const searchValue = searchQuery;

  const sortValue = sortBy;

  const handlePriceRangeChange = useCallback(
    (range: [number, number]) => {
      const [min, max] = range;
      const validPriceRange: [number, number] = [
        isNaN(min) ? 0 : min,
        isNaN(max) ? Infinity : Math.max(min, max),
      ];
      setPriceRange(validPriceRange);
    },
    [setPriceRange]
  );

  // Handle NFT selection using store
  const handleNFTSelection = useCallback(
    (id: string) => {
      toggle(id);
    },
    [toggle]
  );

  const handleNFTCardClick = useCallback((nft: Nft) => {
    setSelectedNFT(nft);
    setShowSellerModal(true);
  }, []);

  // REMOVED: Debounced handlers - now using direct setters for query params

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
          <div className="flex transition-all duration-300 ease-in-out h-full overflow-hidden">
            {/* Desktop Filter Sidebar */}
            <div
              className={cn(
                "hidden md:block w-0 shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
                showFilters && "w-[240px] 3xl:w-[390px]"
              )}
            >
              {showFilters ? (
                <MarketplaceFilterPanel
                  onClose={() => setShowFilters(false)}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onStatusChange={setStatusFilter}
                  onSortChange={setSortBy}
                  selectedTraits={selectedTraits}
                  onTraitsChange={setSelectedTraits}
                  isOpen={true}
                />
              ) : null}
            </div>

            {/* Mobile Filter Sheet */}
            {showFilters ? (
              <div className="md:hidden">
                <MarketplaceFilterPanel
                  onClose={() => setShowFilters(false)}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onStatusChange={setStatusFilter}
                  onSortChange={setSortBy}
                  selectedTraits={selectedTraits}
                  onTraitsChange={setSelectedTraits}
                  isOpen={showFilters}
                />
              </div>
            ) : null}

            <div className="flex-1 min-h-0 transition-all duration-300 ease-in-out min-w-0 flex flex-col h-full overflow-hidden">
              <MarketplaceToolbar
                view={view}
                setView={setView}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                searchValue={searchValue}
                onSearch={setSearchQuery}
                sortValue={sortValue}
                onSort={setSortBy}
                totalItems={nfts.length}
              />

              <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : isError ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Error Loading Items</h3>
                      <p className="text-os-gray-300">Please try refreshing the page.</p>
                    </div>
                  </div>
                ) : nfts.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">No Items Found</h3>
                      <p className="text-os-gray-300">Adjust your filters to see more items.</p>
                    </div>
                  </div>
                ) : view === "list" ? (
                  <ErrorBoundary>
                    <MarketplaceNFTTable
                      type="seller"
                      nfts={nfts}
                      sorting={sorting}
                      setSorting={setSorting}
                      columnFilters={columnFilters}
                      setColumnFilters={setColumnFilters}
                      onSelect={handleNFTSelection}
                      onCardClick={handleNFTCardClick}
                      selectedNFTs={selectedNFTs}
                    />
                  </ErrorBoundary>
                ) : (
                  <MarketplaceNFTGrid
                    type="seller"
                    nfts={nfts}
                    view={view === "compact" ? "compact" : "grid"}
                    showFilters={showFilters}
                    isSliding={false}
                    onSelect={handleNFTSelection}
                    onCardClick={handleNFTCardClick}
                    selectedNFTs={selectedNFTs}
                    infiniteScrollProps={{
                      hasNextPage,
                      isFetchingNextPage,
                      fetchNextPage,
                      isError,
                    }}
                  />
                )}
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
    <div className="flex flex-col text-foreground transition-all duration-150">
      {/* Hero Header - Natural height */}
      <div className="w-full shrink-0">
        <MarketplaceCollectionHero
          collection={collection}
          videoUrl={collection.banner}
          useMockData={true}
        />
      </div>

      {/* Collection Navigation - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block shrink-0">
        <div className="px-0 sm:px-4 md:px-6 lg:px-8">
          <MarketplaceCollectionTabs
            collectionSlug={contractAddress}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full px-0 sm:px-4 md:px-6 lg:px-8">{renderContent()}</div>
      </div>

      {/* Mobile Bottom Navigation - Tabs */}
      <MarketplaceMobileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Card click: open MarketplaceListModal (list / edit listing) */}
      {selectedNFT ? (
        <MarketplaceListModal
          nft={selectedNFT}
          open={showSellerModal}
          onOpenChange={open => {
            setShowSellerModal(open);
            if (!open) setSelectedNFT(null);
          }}
        />
      ) : null}
    </div>
  );
}
