"use client";

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/shared/hooks/useAuth';
import { useMediaUpload } from '@/shared/hooks/useMediaUpload';
import {
  useCreateCollectionMutation,
  useAddToAllowlistMutation
} from '@/shared/graphql/hooks';
import type { MintTerminalCreateForm } from '@/shared/types/mint';
import type { CreateCollectionInput, ApiTokenStandard } from '@/shared/types/collection';
import { parseEther } from 'viem';

export type StepStatus = 'pending' | 'loading' | 'success' | 'error';

interface CreateCollectionState {
  step1Status: StepStatus;
  step2Status: StepStatus;
  step3Status: StepStatus;
  collectionId: string | null;
  error: string | null;
}

// Map chain name to chainId (eip155 format)
const CHAIN_ID_MAP: Record<string, string> = {
  'sepolia': 'eip155:11155111',
  'base': 'eip155:8453',
  'polygon': 'eip155:137',
  'arbitrum': 'eip155:42161',
  'bsc': 'eip155:56',
  'anvil': 'eip155:31337',
};

export function useCreateCollection() {
  const router = useRouter();
  const { address } = useAccount();
  const { isAuthenticated } = useAuth();
  const { uploadFile } = useMediaUpload();
  const [createCollection] = useCreateCollectionMutation();
  const [addToAllowlist] = useAddToAllowlistMutation();

  const [state, setState] = useState<CreateCollectionState>({
    step1Status: 'pending',
    step2Status: 'pending',
    step3Status: 'pending',
    collectionId: null,
    error: null,
  });

  const submit = useCallback(async (formData: MintTerminalCreateForm) => {
    // Validation
    if (!isAuthenticated) {
      toast.error('Please connect your wallet and sign in');
      return;
    }

    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    setState({
      step1Status: 'loading',
      step2Status: 'pending',
      step3Status: 'pending',
      collectionId: null,
      error: null,
    });

    try {
      // === STEP 1: Upload Media ===
      let imageUrl: string | undefined;
      let artworkUrl: string | undefined;

      // Upload collection image if provided
      if (formData.collectionImage) {
        imageUrl = await uploadFile(formData.collectionImage);
      }

      // Upload artwork image for ERC1155
      if (formData.artworkMode === 'ERC1155' && formData.sameArtworkImage) {
        artworkUrl = await uploadFile(formData.sameArtworkImage);
      }

      setState(prev => ({ ...prev, step1Status: 'success', step2Status: 'loading' }));

      // === STEP 2: Create Collection ===
      // Map form data to GraphQL input
      const chainId = CHAIN_ID_MAP[formData.chain] || `eip155:${formData.chain}`;

      // Calculate allowlist duration in seconds
      const stage = formData.stages[0];
      let allowlistDurationSeconds: number | undefined;
      if (stage.presale?.duration) {
        const { days, hours } = stage.presale.duration;
        allowlistDurationSeconds = (days * 24 * 60 * 60) + (hours * 60 * 60);
      }

      // Build input
      const input: CreateCollectionInput = {
        name: formData.name,
        symbol: formData.symbol,
        tokenStandard: formData.artworkMode as ApiTokenStandard,
        chainId,
        deployerAddress: address,
        imageUrl: imageUrl || artworkUrl || '',
        description: formData.description,

        // For ERC721, use metadataBaseUrl as baseUri
        // For ERC1155, artwork URL will be in metadata
        baseUri: formData.artworkMode === 'ERC721'
          ? formData.metadataBaseUrl
          : artworkUrl,

        // Supply & limits
        maxSupply: formData.maxSupply || undefined,
        mintLimitPerWallet: formData.mintLimitPerWallet || undefined,

        // Pricing (convert to Wei)
        mintPrice: formData.mintPrice
          ? parseEther(formData.mintPrice).toString()
          : undefined,
        mintPriceAllowlist: stage.presale?.price
          ? parseEther(stage.presale.price).toString()
          : undefined,
        mintPricePublic: stage.public.price
          ? parseEther(stage.public.price).toString()
          : undefined,

        // Timing
        mintStartTime: formData.mintStartAt,
        allowlistStageDurationSeconds: allowlistDurationSeconds,

        // Royalty (convert percentage to basis points)
        royaltyFeeBps: formData.royaltyPercent
          ? formData.royaltyPercent * 100
          : undefined,
        royaltyRecipient: address,
      };

      const { data, errors } = await createCollection({
        variables: { input },
      });

      if (errors || !data?.createCollection) {
        throw new Error(errors?.[0]?.message || 'Failed to create collection');
      }

      const collectionId = data.createCollection.id;
      setState(prev => ({
        ...prev,
        step2Status: 'success',
        collectionId,
      }));

      // === STEP 3: Add Allowlist (if presale configured) ===
      if (stage.presale?.allowlistAddresses?.length) {
        setState(prev => ({ ...prev, step3Status: 'loading' }));

        await addToAllowlist({
          variables: {
            input: {
              collectionId,
              walletAddresses: stage.presale.allowlistAddresses,
              maxMintAmount: formData.mintLimitPerWallet || undefined,
            },
          },
        });

        setState(prev => ({ ...prev, step3Status: 'success' }));
      } else {
        setState(prev => ({ ...prev, step3Status: 'success' }));
      }

      // Success!
      toast.success('Collection created successfully!');

      // Redirect to collection page or my collections
      router.push(`/my-collections`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create collection';

      setState(prev => ({
        ...prev,
        step1Status: prev.step1Status === 'loading' ? 'error' : prev.step1Status,
        step2Status: prev.step2Status === 'loading' ? 'error' : prev.step2Status,
        step3Status: prev.step3Status === 'loading' ? 'error' : prev.step3Status,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  }, [isAuthenticated, address, uploadFile, createCollection, addToAllowlist, router]);

  const reset = useCallback(() => {
    setState({
      step1Status: 'pending',
      step2Status: 'pending',
      step3Status: 'pending',
      collectionId: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    submit,
    reset,
    isProcessing: state.step1Status === 'loading' ||
                  state.step2Status === 'loading' ||
                  state.step3Status === 'loading',
  };
}
