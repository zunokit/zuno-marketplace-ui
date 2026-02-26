"use client";

import MarketplaceNFTGrid from "@/modules/marketplace/components/marketplace-nft-grid";
import { ActivityList } from "@/modules/profile/components/activity-list";
import { type UserProfile, type ProfileTab } from "@/shared/types/profile";
import { type Nft, NftStatus } from "@/modules/marketplace/types";
import { mockUserActivities } from "@/shared/utils/mock/profile";
import { Package, Heart, Activity, Tag, Grid3x3 } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";

interface ProfileTabsProps {
  profile: UserProfile;
  activeTab?: ProfileTab;
  onTabChange?: (tab: ProfileTab) => void;
}

export function ProfileTabs({ profile, activeTab = "collected", onTabChange }: ProfileTabsProps) {
  const tabs = [
    { value: "collected" as const, label: "Collected", icon: Grid3x3, count: profile.stats.nftsOwned },
    { value: "created" as const, label: "Created", icon: Package, count: profile.stats.nftsCreated },
    { value: "favorites" as const, label: "Favorites", icon: Heart, count: 42 },
    { value: "activity" as const, label: "Activity", icon: Activity, count: mockUserActivities.length },
    { value: "offers" as const, label: "Offers", icon: Tag, count: 5 },
  ];

  const generateMockNft = (index: number): Nft => ({
    id: `nft-${index}`,
    tokenId: `${index}`,
    name: `NFT #${index}`,
    description: `This is NFT number ${index}`,
    image: `https://picsum.photos/400/400?random=${index}`,
    contractAddress: "0x1234567890123456789012345678901234567890",
    chainId: "1",
    owner: profile.address,
    creator: "0x0987654321098765432109876543210987654321",
    status: index % 3 === 0 ? NftStatus.Listed : NftStatus.NotListed,
    mintPrice: (0.01 + Math.random() * 0.09).toFixed(3),
    listPrice: index % 3 === 0 ? (0.02 + Math.random() * 0.08).toFixed(3) : undefined,
    attributes: [
      { trait_type: "Background", value: ["Blue", "Red", "Green", "Purple"][index % 4] },
      { trait_type: "Rarity", value: ["Common", "Uncommon", "Rare", "Epic"][index % 4] },
    ],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const collectedNFTs = Array.from({ length: 12 }, (_, i) => generateMockNft(i + 1));
  const createdNFTs = Array.from({ length: 8 }, (_, i) => generateMockNft(i + 13));
  const favoriteNFTs = Array.from({ length: 8 }, (_, i) => generateMockNft(i + 21));

  const renderContent = () => {
    switch (activeTab) {
      case "collected":
        return (
          <MarketplaceNFTGrid type="seller" nfts={collectedNFTs} view="grid" showFilters={false} isSliding={false} onSelect={() => {}} onCardClick={() => {}} selectedNFTs={[]} />
        );
      case "created":
        return (
          <MarketplaceNFTGrid type="seller" nfts={createdNFTs} view="grid" showFilters={false} isSliding={false} onSelect={() => {}} onCardClick={() => {}} selectedNFTs={[]} />
        );
      case "favorites":
        return (
          <MarketplaceNFTGrid type="seller" nfts={favoriteNFTs} view="grid" showFilters={false} isSliding={false} onSelect={() => {}} onCardClick={() => {}} selectedNFTs={[]} />
        );
      case "activity":
        return <ActivityList activities={mockUserActivities} />;
      case "offers":
        return (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No active offers</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6">
      {/* Tab bar - ME/OS underline style */}
      <div className="flex items-center gap-0 border-b border-border overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => onTabChange?.(tab.value)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap shrink-0",
              activeTab === tab.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            <span>{tab.label}</span>
            <span className="text-xs text-muted-foreground">({tab.count})</span>
            {activeTab === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-500 rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}
