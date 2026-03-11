"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Heart,
  Share2,
  ExternalLink,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Tag,
  History,
  Grid3x3,
  FileText,
  Link2,
} from "lucide-react";
import { type NFTDetail } from "@/shared/types/nft-detail";
import { NFTHistory } from "@/modules/nft-detail/components/nft-history";
import { NFTOffers } from "@/modules/nft-detail/components/nft-offers";
import { NFTAttributes } from "@/modules/nft-detail/components/nft-attributes";
import { cn } from "@/shared/utils/tailwind-utils";

interface NFTDetailViewProps {
  nft: NFTDetail;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-border/20 rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-muted/10 transition-colors h-auto font-normal"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-[13px]">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/50" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50" />
        )}
      </Button>
      {isOpen && <div className="px-3 pb-3 border-t border-border/20">{children}</div>}
    </div>
  );
}

export function NFTDetailView({ nft }: NFTDetailViewProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<"details" | "orders" | "activity">(
    "details"
  );

  const handleBuyNow = () => {
    console.log("Buy NFT:", nft.id);
  };

  const handleMakeOffer = () => {
    console.log("Make offer for:", nft.id);
  };

  const detailTabs: Array<{ value: "details" | "orders" | "activity"; label: string }> = [
    { value: "details", label: "Details" },
    { value: "orders", label: "Orders" },
    { value: "activity", label: "Activity" },
  ];

  return (
    <div className="mx-auto py-3 sm:py-4">
      {/* Main 50/50 split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left Column - Image */}
        <div className="space-y-0">
          <div className="relative aspect-square rounded-lg overflow-hidden border border-border/20 bg-muted/10">
            <Image src={nft.image} alt={nft.name} fill className="object-cover" priority />

            {/* Overlay actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors h-auto w-auto"
              >
                <Heart
                  className={cn("h-4 w-4", isLiked && "fill-destructive text-destructive")}
                />
              </Button>
              <Button variant="ghost" size="icon" className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors h-auto w-auto">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute bottom-3 left-3">
              <Badge
                variant="secondary"
                className="bg-black/50 text-white backdrop-blur-sm border-0"
              >
                <Eye className="h-3 w-3 mr-1" />
                {nft.views}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col gap-3">
          {/* Price section */}
          <div>
            {nft.status === "available" && (
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium mb-0.5">
                Buy for
              </p>
            )}
            <span className="text-2xl font-bold tracking-tight">
              {nft.price} {nft.currency}
            </span>
          </div>

          {/* Buy / Offer buttons */}
          {nft.status === "available" && (
            <div className="flex gap-2">
              <Button className="flex-1 h-10 text-[13px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg" onClick={handleBuyNow}>
                Buy now
              </Button>
              <Button variant="outline" className="flex-1 h-10 text-[13px] font-semibold rounded-lg border-border/30" onClick={handleMakeOffer}>
                Make Offer
              </Button>
            </div>
          )}

          {/* Detail tabs - like OS */}
          <div className="flex items-center gap-0 border-b border-border mt-2">
            {detailTabs.map(tab => (
              <Button
                key={tab.value}
                variant="ghost"
                size="sm"
                onClick={() => setActiveDetailTab(tab.value)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-colors h-auto rounded-none",
                  activeDetailTab === tab.value
                    ? "text-foreground shadow-[inset_0_-2px_0_0_hsl(var(--primary))]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            {activeDetailTab === "details" && (
              <>
                {/* Traits section */}
                <CollapsibleSection
                  title={`Traits ${nft.attributes?.length || 0}`}
                  icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
                  defaultOpen={true}
                >
                  <div className="pt-3">
                    <NFTAttributes attributes={nft.attributes || []} />
                  </div>
                </CollapsibleSection>

                {/* About */}
                <CollapsibleSection
                  title="About"
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                >
                  <div className="pt-3 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {nft.collection.name}
                        {nft.collection.verified && " ✓"}
                      </Badge>
                      {nft.rarity && (
                        <Badge variant="secondary" className="text-xs">
                          Rank #{nft.rarity.rank}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {nft.metadata.description || "No description available"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Owned by{" "}
                      <span className="text-foreground font-medium">
                        {nft.owner.name || nft.owner.address.slice(0, 8)}
                      </span>
                    </p>
                  </div>
                </CollapsibleSection>

                {/* Blockchain details */}
                <CollapsibleSection
                  title="Blockchain details"
                  icon={<Link2 className="h-4 w-4 text-muted-foreground" />}
                >
                  <div className="pt-3 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract Address</span>
                      <a
                        href={`https://etherscan.io/address/${nft.blockchain.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 font-mono text-xs"
                      >
                        {nft.blockchain.contractAddress.slice(0, 6)}...
                        {nft.blockchain.contractAddress.slice(-4)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token ID</span>
                      <span className="font-mono text-xs">{nft.blockchain.tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Standard</span>
                      <span className="text-xs">{nft.blockchain.tokenStandard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chain</span>
                      <span className="text-xs">{nft.blockchain.chain}</span>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* More from collection */}
                {nft.moreFromCollection.length > 0 && (
                  <CollapsibleSection
                    title="More from this collection"
                    icon={<Grid3x3 className="h-4 w-4 text-muted-foreground" />}
                  >
                    <div className="pt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {nft.moreFromCollection.slice(0, 8).map(item => (
                        <div
                          key={item.id}
                          className="cursor-pointer group/item rounded-lg overflow-hidden border border-border hover:border-border/80 transition-colors"
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover/item:scale-105 transition-transform duration-200"
                              sizes="120px"
                            />
                          </div>
                          <div className="p-1.5">
                            <p className="text-[11px] font-medium truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {item.price} {item.currency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}
              </>
            )}

            {activeDetailTab === "orders" && (
              <div className="pt-2">
                <NFTOffers offers={nft.offers} currentPrice={nft.price} />
              </div>
            )}

            {activeDetailTab === "activity" && (
              <div className="pt-2">
                <NFTHistory activities={nft.history} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
