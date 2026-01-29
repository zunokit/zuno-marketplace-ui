/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/tailwind-utils";
import { CheckCircle2 } from "lucide-react";

import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";
import EditionSelector from "@/modules/launch-pad/mint-nft/components/edition-selector";

export default function MintInfo() {
  const {
    collection,
    isSameArtType,
    isAllowlistMint,
    agreedToTerms,
    setAgreedToTerms,

    // Token standard flags
    isERC1155,
    isERC721,
    tokenStandard,

    SUPPORTS_BATCH,
    HAS_REVEAL,
    RANDOM_ASSIGNMENT,
    selectedEdition,
    mockEditions,
  } = useMintState();

  const MINT_LIMIT = 100;
  const [amount, setAmount] = useState(1);
  const [signature, setSignature] = useState<string | undefined>();
  const [nonce, setNonce] = useState<string | undefined>();
  const validateSignature = (val: string) => /^0x[0-9a-fA-F]{130}$/.test(val);
  const validateNonce = (val: string) => Number.isInteger(Number(val)) && Number(val) >= 0;

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

  return (
    <div className="space-y-4">
      {/* Token Standard Info */}
      <div className="p-3 bg-secondary dark:bg-dialog rounded-[8px] border border-border-subtle dark:border-border-subtle">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground dark:text-foreground">
            Token Standard: {tokenStandard}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-info/10 text-info dark:bg-info/10 dark:text-info">
            {tokenStandard === "ERC721" ? "ERC721" : "ERC1155"}
          </span>
        </div>
        {isERC721 && SUPPORTS_BATCH && (
          <p className="text-xs text-os-gray-300 dark:text-os-gray-300 mt-1">
            ERC-721A batch minting supported
          </p>
        )}
      </div>

      {isERC1155 && <EditionSelector />}

      {/* Allowlist Mint Inputs */}
      {isAllowlistMint && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm text-foreground flex items-center gap-1">
              Allowlist Mint Credentials <span className="text-primary">*</span>
            </Label>
            <span className="text-sm text-os-gray-300">Required</span>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="signature"
                value={signature || ""}
                onChange={e => {
                  const value = e.target.value;
                  setSignature(value);
                  if (value && !validateSignature(value)) {
                    setSignature(undefined);
                  }
                }}
                placeholder="Signature (0x...)"
                className={cn(
                  "h-10 text-sm bg-dialog border-border-subtle text-foreground placeholder:text-os-gray-300 dark:bg-dialog dark:border-border-subtle",
                  signature &&
                    !/^0x[0-9a-fA-F]{130}$/.test(signature) &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={signature && !validateSignature(signature) ? "true" : "false"}
              />
              {signature && validateSignature(signature) && (
                <CheckCircle2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
              )}
            </div>
            <p className="text-sm text-os-gray-300">
              65-byte hex signature provided by the allowlist
            </p>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="nonce"
                value={nonce || ""}
                onChange={e => {
                  const value = e.target.value;
                  setNonce(value);
                  if (value && !validateNonce(value)) {
                    setNonce(undefined);
                  }
                }}
                placeholder="Nonce"
                type="number"
                min={0}
                className={cn(
                  "h-10 text-sm bg-dialog border-border-subtle text-foreground placeholder:text-os-gray-300 dark:bg-dialog dark:border-border-subtle",
                  nonce &&
                    (!Number.isInteger(Number(nonce)) || Number(nonce) < 0) &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={nonce && !validateNonce(nonce) ? "true" : "false"}
              />
              {nonce && validateNonce(nonce) && (
                <CheckCircle2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
              )}
            </div>
            <p className="text-sm text-os-gray-300">Nonce value provided by the allowlist</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {/* ERC-721 without batch support - quantity fixed at 1 */}
        {isERC721 && !SUPPORTS_BATCH ? (
          <div className="p-3 bg-muted dark:bg-muted rounded-[6px] border border-border-subtle dark:border-border-subtle">
            <span className="text-sm text-os-gray-300 dark:text-os-gray-300">
              Quantity is fixed at 1 for this ERC-721 collection
            </span>
          </div>
        ) : (
          /* Quantity stepper for ERC-1155 (mandatory) or ERC-721A (optional) */
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount(Math.max(1, amount - 1))}
              disabled={amount <= 1}
              className="w-10 h-10 p-0"
            >
              -
            </Button>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={e => setAmount(Math.max(1, Math.min(maxQuantity, Number(e.target.value))))}
              min={1}
              max={maxQuantity}
              className="h-10 text-sm bg-dialog border-border-subtle text-foreground text-center w-20"
              aria-label="Number of NFTs to mint"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount(Math.min(maxQuantity, amount + 1))}
              disabled={amount >= maxQuantity}
              className="w-10 h-10 p-0"
            >
              +
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAmount(maxQuantity)}
              disabled={amount >= maxQuantity}
              className="text-xs px-2"
            >
              Max
            </Button>
          </div>
        )}

        <p className="text-sm text-os-gray-300">
          {isERC1155 && selectedEditionData ? (
            <>
              Minting {amount} of &quot;{selectedEditionData.name}&quot; edition.
              {selectedEditionData.remaining < selectedEditionData.perWalletLimit && (
                <span className="text-warning"> Limited supply remaining!</span>
              )}
            </>
          ) : isERC721 && SUPPORTS_BATCH ? (
            <>
              Batch mint {amount} NFT{amount > 1 ? "s" : ""} in one transaction.{" "}
              {isSameArtType
                ? "All NFTs share the same metadata."
                : "Each NFT requires unique metadata (use Batch Upload for multiple NFTs)."}
            </>
          ) : (
            "Single NFT mint."
          )}
        </p>

        {/* ERC-1155 Edition not selected warning */}
        {isERC1155 && !selectedEdition && (
          <p className="text-sm text-destructive">Please select an edition above to continue.</p>
        )}
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start space-x-3 pt-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={checked => setAgreedToTerms(checked as boolean)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border-subtle dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary dark:border-border-subtle"
          aria-label="Agree to terms of service"
        />
        <Label htmlFor="terms" className="text-sm text-os-gray-300 leading-tight">
          By clicking mint, you agree to the{" "}
          <a
            href="#"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          .
        </Label>
      </div>
    </div>
  );
}
