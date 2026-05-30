"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Collection } from "@/shared/types";
import { useSdkMint } from "@/modules/launch-pad/mint-nft/hooks/use-sdk-mint";
import { extractErrorCode, getSdkErrorMessage, isRetryableError } from "@/modules/launch-pad/mint-nft/utils/error-messages";

export function useMintState() {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [activeTab, setActiveTab] = useState("mint");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | undefined>();
  const [amount, setAmount] = useState(1);
  // Edition selector for ERC-1155
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | undefined>();
  const [nonce, setNonce] = useState<string | undefined>();

  const [editionFilter, setEditionFilter] = useState<string>("");
  const [editionSortBy, setEditionSortBy] = useState<"price" | "remaining" | "newest">("price");
  const [editionViewMode, setEditionViewMode] = useState<"grid" | "list">("grid");

  // Error state
  const [error, setError] = useState<{ code: string; message: string; retryable: boolean } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Get collection address from collection data
  const collectionAddress = useMemo(() => {
    if (!collection) return undefined;
    // Collection id is typically the contract address
    return collection.id;
  }, [collection]);

  // Get chain ID from collection data
  const chainId = useMemo(() => {
    if (!collection) return undefined;
    return (collection as unknown as { chainId?: string }).chainId;
  }, [collection]);

  // SDK mint hook integration
  const {
    address,
    isConnected,
    isConnecting,
    collection: sdkCollection,
    isCollectionLoading,
    isInAllowlist,
    isAllowlistOnly,
    isOwner,
    canMint,
    isERC1155,
    isERC721,
    mint,
    isMinting,
    calculatePrice,
    remainingSupply,
    maxMintable,
    mintPrice: sdkMintPrice,
    currencySymbol: sdkCurrencySymbol,
    refetchCollection,
  } = useSdkMint({ collectionAddress, chainId });

  // Token standard is derived from collection data
  const tokenStandard = useMemo(() => {
    if (isERC1155) return "ERC1155";
    if (isERC721) return "ERC721";
    // Default to ERC721 if no collection or tokenStandard is available
    if (!collection) return "ERC721";
    // Check if collection has tokenStandard property (from GraphQL)
    const std = (collection as unknown as { tokenStandard?: string }).tokenStandard;
    if (std === "ERC1155") return "ERC1155";
    return "ERC721";
  }, [collection, isERC1155, isERC721]);

  // Constants derived from collection
  const SUPPORTS_BATCH = tokenStandard === "ERC721"; // ERC721A support for ERC721
  const HAS_REVEAL = false; // Will be determined by contract in future
  const RANDOM_ASSIGNMENT = tokenStandard === "ERC721";

  // Reset selected edition when switching token standards
  useEffect(() => {
    setSelectedEdition(null);
  }, [tokenStandard]);

  // Computed values based on token standard
  const isSameArtType = useMemo(() => tokenStandard === "ERC1155", [tokenStandard]);

  const isAllowlistMint = useMemo(() => {
    return isAllowlistOnly;
  }, [isAllowlistOnly]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle retry for errors
  const handleRetry = useCallback(async () => {
    if (!error?.retryable) return;

    setIsRetrying(true);
    clearError();

    try {
      await refetchCollection();
      toast.success("Data refreshed successfully");
    } catch (err) {
      const code = extractErrorCode(err);
      setError({
        code,
        message: getSdkErrorMessage(code),
        retryable: isRetryableError(err),
      });
    } finally {
      setIsRetrying(false);
    }
  }, [error, clearError, refetchCollection]);

  // Handle mint confirmation - opens the confirm modal
  const handleMintConfirm = useCallback(() => {
    // Clear any previous errors
    clearError();

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please accept the terms of service");
      return;
    }

    // Check if sale has ended (sold out)
    if (remainingSupply <= 0) {
      setError({
        code: "SOLD_OUT",
        message: "This collection is sold out",
        retryable: false,
      });
      toast.error("Collection is sold out", {
        description: "All NFTs in this collection have been minted.",
      });
      return;
    }

    if (isAllowlistOnly && !isInAllowlist && !isOwner) {
      setError({
        code: "NOT_WHITELISTED",
        message: "Your address is not on the allowlist",
        retryable: false,
      });
      toast.error("You are not in the allowlist", {
        description: "This collection only allows allowlisted addresses to mint.",
      });
      return;
    }

    if (amount > maxMintable) {
      const errorMsg = maxMintable === 0
        ? "You have reached the maximum mint limit"
        : `Maximum mintable quantity is ${maxMintable}`;
      setError({
        code: "MAX_MINT_REACHED",
        message: errorMsg,
        retryable: false,
      });
      toast.error(errorMsg);
      return;
    }

    setShowConfirmModal(true);
  }, [isConnected, agreedToTerms, isAllowlistOnly, isInAllowlist, isOwner, amount, maxMintable, remainingSupply, clearError]);

  // Submit mint - performs the actual mint transaction
  const submitMint = useCallback(async () => {
    clearError();

    try {
      await mint(amount);
      setShowConfirmModal(false);
      // Reset amount after successful mint
      setAmount(1);
      toast.success("Mint successful!", {
        description: `You minted ${amount} NFT${amount > 1 ? "s" : ""}.`,
      });
    } catch (err) {
      // Error is already handled by useSdkMint, capture for UI display
      const code = extractErrorCode(err);
      setError({
        code,
        message: getSdkErrorMessage(code),
        retryable: isRetryableError(err),
      });
      // Keep modal open on error so user can retry
    }
  }, [mint, amount, clearError]);

  // Derive mint price from collection data
  const mintPrice = useMemo(() => {
    if (sdkMintPrice && parseFloat(sdkMintPrice) > 0) {
      return sdkMintPrice;
    }
    if (!collection) return "0";
    // Use mintPricePublic from collection if available
    const price = (collection as unknown as { mintPricePublic?: string }).mintPricePublic;
    return price || collection.mintPrice || "0";
  }, [collection, sdkMintPrice]);

  // Calculate price for current amount
  const priceCalculation = useMemo(() => {
    return calculatePrice(amount);
  }, [calculatePrice, amount]);

  const lastMintCost = {
    mintPrice,
    estimatedGas: "0.001",
    totalPrice: priceCalculation.totalPrice,
  };

  const mintCostData = {
    getMintCost: {
      success: true,
      mintPrice,
      estimatedGas: "0.001",
      totalPrice: priceCalculation.totalPrice,
    },
  };

  const activeStageData = {
    getActiveStage: {
      isPublicMint: !isAllowlistOnly,
    },
  };

  const nftsData = {
    getNfts: {
      nfts: [],
    },
  };

  // Editions derived from collection data (for ERC-1155)
  // For now, create a single edition based on collection data
  const mockEditions = useMemo(() => {
    if (!collection) return [];
    const remaining = (collection.maxSupply || 0) - (collection.totalMinted || 0);
    return [
      {
        id: "1",
        name: "Standard Edition",
        imageUrl: collection.imageUrl || "",
        price: mintPrice,
        remaining: Math.max(0, remaining),
        maxSupply: collection.maxSupply || 0,
        perWalletLimit: (collection as unknown as { mintLimitPerWallet?: number }).mintLimitPerWallet || 10,
      },
    ];
  }, [collection, mintPrice]);

  // Currency symbol
  const currencySymbol = useMemo(() => {
    if (sdkCurrencySymbol) return sdkCurrencySymbol;
    if (!collection) return "ETH";
    const chainIdValue = (collection as unknown as { chainId?: string }).chainId;
    if (chainIdValue?.includes("solana") || chainIdValue?.includes("sol")) return "SOL";
    if (chainIdValue?.includes("polygon")) return "MATIC";
    return "ETH";
  }, [collection, sdkCurrencySymbol]);

  return {
    collection,
    setCollection,
    agreedToTerms,
    setAgreedToTerms,

    activeTab,
    setActiveTab,
    showConfirmModal,
    setShowConfirmModal,
    isMintingNft: isMinting,
    isLoading: isCollectionLoading || isConnecting,
    currentImage,
    setCurrentImage,

    isSameArtType,
    isAllowlistMint,
    // Token standard - derived from collection
    tokenStandard,
    // Computed token standard flags
    isERC1155,
    isERC721,
    // Other constants
    SUPPORTS_BATCH,
    HAS_REVEAL,
    RANDOM_ASSIGNMENT,
    // Edition selector
    selectedEdition,
    setSelectedEdition,

    mockEditions,
    // Handlers

    handleMintConfirm,
    submitMint,
    lastMintCost,
    mintCostData,
    activeStageData,
    nftsData,
    isConnected,
    amount,
    setAmount,
    signature,
    setSignature,
    nonce,
    setNonce,
    editionFilter,
    setEditionFilter,
    editionSortBy,
    setEditionSortBy,
    editionViewMode,
    setEditionViewMode,

    // SDK integration additions
    address,
    isInAllowlist,
    isAllowlistOnly,
    isOwner,
    canMint,
    remainingSupply,
    maxMintable,
    mintPrice,
    currencySymbol,
    priceCalculation,
    refetchCollection,

    // Error handling additions
    error,
    clearError,
    handleRetry,
    isRetrying,
  };
}
