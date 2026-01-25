"use client";

import { useState, useMemo, useCallback, Component, ReactNode, useEffect } from "react";
import { cn } from "@/shared/utils/tailwind-utils";
import ControlBar from "@/modules/marketplace/components/ControlBar";
import NFTListView from "@/modules/marketplace/components/NFTListView";
import NFTGrid from "@/modules/marketplace/components/NFTGrid";
import FilterSidebar from "@/modules/marketplace/components/FilterSidebar";
import SellerModal from "@/modules/marketplace/components/SellerModal";
import { useNFTSelection } from "@/modules/marketplace/hooks/useNFTSelection";
// DEPRECATED: useMyItems replaced with useInfiniteMarketplaceItems
// import { useMyItems } from "@/modules/marketplace/hooks/useMyItems";
import { useInfiniteMarketplaceItems, type MarketplaceFilters } from "@/modules/marketplace/queries";
import HeroHeader from "@/modules/marketplace/components/HeroHeader";
import CollectionNav from "@/modules/marketplace/components/CollectionNav";
import BottomActionBar from "@/modules/marketplace/components/BottomActionBar";
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
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<Nft | null>(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

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

  // Use infinite query hook instead of useMyItems
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
  const safeNFTs = useMemo(() => nfts, [nfts]);

  const searchValue = searchQuery;

  const sortValue = sortBy;

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    const [min, max] = range;
    const validPriceRange: [number, number] = [
      isNaN(min) ? 0 : min,
      isNaN(max) ? Infinity : Math.max(min, max),
    ];
    setPriceRange(validPriceRange);
  }, []);

  // REMOVED: Client-side filtering/sorting - now handled server-side via query params
  // const filterAndSortNFTs = useCallback(...)
  // useEffect(() => { const filtered = filterAndSortNFTs(safeNFTs); ... })

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
    },
    []
  );

  const {
    sliderValue,
    isSliding,
    handleSliderChange,
    handleItemCountChange,
    handleIndividualSelection,
  } = useNFTSelection({
    initialNFTs: nfts,
    onVisibleNFTsChange: () => {},
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
          <div className="flex transition-all duration-300 ease-in-out h-full">
            {/* Desktop Filter Sidebar */}
            <div
              className={cn(
                "hidden md:block w-0 h-full shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
                showFilters && "w-[240px] 3xl:w-[390px]"
              )}
            >
              {showFilters && (
                <FilterSidebar
                  onClose={() => setShowFilters(false)}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onStatusChange={setStatusFilter}
                  onSortChange={setSortBy}
                  selectedTraits={selectedTraits}
                  onTraitsChange={setSelectedTraits}
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
                  selectedTraits={selectedTraits}
                  onTraitsChange={setSelectedTraits}
                  isOpen={showFilters}
                />
              </div>
            )}

            <div className="flex-1 min-h-0 transition-all duration-300 ease-in-out min-w-0 flex flex-col h-full overflow-hidden">
              <ControlBar
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

              <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-hide pb-32 md:pb-6 relative">
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
                    <NFTListView
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
                  <NFTGrid
                    type="seller"
                    nfts={nfts}
                    view={view === "compact" ? "compact" : "grid"}
                    showFilters={showFilters}
                    isSliding={isSliding}
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
    <div className="h-full min-h-0 overflow-hidden text-foreground transition-all duration-150 flex flex-col">
      {/* Hero Header - Natural height */}
      <div className="w-full shrink-0">
        <HeroHeader collection={collection} videoUrl={collection.banner} useMockData={true} />
      </div>

      {/* Collection Navigation - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block shrink-0">
        <div className="px-0 sm:px-4 md:px-6 lg:px-8">
          <CollectionNav
            collectionSlug={contractAddress}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden mb-28 md:mb-0 md:pb-12">
        <div className="h-full px-0 sm:px-4 md:px-6 lg:px-8">{renderContent()}</div>
      </div>

      {/* Mobile Bottom Navigation - Tabs */}
      <div className="md:hidden shrink-0 fixed bottom-6 left-4 right-4 z-50 rounded-2xl bg-background/98 backdrop-blur-xl backdrop-saturate-150 border border-border/80 shadow-[0_10px_35px_rgba(0,0,0,0.28)] ring-1 ring-primary/5 safe-area-bottom">
        <div className="flex items-center justify-around h-[4.25rem] px-2 py-1.5 gap-1">
          <button
            onClick={() => setActiveTab("items")}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all rounded-xl",
              activeTab === "items"
                ? "text-primary bg-primary/12 shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="text-[12px] font-semibold leading-none">Items</span>
          </button>

          <button
            onClick={() => setActiveTab("offers")}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all rounded-xl",
              activeTab === "offers"
                ? "text-primary bg-primary/12 shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-[12px] font-semibold leading-none">Offers</span>
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all rounded-xl",
              activeTab === "activity"
                ? "text-primary bg-primary/12 shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-[12px] font-semibold leading-none">Activity</span>
          </button>

          <button
            onClick={() => setActiveTab("holders")}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all rounded-xl",
              activeTab === "holders"
                ? "text-primary bg-primary/12 shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-[12px] font-semibold leading-none">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
