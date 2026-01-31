"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, CheckCircle, Info, XCircle, AlertOctagon, Terminal, Bell } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/alert";

export default function AlertDebugPage() {
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
            <AlertTriangle className="w-5 h-5 text-os-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Alert Component
            </h1>
            <p className="text-muted-foreground">
              Alert messages, notifications, and feedback components
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Alert Variants */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Alert Variants</h2>
            <Badge variant="secondary">6 variants</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Different alert styles for various message types and contexts.
          </p>

          <div className="space-y-4">
            {/* Default Alert */}
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>
                This is a default alert with neutral styling. Use for general information.
              </AlertDescription>
            </Alert>

            {/* Info Alert */}
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This alert provides helpful information with blue styling and glow effect.
              </AlertDescription>
            </Alert>

            {/* Success Alert */}
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your action was completed successfully. The changes have been saved.
              </AlertDescription>
            </Alert>

            {/* Warning Alert */}
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Please review your input before proceeding. Some fields may need attention.
              </AlertDescription>
            </Alert>

            {/* Destructive Alert */}
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. Please try again or contact support if the problem persists.
              </AlertDescription>
            </Alert>

            {/* Frosted Alert */}
            <Alert variant="frosted">
              <Bell className="h-4 w-4" />
              <AlertTitle>Frosted Glass</AlertTitle>
              <AlertDescription>
                This alert uses a frosted glass effect with backdrop blur for overlay contexts.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Compact Alerts */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Compact Alerts</h2>
            <Badge variant="secondary">Inline</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Smaller alert patterns for inline usage within forms or cards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert className="py-2">
              <Info className="h-4 w-4" />
              <AlertDescription>Quick tip: Use keyboard shortcuts for faster navigation.</AlertDescription>
            </Alert>

            <Alert variant="success" className="py-2">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Changes saved automatically.</AlertDescription>
            </Alert>

            <Alert variant="warning" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Session expires in 5 minutes.</AlertDescription>
            </Alert>

            <Alert variant="destructive" className="py-2">
              <XCircle className="h-4 w-4" />
              <AlertDescription>Failed to connect to wallet.</AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Alerts with Actions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Alerts with Actions</h2>
            <Badge variant="secondary">Interactive</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Alerts that include action buttons for user interaction.
          </p>

          <div className="space-y-4">
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <div className="flex-1">
                <AlertTitle>Update Available</AlertTitle>
                <AlertDescription>
                  A new version of the app is available. Update now to get the latest features.
                </AlertDescription>
                <div className="mt-3 flex gap-2">
                  <Button size="sm">Update Now</Button>
                  <Button size="sm" variant="outline">Later</Button>
                </div>
              </div>
            </Alert>

            <Alert variant="warning">
              <AlertOctagon className="h-4 w-4" />
              <div className="flex-1">
                <AlertTitle>Unsaved Changes</AlertTitle>
                <AlertDescription>
                  You have unsaved changes. Do you want to save them before leaving?
                </AlertDescription>
                <div className="mt-3 flex gap-2">
                  <Button size="sm">Save</Button>
                  <Button size="sm" variant="outline">Discard</Button>
                  <Button size="sm" variant="ghost">Cancel</Button>
                </div>
              </div>
            </Alert>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <div className="flex-1">
                <AlertTitle>Connection Lost</AlertTitle>
                <AlertDescription>
                  Unable to connect to the blockchain network. Check your internet connection.
                </AlertDescription>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">Retry</Button>
                  <Button size="sm" variant="ghost">Learn More</Button>
                </div>
              </div>
            </Alert>
          </div>
        </section>

        {/* NFT Marketplace Examples */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">NFT Marketplace Alerts</h2>
            <Badge variant="secondary">Real-world</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Common alert patterns for NFT marketplace use cases.
          </p>

          <div className="space-y-4">
            {/* Transaction Pending */}
            <Alert variant="info">
              <Info className="h-4 w-4 animate-pulse" />
              <AlertTitle>Transaction Pending</AlertTitle>
              <AlertDescription>
                Your transaction is being processed on the blockchain. This may take a few minutes.
                <div className="mt-2 text-xs text-os-info font-mono">
                  Hash: 0x7a8f...3e2d
                </div>
              </AlertDescription>
            </Alert>

            {/* Bid Accepted */}
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Bid Accepted!</AlertTitle>
              <AlertDescription>
                Congratulations! Your bid of 2.5 ETH for CryptoPunk #7823 has been accepted.
                <div className="mt-2">
                  <Button size="sm">View Transaction</Button>
                </div>
              </AlertDescription>
            </Alert>

            {/* Gas Price Warning */}
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>High Gas Prices</AlertTitle>
              <AlertDescription>
                Current gas prices are high (45 Gwei). Consider waiting for prices to decrease.
                <div className="mt-2 text-xs">
                  Estimated cost: ~$25.50
                </div>
              </AlertDescription>
            </Alert>

            {/* Insufficient Funds */}
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Insufficient Funds</AlertTitle>
              <AlertDescription>
                You don&apos;t have enough ETH to complete this transaction. Required: 2.5 ETH, Available: 1.8 ETH.
                <div className="mt-2">
                  <Button size="sm" variant="outline">Add Funds</Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Alert Positions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Alert with Dismiss</h2>
            <Badge variant="secondary">Dismissible</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Alerts that can be dismissed by the user.
          </p>

          <div className="relative">
            <Alert variant="info" className="pr-12">
              <Info className="h-4 w-4" />
              <AlertTitle>Dismissible Alert</AlertTitle>
              <AlertDescription>
                This alert includes a dismiss button in the top-right corner.
              </AlertDescription>
              <button className="absolute top-4 right-4 p-1 rounded hover:bg-white/10 transition-colors">
                <XCircle className="h-4 w-4" />
              </button>
            </Alert>
          </div>

          <div className="relative">
            <Alert variant="success" className="pr-12">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your profile has been updated successfully.
              </AlertDescription>
              <button className="absolute top-4 right-4 p-1 rounded hover:bg-white/10 transition-colors">
                <XCircle className="h-4 w-4" />
              </button>
            </Alert>
          </div>
        </section>

        {/* Stacked Alerts */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Stacked Alerts</h2>
            <Badge variant="secondary">Toast-like</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Multiple alerts stacked together, similar to toast notifications.
          </p>

          <div className="space-y-2">
            <Alert variant="success" className="shadow-lg">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Item listed successfully</AlertDescription>
            </Alert>
            <Alert variant="info" className="shadow-lg">
              <Info className="h-4 w-4" />
              <AlertDescription>New bid received on your item</AlertDescription>
            </Alert>
            <Alert variant="warning" className="shadow-lg">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Price dropped on watched item</AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Alert in Context */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">Alert in Context</h2>
            <Badge variant="secondary">Form Example</Badge>
          </div>

          <div className="p-6 rounded-lg border border-border-subtle bg-frosted-1">
            <h3 className="font-medium mb-4">Create Listing</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Price (ETH)</label>
                <input
                  type="number"
                  className="w-full h-9 px-3 rounded-md border border-border-subtle bg-background"
                  placeholder="0.00"
                />
              </div>
              <Alert variant="info" className="py-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Listing fee: 0.01 ETH. You&apos;ll receive 97.5% of the sale price.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Listing</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <div className="p-4 rounded-lg bg-frosted-1 border border-border-subtle">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Alert Usage Guidelines
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Use <strong>info</strong> for general information and tips</li>
            <li>• Use <strong>success</strong> for completed actions and confirmations</li>
            <li>• Use <strong>warning</strong> for cautionary messages that need attention</li>
            <li>• Use <strong>destructive</strong> for errors and critical issues</li>
            <li>• Use <strong>frosted</strong> for overlay panels and floating notifications</li>
            <li>• All alerts include proper ARIA attributes for accessibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
