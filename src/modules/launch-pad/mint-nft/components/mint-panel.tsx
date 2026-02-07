"use client";

import type React from "react";
import Image from "next/image";

import MintStatus from "@/modules/launch-pad/mint-nft/components/mint-status";
import MintForm from "@/modules/launch-pad/mint-nft/components/mint-form";
import MintSocialLinks from "@/modules/launch-pad/mint-nft/components/mint-social-links";
import MintStagesList from "@/modules/launch-pad/mint-nft/components/mint-stages-list";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";

interface MintPanelProps {
  currentGalleryImage?: string;
}

export default function MintPanel({ currentGalleryImage }: MintPanelProps) {
  const {
    collection,
    isConnected,
    isSameArtType,
    activeTab,
    setActiveTab,
    mintCostData,
    lastMintCost,
    nftsData,
    amount,
    showConfirmModal,
    setShowConfirmModal,
    isMintingNft,
    isLoading,
    submitMint,
  } = useMintState();

  // Check if history tab should be shown
  const hasHistoryData = nftsData?.getNfts?.nfts && nftsData.getNfts.nfts.length > 0;
  const shouldShowHistoryTab = isConnected && (hasHistoryData || activeTab === "history");

  return (
    <div className="space-y-4 lg:sticky lg:top-20 lg:z-10 lg:max-h-[90vh] lg:overflow-y-auto self-start bg-[#1a1a1a] text-foreground h-full p-4 rounded-xl border border-white/[0.08]">
      <Tabs defaultValue="mint" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        {shouldShowHistoryTab && (
          <TabsList
            className="grid w-full mb-4 bg-[#252525] border border-white/[0.08] grid-cols-2"
          >
            <TabsTrigger
              value="mint"
              className="data-[state=active]:bg-[#ff1a75] data-[state=active]:text-white text-sm"
            >
              Mint
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#ff1a75] data-[state=active]:text-white text-sm"
            >
              History
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="mint" className="space-y-4 mint-panel" data-mint-panel>
          {/* Top Section: Social Links (Desktop only) */}
          <MintSocialLinks />

          {/* Main Box: Status & Form */}
          <div className="flex flex-col gap-y-4">
            <MintStatus />

            <div className="bg-[#252525] p-4 rounded-lg space-y-4 border border-white/[0.08]">
              <MintForm />
            </div>
          </div>

          {/* Previous Stages List */}
          <MintStagesList />
        </TabsContent>

        {shouldShowHistoryTab && (
          <TabsContent value="history" className="space-y-4">
            <div className="bg-background border-border-subtle dark:bg-muted rounded-[8px] p-6 border dark:border-border-subtle shadow-os-sm">
              <h2 className="text-xl font-medium font-sans text-foreground dark:text-foreground mb-4">
                Mint History
              </h2>

              <ScrollArea className="h-[600px]">
                <div className="text-center py-12">
                  {!hasHistoryData ? (
                    <>
                      <p className="text-os-gray-300 dark:text-os-gray-300 text-sm">
                        No minted NFTs found
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 h-10 text-sm border-border-subtle dark:border-border-subtle"
                        onClick={() => setActiveTab("mint")}
                      >
                        Mint Your First NFT
                      </Button>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {nftsData?.getNfts?.nfts?.map(
                        (nft: {
                          id: string;
                          image?: string;
                          name?: string;
                          tokenId: string | number;
                          description?: string;
                          status?: string;
                        }) => (
                          <div
                            key={nft.id}
                            className="bg-secondary dark:bg-dialog rounded-[8px] border border-border-subtle dark:border-border-subtle overflow-hidden flex flex-col"
                          >
                            <div className="relative aspect-square w-full bg-muted dark:bg-muted">
                              {nft.image && (
                                <Image
                                  src={nft.image || "/placeholder.svg"}
                                  alt={nft.name || `NFT #${nft.tokenId}`}
                                  fill
                                  className="object-cover"
                                />
                              )}
                              <div className="absolute top-2 right-2">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full font-medium ${nft.status === "COMPLETED"
                                    ? "bg-success/10 text-success dark:bg-success/10 dark:text-success"
                                    : "bg-warning/10 text-warning dark:bg-warning/10 dark:text-warning"
                                    }`}
                                >
                                  {nft.status}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium text-foreground dark:text-foreground text-sm truncate">
                                  {nft.name || `NFT #${nft.tokenId}`}
                                </h3>
                                <span className="text-xs text-os-gray-300 dark:text-os-gray-300 ml-1 whitespace-nowrap">
                                  #{nft.tokenId}
                                </span>
                              </div>
                              {nft.description && (
                                <p className="text-xs text-os-gray-300 dark:text-os-gray-300 line-clamp-2 mb-2">
                                  {nft.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent
          className="bg-background border-border-subtle dark:bg-muted dark:border-border-subtle"
          onInteractOutside={e => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-foreground">Confirm Mint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-foreground dark:text-foreground">
              You are about to mint{" "}
              <span className="font-medium">
                {amount} NFT{amount > 1 ? "s" : ""}
              </span>{" "}
              from
              <span className="font-medium"> {collection?.name}</span>.
            </p>
            <div className="bg-secondary dark:bg-dialog p-4 rounded-[6px] border border-border-subtle dark:border-border-subtle">
              <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
                <span className="font-medium">Total Cost:</span>{" "}
                {mintCostData?.getMintCost?.success
                  ? `${mintCostData.getMintCost.totalPrice} ETH`
                  : `${lastMintCost.totalPrice} ETH`}
              </p>
              <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
                <span className="font-medium">Estimated Gas:</span>{" "}
                {mintCostData?.getMintCost?.success
                  ? `${mintCostData.getMintCost.estimatedGas} ETH`
                  : `${lastMintCost.estimatedGas} ETH`}
              </p>
              {!isSameArtType && (
                <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
                  <span className="font-medium">Batch Mint:</span> Potentially multiple NFTs if
                  batch provided
                </p>
              )}
            </div>
            <p className="text-sm text-os-gray-300 dark:text-os-gray-300">
              Please ensure your wallet has sufficient funds. This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="border-border-subtle text-foreground hover:bg-muted dark:border-border-subtle dark:text-foreground dark:hover:bg-hover"
            >
              Cancel
            </Button>
            <Button
              onClick={submitMint}
              disabled={isMintingNft || isLoading}
              className="bg-primary hover:bg-primary/90 text-foreground dark:bg-primary dark:hover:bg-primary/90"
            >
              {isMintingNft || isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isMintingNft || isLoading ? "Calculating..." : "Confirm Mint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
