"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, Trash2, ShoppingCart, Heart, LogOut } from "lucide-react";

export function AlertDialogSection() {
  return (
    <div className="space-y-8">
      {/* Basic Alert Dialog */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Basic Alert Dialog</h4>
        <div className="flex flex-wrap gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Open Alert</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Destructive Actions */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Destructive Actions</h4>
        <div className="flex flex-wrap gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete NFT
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Delete NFT Listing
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this NFT listing? This action cannot be undone and
                  your NFT will be removed from the marketplace immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Listing
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect Wallet
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Wallet?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be logged out and need to reconnect your wallet to continue using the
                  marketplace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay Connected</AlertDialogCancel>
                <AlertDialogAction>Disconnect</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Confirmation Dialogs</h4>
        <div className="flex flex-wrap gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Purchase NFT
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-3 mt-2">
                    <div className="p-3 rounded-md bg-frosted-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">NFT:</span>
                        <span className="font-medium">Cosmic Ape #1234</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">2.5 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Gas Fee:</span>
                        <span className="font-medium">0.0021 ETH</span>
                      </div>
                    </div>
                    <p className="text-sm">
                      You are about to purchase this NFT. Make sure you have reviewed all details
                      before confirming.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm Purchase</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                Make Offer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Offer</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-3 mt-2">
                    <div className="p-3 rounded-md bg-frosted-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Your Offer:</span>
                        <span className="font-medium text-lg">1.8 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Floor Price:</span>
                        <span className="font-medium">2.5 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Difference:</span>
                        <span className="font-medium text-os-warning">-28%</span>
                      </div>
                    </div>
                    <p className="text-sm">
                      Your offer is below the floor price. The seller may not accept it.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Submit Offer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Information Dialogs */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Information Dialogs</h4>
        <div className="flex flex-wrap gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Terms of Service</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Terms of Service</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    <p className="text-sm">
                      By using our NFT marketplace, you agree to the following terms:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>You must be 18 years or older to use this platform</li>
                      <li>All transactions are final and cannot be reversed</li>
                      <li>You are responsible for the security of your wallet</li>
                      <li>We do not store your private keys</li>
                      <li>Gas fees are non-refundable</li>
                      <li>NFT ownership is transferred on-chain</li>
                    </ul>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>I Understand</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Transaction Details</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Transaction Information</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-2 mt-2">
                    <div className="p-3 rounded-md bg-frosted-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium text-os-success">Confirmed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hash:</span>
                        <span className="font-mono text-xs">0xabcd...1234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Block:</span>
                        <span className="font-medium">18,234,567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Used:</span>
                        <span className="font-medium">0.0021 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timestamp:</span>
                        <span className="font-medium">2 mins ago</span>
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Close</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* NFT Marketplace Scenarios */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">NFT Marketplace Scenarios</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Cancel Auction
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Auction?</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-3 mt-2">
                    <p className="text-sm">
                      This auction has 3 active bids. Canceling will:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Refund all bidders automatically</li>
                      <li>Remove your NFT from the marketplace</li>
                      <li>Cost you gas fees (~0.002 ETH)</li>
                    </ul>
                    <div className="p-3 rounded-md bg-frosted-2 text-sm">
                      <p className="text-muted-foreground">Highest Bid:</p>
                      <p className="font-medium text-lg mt-1">3.2 ETH</p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Auction</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Cancel Auction
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Accept Offer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept Offer?</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-3 mt-2">
                    <div className="p-3 rounded-md bg-frosted-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Offer Amount:</span>
                        <span className="font-medium text-lg">2.8 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Marketplace Fee (2.5%):</span>
                        <span className="font-medium">0.07 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Creator Royalty (5%):</span>
                        <span className="font-medium">0.14 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2 pt-2 border-t border-border-subtle">
                        <span className="text-muted-foreground font-medium">You&apos;ll Receive:</span>
                        <span className="font-bold text-lg text-os-success">2.59 ETH</span>
                      </div>
                    </div>
                    <p className="text-sm">
                      Once accepted, the NFT will be transferred immediately and the transaction
                      cannot be reversed.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Decline</AlertDialogCancel>
                <AlertDialogAction>Accept Offer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Transfer NFT
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-os-warning" />
                  Transfer NFT
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-3 mt-2">
                    <p className="text-sm font-medium text-foreground">
                      ⚠️ Important: Double-check the recipient address
                    </p>
                    <div className="p-3 rounded-md bg-frosted-2 text-sm">
                      <p className="text-muted-foreground">Sending to:</p>
                      <p className="font-mono text-xs mt-1 break-all">
                        0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                      </p>
                    </div>
                    <p className="text-sm text-os-warning">
                      This action is permanent and cannot be undone. Make sure the address is
                      correct before confirming.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm Transfer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Burn NFT
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Burn NFT Forever
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-3 mt-2">
                    <p className="text-sm font-medium text-foreground">
                      ⚠️ This action is PERMANENT and IRREVERSIBLE
                    </p>
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">
                        Your NFT will be sent to a burn address (0x000...dead) and will be
                        permanently destroyed. This cannot be undone under any circumstances.
                      </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>The NFT will be removed from circulation forever</li>
                      <li>You will not receive any compensation</li>
                      <li>This may increase rarity of remaining collection items</li>
                    </ul>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  I Understand, Burn NFT
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
