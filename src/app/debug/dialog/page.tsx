"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Trash2, Settings, UserPlus, FileEdit, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export default function DialogDebugPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Page Header */}
      <div className="mx-auto max-w-6xl space-y-2 mb-10">
        <Link
          href="/debug"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Debug Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-os-gray-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-os-info" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Dialog & Alert Dialog
            </h1>
            <p className="text-muted-foreground">
              Modal dialogs and alert confirmations with animations and accessibility
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Basic Dialogs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Basic Dialogs</h2>
            <Badge variant="secondary">Core</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Standard dialog patterns for common use cases.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Simple Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Simple Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a basic dialog with a title and description.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Dialog content goes here. You can add any React components.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Continue</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* With Form */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">With Form</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Without Close Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">No Close Button</Button>
              </DialogTrigger>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Confirmation Required</DialogTitle>
                  <DialogDescription>
                    This dialog has no close button. You must choose an action.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    This pattern is useful for critical confirmations.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Go Back</Button>
                  <Button>Proceed</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Large Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Large Dialog</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Large Dialog</DialogTitle>
                  <DialogDescription>
                    A wider dialog for more content.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This dialog uses the max-w-xl class for wider content.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
                      <p className="text-sm font-medium">Feature 1</p>
                      <p className="text-xs text-muted-foreground mt-1">Description</p>
                    </div>
                    <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
                      <p className="text-sm font-medium">Feature 2</p>
                      <p className="text-xs text-muted-foreground mt-1">Description</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Alert Dialogs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Alert Dialogs</h2>
            <Badge variant="secondary">Confirmation</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Alert dialogs for critical confirmations and destructive actions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Destructive Alert */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Item
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Confirmation Alert */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Reset Settings
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Settings?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all settings to their default values. You will lose
                    any custom configurations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Success Alert */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Action
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Action Completed</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your action has been completed successfully. The changes have been
                    applied.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Warning Alert */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Warning
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Warning</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action may have unintended consequences. Please review before
                    proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-os-warning text-black hover:bg-os-warning/90">
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        {/* NFT Marketplace Examples */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">NFT Marketplace Examples</h2>
            <Badge variant="secondary">Real-world</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Common dialog patterns for NFT marketplace interfaces.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Place Bid Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Place Bid Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Place a Bid</DialogTitle>
                  <DialogDescription>
                    Enter your bid amount for CryptoPunk #7823
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-frosted-1">
                    <span className="text-sm text-muted-foreground">Current Bid</span>
                    <span className="font-medium">2.5 ETH</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bid">Your Bid (ETH)</Label>
                    <Input id="bid" type="number" step="0.01" placeholder="2.6" />
                    <p className="text-xs text-muted-foreground">
                      Minimum bid increment: 0.1 ETH
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee (2.5%)</span>
                    <span>0.065 ETH</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Total</span>
                    <span>2.665 ETH</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Place Bid</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Connect Wallet Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">Connect Wallet</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Wallet</DialogTitle>
                  <DialogDescription>
                    Choose a wallet to connect to the marketplace
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  {["MetaMask", "WalletConnect", "Coinbase Wallet", "Phantom"].map((wallet) => (
                    <button
                      key={wallet}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border-subtle bg-frosted-1 hover:bg-os-gray-400 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-primary/50 to-primary/20" />
                      <span className="font-medium">{wallet}</span>
                    </button>
                  ))}
                </div>
                <DialogFooter>
                  <p className="text-xs text-muted-foreground text-center w-full">
                    By connecting, you agree to the Terms of Service
                  </p>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Dialog Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Dialog Features</h2>
            <Badge variant="secondary">Advanced</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Advanced dialog patterns and configurations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Custom Styled */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Frosted Glass</Button>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>Frosted Glass Effect</DialogTitle>
                  <DialogDescription>
                    Dialog with enhanced backdrop blur effect.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    This dialog uses backdrop-blur for a frosted glass appearance.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Nested Content */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Rich Content</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>NFT Details</DialogTitle>
                  <DialogDescription>
                    Detailed information about the selected NFT
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shrink-0" />
                    <div>
                      <h4 className="font-medium">Bored Ape #1234</h4>
                      <p className="text-sm text-muted-foreground">BAYC Collection</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="rare">Rare</Badge>
                        <Badge variant="success">Verified</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-frosted-1">
                      <p className="text-muted-foreground">Owner</p>
                      <p className="font-medium">0x1234...5678</p>
                    </div>
                    <div className="p-2 rounded bg-frosted-1">
                      <p className="text-muted-foreground">Token ID</p>
                      <p className="font-medium">#1234</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">View on Etherscan</Button>
                  <Button>Make Offer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Form Validation */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-invite">Email Address</Label>
                    <Input id="email-invite" type="email" placeholder="colleague@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select className="w-full h-9 px-3 rounded-md border border-border-subtle bg-background text-sm">
                      <option>Viewer</option>
                      <option>Editor</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Accessibility Info */}
        <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Accessibility Features
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Focus trap keeps keyboard navigation within the dialog</li>
            <li>• ESC key closes the dialog (except Alert Dialogs)</li>
            <li>• Clicking outside closes the dialog</li>
            <li>• ARIA attributes for screen reader support</li>
            <li>• Smooth animations for open/close states</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
