import React, { useState } from "react";
import Image from "next/image";
import { ResponsiveDialogDrawer } from "@/shared/components/responsive-dialog-drawer";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Nft, NftStatus } from "@/modules/marketplace/types";

interface MarketplaceListModalProps {
  nft: Nft;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MarketplaceListModal({ nft, open, onOpenChange }: MarketplaceListModalProps) {
  const [listPrice, setListPrice] = useState(nft.listPrice || "0.1");
  const [duration, setDuration] = useState("7");

  const handleList = () => {
    console.log("Listing NFT:", nft.id, "at price:", listPrice, "for days:", duration);
    // Mock listing logic
    onOpenChange(false);
  };

  const handleCancel = () => {
    console.log("Cancelling listing for NFT:", nft.id);
    // Mock cancel logic
    onOpenChange(false);
  };

  return (
    <ResponsiveDialogDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Manage NFT"
      description={nft.status === NftStatus.Listed ? "Manage your listed NFT" : "List your NFT for sale"}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {nft.status !== NftStatus.Listed && <Button onClick={handleList}>List for Sale</Button>}
        </>
      }
    >
      <div className="grid gap-4">
          {/* NFT Preview */}
          <div className="flex gap-4">
            <div className="relative h-24 w-24 rounded-[8px] overflow-hidden">
              {nft.image && <Image src={nft.image} alt={nft.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <h3 className="font-medium font-sans text-lg">{nft.name}</h3>
              <p className="text-sm text-os-gray-300">#{nft.tokenId}</p>
              <Badge
                variant={nft.status === NftStatus.Listed ? "default" : "secondary"}
                className="mt-2"
              >
                {nft.status === NftStatus.Listed ? "Listed" : "Not Listed"}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List NFT</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {nft.status === NftStatus.Listed ? (
                <div className="space-y-4">
                  <div>
                    <Label>Current Price</Label>
                    <p className="text-2xl font-bold">{nft.listPrice} ETH</p>
                  </div>
                  <Button onClick={handleCancel} variant="destructive" className="w-full">
                    Cancel Listing
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="price">List Price (ETH)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.001"
                      value={listPrice}
                      onChange={e => setListPrice(e.target.value)}
                      placeholder="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      placeholder="7"
                    />
                  </div>

                  <div className="rounded-[8px] bg-muted p-4">
                    <h4 className="font-medium mb-2">Listing Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>List Price:</span>
                        <span className="font-medium">{listPrice} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee (2.5%):</span>
                        <span className="font-medium">
                          {(parseFloat(listPrice) * 0.025).toFixed(4)} ETH
                        </span>
                      </div>
                      <div className="flex justify-between font-medium font-sans pt-2 border-t">
                        <span>You Receive:</span>
                        <span>{(parseFloat(listPrice) * 0.975).toFixed(4)} ETH</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-3">
                {nft.attributes?.map((attr, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span className="text-os-gray-300">{attr.trait_type}</span>
                    <span className="font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
    </ResponsiveDialogDrawer>
  );
}
