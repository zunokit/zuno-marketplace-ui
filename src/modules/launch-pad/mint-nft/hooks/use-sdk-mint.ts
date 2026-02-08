"use client";

import { useCallback, useMemo } from "react";
import {
  useCollection,
  useWallet,
  useIsInAllowlist,
  useIsAllowlistOnly,
  useCollectionInfo,
} from "zuno-marketplace-sdk/react";
import { toast } from "sonner";
import { handleSdkError } from "@/modules/launch-pad/mint-nft/utils/handle-sdk-error";
import { calculateMintPrice, getCurrencySymbolFromChainId } from "@/modules/launch-pad/mint-nft/utils/calculate-mint-price";

export interface UseSdkMintParams {
  collectionAddress?: string;
  chainId?: string;
}

export interface UseSdkMintReturn {
  // Wallet state
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isConnecting: boolean;

  // Collection state
  collection: ReturnType<typeof useCollectionInfo>["data"];
  isCollectionLoading: boolean;
  collectionError: ReturnType<typeof useCollectionInfo>["error"];
  refetchCollection: ReturnType<typeof useCollectionInfo>["refetch"];

  // Allowlist state
  isInAllowlist: boolean;
  isAllowlistOnly: boolean;
  isOwner: boolean;
  canMint: boolean;

  // Token standard
  isERC1155: boolean;
  isERC721: boolean;

  // Mint function
  mint: (quantity: number) => Promise<void>;
  isMinting: boolean;

  // Price calculation
  calculatePrice: (quantity: number) => ReturnType<typeof calculateMintPrice>;

  // Derived values
  remainingSupply: number;
  maxMintable: number;
  mintPrice: string;
  currencySymbol: string;
}

/**
 * Hook for SDK-based NFT minting with allowlist support
 * Wraps the Zuno Marketplace SDK hooks for mint functionality
 */
export function useSdkMint({ collectionAddress, chainId }: UseSdkMintParams): UseSdkMintReturn {
  // SDK hooks
  const { batchMintERC721, batchMintERC1155 } = useCollection();
  const { address, isConnected, isPending: isConnecting } = useWallet();

  // Collection info
  const {
    data: collection,
    isLoading: isCollectionLoading,
    error: collectionError,
    refetch: refetchCollection,
  } = useCollectionInfo(collectionAddress);

  // Allowlist hooks
  const { data: isInAllowlist = false } = useIsInAllowlist(collectionAddress, address);
  const { data: isAllowlistOnly = false } = useIsAllowlistOnly(collectionAddress);

  // Determine if user is owner (owner exempt from allowlist)
  const isOwner = useMemo(() => {
    if (!address || !collection?.owner) return false;
    return address.toLowerCase() === collection.owner.toLowerCase();
  }, [address, collection?.owner]);

  // Token standard
  const isERC1155 = collection?.tokenType === "ERC1155";
  const isERC721 = collection?.tokenType === "ERC721" || !isERC1155;

  // Select appropriate mint function
  const mintFn = isERC1155 ? batchMintERC1155 : batchMintERC721;
  const isMinting = mintFn.isPending;

  // Supply calculations
  const maxSupply = Number(collection?.maxSupply || 0);
  const totalMinted = Number(collection?.totalSupply || 0);
  const remainingSupply = Math.max(0, maxSupply - totalMinted);
  const mintLimitPerWallet = Number(collection?.mintLimitPerWallet || 10);
  const maxMintable = Math.min(remainingSupply, mintLimitPerWallet);

  // Price
  const mintPrice = collection?.mintPrice || "0";
  const currencySymbol = getCurrencySymbolFromChainId(chainId);

  // Can mint check
  const canMint = useMemo(() => {
    if (!isConnected || !address) return false;
    if (remainingSupply <= 0) return false;
    // Owner is exempt from allowlist requirement
    if (isAllowlistOnly && !isInAllowlist && !isOwner) return false;
    return true;
  }, [isConnected, address, remainingSupply, isAllowlistOnly, isInAllowlist, isOwner]);

  // Calculate price helper
  const calculatePrice = useCallback(
    (quantity: number) => {
      return calculateMintPrice(mintPrice, quantity, "0.009", "0.0042", currencySymbol);
    },
    [mintPrice, currencySymbol]
  );

  // Mint function
  const mint = useCallback(
    async (quantity: number) => {
      if (!isConnected || !address) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (!collectionAddress) {
        toast.error("Collection address is required");
        return;
      }

      if (quantity < 1) {
        toast.error("Quantity must be at least 1");
        return;
      }

      if (quantity > maxMintable) {
        toast.error(`Maximum mintable quantity is ${maxMintable}`);
        return;
      }

      // Check allowlist if collection is allowlist-only (owner exempt)
      if (isAllowlistOnly && !isInAllowlist && !isOwner) {
        toast.error("You are not in the allowlist", {
          description: "This collection only allows allowlisted addresses to mint.",
        });
        return;
      }

      try {
        const { totalValue } = calculatePrice(quantity);

        const result = await mintFn.mutateAsync({
          collectionAddress,
          recipient: address,
          amount: quantity,
          value: totalValue,
        });

        toast.success(`${quantity} NFT${quantity > 1 ? "s" : ""} Minted!`, {
          description: `TX: ${result.tx.hash.slice(0, 10)}...`,
        });

        // Refetch collection data to update supply
        await refetchCollection();
      } catch (err) {
        handleSdkError(err, "Failed to mint NFT");
        throw err;
      }
    },
    [
      isConnected,
      address,
      collectionAddress,
      maxMintable,
      isAllowlistOnly,
      isInAllowlist,
      isOwner,
      calculatePrice,
      mintFn,
      refetchCollection,
    ]
  );

  return {
    // Wallet state
    address,
    isConnected,
    isConnecting,

    // Collection state
    collection,
    isCollectionLoading,
    collectionError,
    refetchCollection,

    // Allowlist state
    isInAllowlist,
    isAllowlistOnly,
    isOwner,
    canMint,

    // Token standard
    isERC1155,
    isERC721,

    // Mint function
    mint,
    isMinting,

    // Price calculation
    calculatePrice,

    // Derived values
    remainingSupply,
    maxMintable,
    mintPrice,
    currencySymbol,
  };
}
