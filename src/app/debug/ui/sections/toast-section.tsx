"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Check, X, Info, AlertTriangle, Loader2, Heart, ShoppingCart, Wallet } from "lucide-react";

export function ToastSection() {
  return (
    <div className="space-y-8">
      {/* Basic Toasts */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Basic Toasts</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => toast("Event has been created")}
          >
            Default Toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
              })
            }
          >
            With Description
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Event has been created", {
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }
          >
            With Action
          </Button>
        </div>
      </div>

      {/* Toast Variants */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Toast Variants</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("NFT Listed Successfully", {
                description: "Your NFT is now live on the marketplace",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Transaction Failed", {
                description: "Insufficient funds in your wallet",
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.info("New Collection Available", {
                description: "Check out the latest drops",
              })
            }
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Auction Ending Soon", {
                description: "Only 5 minutes left to place your bid",
              })
            }
          >
            Warning
          </Button>
        </div>
      </div>

      {/* Toast with Icons */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Toast with Custom Icons</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast("Added to Favorites", {
                icon: <Heart className="w-4 h-4" />,
              })
            }
          >
            With Heart Icon
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Added to Cart", {
                icon: <ShoppingCart className="w-4 h-4" />,
              })
            }
          >
            With Cart Icon
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Wallet Connected", {
                icon: <Wallet className="w-4 h-4" />,
              })
            }
          >
            With Wallet Icon
          </Button>
        </div>
      </div>

      {/* Loading Toast */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Loading Toast</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              const promise = () =>
                new Promise((resolve) => setTimeout(() => resolve({ name: "Sonner" }), 2000));

              toast.promise(promise, {
                loading: "Processing transaction...",
                success: (data) => {
                  return `Transaction successful!`;
                },
                error: "Transaction failed",
              });
            }}
          >
            Promise Toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Minting NFT...", {
                icon: <Loader2 className="w-4 h-4 animate-spin" />,
              })
            }
          >
            Loading State
          </Button>
        </div>
      </div>

      {/* Toast Positions */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Toast Positions</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast("Top Left", {
                position: "top-left",
              })
            }
          >
            Top Left
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Top Center", {
                position: "top-center",
              })
            }
          >
            Top Center
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Top Right", {
                position: "top-right",
              })
            }
          >
            Top Right
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Bottom Left", {
                position: "bottom-left",
              })
            }
          >
            Bottom Left
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Bottom Center", {
                position: "bottom-center",
              })
            }
          >
            Bottom Center
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Bottom Right", {
                position: "bottom-right",
              })
            }
          >
            Bottom Right
          </Button>
        </div>
      </div>

      {/* Toast Duration */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Toast Duration</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast("Quick message", {
                duration: 1000,
              })
            }
          >
            1 Second
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Normal message", {
                duration: 3000,
              })
            }
          >
            3 Seconds
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Long message", {
                duration: 10000,
              })
            }
          >
            10 Seconds
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Persistent message", {
                duration: Infinity,
              })
            }
          >
            Infinite
          </Button>
        </div>
      </div>

      {/* NFT Marketplace Use Cases */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">NFT Marketplace Use Cases</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("NFT Purchased!", {
                description: "Cosmic Ape #1234 is now in your wallet",
                action: {
                  label: "View",
                  onClick: () => console.log("View NFT"),
                },
              })
            }
          >
            Purchase Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Offer Accepted", {
                description: "Your offer of 2.5 ETH was accepted",
                icon: <Check className="w-4 h-4" />,
              })
            }
          >
            Offer Accepted
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Bid Failed", {
                description: "Your bid is lower than the current highest bid",
                icon: <X className="w-4 h-4" />,
              })
            }
          >
            Bid Failed
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Auction Ending", {
                description: "Only 2 minutes remaining",
                icon: <AlertTriangle className="w-4 h-4" />,
              })
            }
          >
            Auction Warning
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const promise = () =>
                new Promise((resolve) => setTimeout(() => resolve({}), 3000));

              toast.promise(promise, {
                loading: "Minting your NFT...",
                success: "NFT Minted Successfully! 🎉",
                error: "Minting failed. Please try again.",
              });
            }}
          >
            Mint NFT
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const promise = () =>
                new Promise((resolve) => setTimeout(() => resolve({}), 2000));

              toast.promise(promise, {
                loading: "Listing NFT on marketplace...",
                success: "NFT Listed! Ready for sale.",
                error: "Failed to list NFT.",
              });
            }}
          >
            List NFT
          </Button>
        </div>
      </div>

      {/* Rich Content Toast */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Rich Content Toast</h4>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast(
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-os-rare/20 to-os-epic/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-os-rare" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New Bid Received</p>
                    <p className="text-sm text-muted-foreground">
                      0x1234...5678 bid 3.5 ETH on your NFT
                    </p>
                  </div>
                </div>
              )
            }
          >
            Rich Content
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast(
                <div className="space-y-2">
                  <p className="font-medium">Transaction Confirmed</p>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>Hash: 0xabcd...1234</p>
                    <p>Gas: 0.0021 ETH</p>
                    <p>Block: 18,234,567</p>
                  </div>
                </div>
              )
            }
          >
            Transaction Details
          </Button>
        </div>
      </div>
    </div>
  );
}
