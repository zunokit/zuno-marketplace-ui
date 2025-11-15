/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState } from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/tailwind-utils";
import { CheckCircle2, Info } from "lucide-react";

import { useMintState } from "@/modules/mint/mint-nft/hooks/useMintState";
import EditionSelector from "@/modules/mint/mint-nft/components/EditionSelector";
import MintProgress from "@/modules/mint/mint-nft/components/MintProgress";
import MintAmount from "@/modules/mint/mint-nft/components/MintAmount";

export default function MintForm() {
  const {
    collection,
    isSameArtType,
    isAllowlistMint,
    agreedToTerms,
    setAgreedToTerms,

    // Token standard flags
    isERC1155,
    mintCostData,
    SUPPORTS_BATCH,
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
    <div className="space-y-5 bg-muted dark:bg-muted rounded-xs p-5 ">
      {isERC1155 && <EditionSelector />}
      {isAllowlistMint && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm text-white flex items-center gap-1">
              Allowlist Mint Credentials <span className="text-primary">*</span>
            </Label>
            <span className="text-sm text-muted-foreground">Required</span>
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
                  "h-10 text-sm bg-dialog border-border text-white placeholder:text-muted-foreground dark:bg-dialog dark:border-border",
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
            <p className="text-sm text-muted-foreground">65-byte hex signature provided by the allowlist</p>
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
                  "h-10 text-sm bg-dialog border-border text-white placeholder:text-muted-foreground dark:bg-dialog dark:border-border",
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
            <p className="text-sm text-muted-foreground">Nonce value provided by the allowlist</p>
          </div>
        </div>
      )}
      <MintProgress />

      <div className="flex items-center justify-between gap-20">
        <div className="space-y-1.5 mt-3">
          <div className="text-xl text-muted-foreground dark:text-muted-foreground">Price</div>
          <p className="text-4xl font-bold ">{mintCostData?.getMintCost?.mintPrice} ETH</p>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            Gas Fee: {mintCostData?.getMintCost?.estimatedGas} ETH
          </p>
        </div>
        <MintAmount amount={amount} setAmount={setAmount} maxQuantity={maxQuantity} />
      </div>

      <div className="flex items-start space-x-3 pt-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={checked => setAgreedToTerms(checked as boolean)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary dark:border-border"
          aria-label="Agree to terms of service"
        />
        <Label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
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
