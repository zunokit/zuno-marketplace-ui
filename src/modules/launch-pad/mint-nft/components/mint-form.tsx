"use client";

import type React from "react";
import { useState } from "react";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";
import { Loader2, Wallet, Sparkles, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";

export default function MintForm() {
  const {
    collection,
    isSameArtType,
    isAllowlistMint,
    agreedToTerms,
    setAgreedToTerms,
    isConnected,
    // Token standard flags
    isERC1155,
    isERC721,
    SUPPORTS_BATCH,
    selectedEdition,
    mockEditions,
    mintCostData,
    lastMintCost,
    isLoading,
    handleMintConfirm,
    amount,
    setAmount,
    signature,
    nonce,
  } = useMintState();

  const MINT_LIMIT = 100;

  // Get selected edition data for ERC-1155
  const selectedEditionData = selectedEdition
    ? mockEditions.find(e => e.id === selectedEdition)
    : null;

  // Calculate max quantity for ERC-1155
  const maxQuantity =
    isERC1155 && selectedEditionData
      ? Math.min(
          selectedEditionData.remaining,
          selectedEditionData.perWalletLimit,
          10 // per-transaction limit
        )
      : SUPPORTS_BATCH
        ? MINT_LIMIT
        : 1;

  // Logic for button text and state (adapted from MintButton)
  const getButtonState = () => {
    if (!collection) {
      return {
        text: "Loading...",
        disabled: true,
        icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
      };
    }
    if (!isConnected) {
      return { text: "Connect Wallet to mint", disabled: false, icon: null }; // HTML says "Connect Wallet to mint"
    }
    if (isERC1155) {
      if (!selectedEdition) return { text: "Select an edition to continue", disabled: true };
      if (!selectedEditionData) return { text: "Invalid edition selected", disabled: true };
      if (selectedEditionData.remaining === 0)
        return {
          text: "Edition sold out",
          disabled: true,
          icon: <AlertTriangle className="mr-2 h-4 w-4" />,
        };
      if (amount > selectedEditionData.remaining)
        return { text: `Only ${selectedEditionData.remaining} remaining`, disabled: true };
    }
    if (Number(collection.totalMinted) >= Number(collection.maxSupply)) {
      return { text: "Sold out", disabled: true, icon: <AlertTriangle className="mr-2 h-4 w-4" /> };
    }
    if (isAllowlistMint && (!signature || !nonce)) {
      return { text: "Provide valid signature and nonce", disabled: true };
    }
    if (!agreedToTerms) {
      return { text: "Accept terms of service", disabled: true }; // Enforce terms agreement via button disable or just check on click
    }

    const unitPrice =
      isERC1155 && selectedEditionData
        ? selectedEditionData.price
        : mintCostData?.getMintCost?.mintPrice || lastMintCost.mintPrice;

    // Simplification for button text to match design style mostly, but keeping info
    return {
      text: "Mint Now", // Design says "Connect Wallet to mint", so when connected maybe "Mint Now"?
      disabled: isLoading,
      icon: isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null,
    };
  };

  const buttonState = getButtonState();

  const handleButtonClick = () => {
    // If not connected, we should trigger connect wallet (mocked here or handled by wallet adapter)
    if (!isConnected) {
      // Trigger connect wallet logic
      console.log("Connect wallet clicked");
      return;
    }
    handleMintConfirm();
  };

  const mintPrice = mintCostData?.getMintCost?.mintPrice || lastMintCost.mintPrice || "0";
  const mintFee = "0.009"; // Mocked from HTML
  const protocolFee = "0.0042"; // Mocked from HTML
  const totalPriceInUsd = "27.42"; // Mocked from HTML

  return (
    <div className="space-y-2">
      {/* Price and Amount */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary text-xs md:text-sm font-semibold">Price</p>
          <span className="md:text-[24px] font-bold text-wrap min-w-0 break-all text-foreground">
            {mintPrice} SOL
          </span>
          <span className="text-xs md:text-sm text-secondary ml-1 md:ml-2">
            (${totalPriceInUsd})
          </span>
        </div>

        {/* Amount Stepper */}
        <div className="flex items-center justify-between rounded overflow-hidden outline-none bg-input border border-interactive min-w-[150px] h-10 w-32">
          <div className="shrink-0 h-full flex p-1">
            <button
              type="button"
              disabled={amount <= 1}
              onClick={() => setAmount(Math.max(1, amount - 1))}
              className="flex items-center justify-center px-3.5 rounded hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                color="currentColor"
                width="14"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div className="group flex w-full">
            <div className="w-full">
              <input
                className="focus:outline-none size-full px-1 py-0 text text-center bg-transparent outline-none text-base text-secondary"
                placeholder="1"
                type="text"
                value={amount}
                readOnly
              />
            </div>
          </div>
          <div className="shrink-0 h-full flex p-1">
            <button
              type="button"
              disabled={amount >= maxQuantity}
              onClick={() => setAmount(Math.min(maxQuantity, amount + 1))}
              className="flex items-center justify-center px-3.5 rounded hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                color="currentColor"
                width="14"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
                className="text-foreground"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Fees */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-secondary">
          <div className="flex items-center gap-x-1">
            <span>Mint Fee</span>
          </div>
          <div className="font-fira flex items-center gap-1">
            <span className="text text-right">{mintFee}</span>{" "}
            <span className="text-left" style={{ width: "3ch" }}>
              SOL
            </span>
          </div>
        </div>
        <div className="flex justify-between gap-x-1 md:gap-[unset] text-xs text-secondary">
          <div className="flex items-center gap-x-1">
            <span>Protocol fee</span>
            <div className="cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                color="#998CA6"
                width="14"
                height="14"
              >
                <path
                  d="M10 13.3333V10M10 6.66669H10.0083M18.3334 10C18.3334 14.6024 14.6024 18.3334 10 18.3334C5.39765 18.3334 1.66669 14.6024 1.66669 10C1.66669 5.39765 5.39765 1.66669 10 1.66669C14.6024 1.66669 18.3334 5.39765 18.3334 10Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.3"
                ></path>
              </svg>
            </div>
          </div>
          <div className="font-fira flex items-center gap-1">
            <span className="text text-right">{protocolFee}</span>{" "}
            <span className="text-left" style={{ width: "3ch" }}>
              SOL
            </span>
          </div>
        </div>
      </div>

      {/* Priority Fee */}
      <div className="text-xs md:text-sm flex items-center justify-between gap-x-1 text-secondary [&>div]:!text-xs pt-0">
        <div>
          Priority fee (<span className="underline cursor-pointer">Standard</span>)
        </div>
      </div>

      {/* Terms and Button */}
      <div className="flex flex-col pt-2 space-y-2.5">
        <div className="flex gap-x-3 items-center mb-2">
          <label className="group inline-flex items-center gap-x-2 text-base cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="absolute size-px overflow-hidden whitespace-nowrap opacity-0"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "transition shrink-0 flex items-center justify-center border size-5 rounded bg-button-secondary border-primary group-hover:border-interactive-hover group-active:bg-button-secondary-active",
                  !agreedToTerms && "bg-transparent border-input",
                  agreedToTerms && "bg-button-secondary border-primary"
                )}
              >
                {agreedToTerms && (
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition scale-100 text-foreground"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </span>
            </div>

            <div className="empty:hidden"></div>
          </label>
          <p className="text-xs text-secondary leading-tight">
            By clicking &quot;mint&quot;, you agree to the{" "}
            <a
              className="font-bold hover:text-secondary text-primary"
              href="https://magiceden.io/legal-policies/terms"
              target="_blank"
              rel="noreferrer noopener"
              style={{ lineHeight: 1 }}
            >
              Magic Eden Terms of Service
            </a>
            .
          </p>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={buttonState.disabled}
            className="py-0 px-3 inline-flex justify-center items-center rounded text-sm transition bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-active disabled:bg-button-primary-disabled text-on-brand disabled:text-disabled-on-brand w-full min-w-[150px] h-auto min-h-[44px]"
          >
            {buttonState.icon}
            {buttonState.text}
          </button>
        </div>
      </div>

      {/* Trading Lock Notice - from HTML */}
      <div className="overflow-hidden" style={{ height: "auto", opacity: 1 }}>
        <div className="flex bg-layer-01 rounded-md p-2 text-xs gap-2 items-center mt-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="rgb(var(--brand))"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="shrink-0"
            color="rgb(var(--brand))"
            width="20"
            height="20"
          >
            <path stroke="none" d="M0 0h24v24H0z"></path>
            <rect width="14" height="10" x="5" y="11" rx="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="M8 11V7a4 4 0 018 0v4"></path>
          </svg>
          <span className="text-xs text-foreground">
            Collection is locked from trading until all items have been minted.
          </span>
        </div>
      </div>
    </div>
  );
}
