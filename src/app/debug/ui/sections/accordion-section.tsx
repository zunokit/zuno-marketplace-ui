"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

export function AccordionSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Single Mode</h4>
        <Accordion type="single" collapsible className="max-w-2xl">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is an NFT?</AccordionTrigger>
            <AccordionContent>
              NFT stands for Non-Fungible Token. It&apos;s a unique digital asset that represents ownership of a specific item or piece of content.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I buy an NFT?</AccordionTrigger>
            <AccordionContent>
              Connect your wallet, browse the marketplace, and click &quot;Buy Now&quot; on any NFT you&apos;d like to purchase.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What wallets are supported?</AccordionTrigger>
            <AccordionContent>
              We support MetaMask, WalletConnect, Coinbase Wallet, and other popular Web3 wallets.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Multiple Mode</h4>
        <Accordion type="multiple" className="max-w-2xl">
          <AccordionItem value="item-1">
            <AccordionTrigger>Blockchain Networks</AccordionTrigger>
            <AccordionContent>
              We support Ethereum, Polygon, Base, and Arbitrum networks.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Gas Fees</AccordionTrigger>
            <AccordionContent>
              Gas fees vary by network and congestion. Check current rates before transacting.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
