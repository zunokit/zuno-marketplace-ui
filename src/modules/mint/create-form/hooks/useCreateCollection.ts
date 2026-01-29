"use client";

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/shared/hooks/useAuth';
import { useMediaUpload } from '@/shared/hooks/useMediaUpload';
import {
  useCreateCollectionMutation,
  useAddToAllowlistMutation,
  useUpdateCollectionMutation
} from '@/shared/graphql';
import type { MintTerminalCreateForm } from '@/shared/types/mint';
import type { CreateCollectionInput, ApiTokenStandard } from '@/shared/types/collection';
import { useCollection } from 'zuno-marketplace-sdk/react';
import type { CollectionParams } from 'zuno-marketplace-sdk';
import { durationToSeconds } from '@/shared/utils/time';

export type StepStatus = 'pending' | 'loading' | 'success' | 'error';

interface CreateCollectionState {
  step1Status: StepStatus;
  step2Status: StepStatus;
  step3Status: StepStatus;
  step4Status: StepStatus;
  step5Status: StepStatus;
  collectionId: string | null;
  contractAddress: string | null;
  txHash: string | null;
  error: string | null;
}

// Map chain name to chainId (eip155 format)
const CHAIN_ID_MAP: Record<string, string> = {
  'sepolia': 'eip155:11155111',
  'ethereum': 'eip155:1',
  'polygon': 'eip155:137',
  'bsc': 'eip155:56',
  'anvil': 'eip155:31337',
};

export function useCreateCollection() {
  const router = useRouter();
  const { address } = useAccount();
  const { isAuthenticated } = useAuth();
  const { uploadFile } = useMediaUpload();
  const [createCollectionMutation] = useCreateCollectionMutation();
  const [addToAllowlistMutation] = useAddToAllowlistMutation();
  const [updateCollectionMutation] = useUpdateCollectionMutation();
  
  // SDK hooks for blockchain operations
  const { 
    createERC721, 
    createERC1155, 
    addToAllowlist: sdkAddToAllowlist, 
    setAllowlistOnly 
  } = useCollection();

  const [state, setState] = useState<CreateCollectionState>({
    step1Status: 'pending',
    step2Status: 'pending',
    step3Status: 'pending',
    step4Status: 'pending',
    step5Status: 'pending',
    collectionId: null,
    contractAddress: null,
    txHash: null,
    error: null,
  });

  const submit = useCallback(async (formData: MintTerminalCreateForm) => {
    // Validation
    if (!isAuthenticated) {
      toast.error('Please sign in first');
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
      step4Status: 'pending',
      step5Status: 'pending',
      collectionId: null,
      contractAddress: null,
      txHash: null,
      error: null,
    });

    try {
      // === STEP 1: Upload Media ===
      let imageUrl: string | undefined;

      if (formData.collectionImage) {
        try {
          imageUrl = await uploadFile(formData.collectionImage);
          setState(prev => ({ ...prev, step1Status: 'success' }));
        } catch (uploadError) {
          setState(prev => ({ ...prev, step1Status: 'error' }));
          throw uploadError;
        }
      } else {
        setState(prev => ({ ...prev, step1Status: 'success' }));
      }

      // === STEP 2: Create Collection in Database ===
      setState(prev => ({ ...prev, step2Status: 'loading' }));

      const chainId = CHAIN_ID_MAP[formData.chain] || 'eip155:31337';
      const tokenStandard: ApiTokenStandard =
        formData.artworkMode === 'ERC721' ? 'ERC721' : 'ERC1155';

      // Get allowlist stage data if exists
      const stage = formData.stages?.[0];
      const allowlistAddresses = stage?.presale?.allowlistAddresses || [];
      
      // Calculate mint start time and allowlist stage end
      const mintStartTime = formData.mintStartAt 
        ? new Date(formData.mintStartAt) 
        : new Date();
      
      let allowlistStageEnd: string | undefined;
      let allowlistStageDurationSeconds: number | undefined;
      if (stage?.presale?.duration && allowlistAddresses.length > 0) {
        allowlistStageDurationSeconds = durationToSeconds(stage.presale.duration);
        allowlistStageEnd = new Date(
          mintStartTime.getTime() + allowlistStageDurationSeconds * 1000
        ).toISOString();
      }

      const input: CreateCollectionInput = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description || '',
        chainId,
        tokenStandard,
        deployerAddress: address,
        imageUrl: imageUrl || '',
        baseUri: formData.metadataBaseUrl || `https://metadata.example.com/${formData.symbol}/`,
        maxSupply: formData.maxSupply ? Number(formData.maxSupply) : 10000,
        mintPriceAllowlist: stage?.presale?.price || '0',
        mintPricePublic: stage?.public?.price || formData.mintPrice || '0',
        mintStartTime: mintStartTime.toISOString(),
        allowlistStageEnd,
        mintLimitPerWallet: formData.mintLimitPerWallet || 10,
        royaltyFeeBps: formData.royaltyPercent ? formData.royaltyPercent * 100 : 500,
        royaltyRecipient: address,
      };

      const result = await createCollectionMutation({ variables: { input } });

      if (!result.data?.createCollection) {
        throw new Error('Failed to create collection');
      }

      const data = result.data;

      const collectionId = data.createCollection.id;
      setState(prev => ({
        ...prev,
        step2Status: 'success',
        collectionId,
      }));

      // === STEP 3: Add Allowlist to Database (if presale configured) ===
      console.log('[CreateCollection] Step 3 - Allowlist Debug:', {
        stage,
        presale: stage?.presale,
        allowlistAddresses,
        allowlistCount: allowlistAddresses.length,
        collectionId,
        mintLimitPerWallet: formData.mintLimitPerWallet,
      });

      if (allowlistAddresses.length > 0) {
        setState(prev => ({ ...prev, step3Status: 'loading' }));

        const maxMintAmount = formData.mintLimitPerWallet || 10; // Default to 10 if not specified
        console.log('[CreateCollection] Step 3 - Calling addToAllowlistMutation with:', {
          collectionId,
          walletAddresses: allowlistAddresses,
          maxMintAmount,
        });

        try {
          const allowlistResult = await addToAllowlistMutation({
            variables: {
              input: {
                collectionId,
                walletAddresses: allowlistAddresses,
                maxMintAmount,
              },
            },
          });
          console.log('[CreateCollection] Step 3 - Allowlist result:', allowlistResult);
          setState(prev => ({ ...prev, step3Status: 'success' }));
        } catch (allowlistError) {
          console.error('[CreateCollection] Step 3 - Allowlist error:', allowlistError);
          throw allowlistError;
        }
      } else {
        console.log('[CreateCollection] Step 3 - No allowlist addresses, skipping');
        setState(prev => ({ ...prev, step3Status: 'success' }));
      }

      // === STEP 4: Deploy Smart Contract via SDK ===
      setState(prev => ({ ...prev, step4Status: 'loading' }));

      // Build collection params for SDK
      const publicPrice = stage?.public?.price || formData.mintPrice || '0';
      const allowlistPrice = stage?.presale?.price || publicPrice;
      
      const collectionParams: CollectionParams = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description || '',
        mintPrice: publicPrice,
        royaltyFee: Math.round((formData.royaltyPercent || 0) * 100),
        maxSupply: formData.maxSupply || 10000,
        mintLimitPerWallet: formData.mintLimitPerWallet || 0,
        allowlistMintPrice: allowlistPrice, // Allowlist stage price
        publicMintPrice: publicPrice,
        // Only set allowlist duration if addresses provided
        allowlistStageDuration: allowlistAddresses.length > 0 ? (allowlistStageDurationSeconds || 0) : 0,
        tokenURI: input.baseUri || '',
      };

      let deployResult;

      if (formData.artworkMode === 'ERC721') {
        deployResult = await createERC721.mutateAsync(collectionParams);
      } else {
        deployResult = await createERC1155.mutateAsync(collectionParams);
      }

      const deployedAddress = deployResult.address;
      const deployTxHash = deployResult.tx.hash;

      // Add addresses to allowlist on blockchain if provided
      if (allowlistAddresses.length > 0) {
        await sdkAddToAllowlist.mutateAsync({ 
          collectionAddress: deployedAddress, 
          addresses: allowlistAddresses 
        });
        
        // Enable allowlist-only mode
        await setAllowlistOnly.mutateAsync({ 
          collectionAddress: deployedAddress, 
          enabled: true 
        });
      }

      setState(prev => ({
        ...prev,
        step4Status: 'success',
        contractAddress: deployedAddress,
        txHash: deployTxHash,
      }));

      // === STEP 5: Update Database with Contract Address ===
      setState(prev => ({ ...prev, step5Status: 'loading' }));

      await updateCollectionMutation({
        variables: {
          id: collectionId,
          input: {
            contractAddress: deployedAddress,
            status: 'DEPLOYED' as const,
          },
        },
      });

      setState(prev => ({ ...prev, step5Status: 'success' }));

      // Success!
      toast.success('Collection deployed successfully!');

      // Redirect to collection page
      router.push(`/my-collections`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create collection';

      setState(prev => ({
        ...prev,
        step1Status: prev.step1Status === 'loading' ? 'error' : prev.step1Status,
        step2Status: prev.step2Status === 'loading' ? 'error' : prev.step2Status,
        step3Status: prev.step3Status === 'loading' ? 'error' : prev.step3Status,
        step4Status: prev.step4Status === 'loading' ? 'error' : prev.step4Status,
        step5Status: prev.step5Status === 'loading' ? 'error' : prev.step5Status,
        error: errorMessage,
      }));

      toast.error(errorMessage);
    }
  }, [
    isAuthenticated,
    address,
    uploadFile,
    createCollectionMutation,
    addToAllowlistMutation,
    updateCollectionMutation,
    createERC721,
    createERC1155,
    sdkAddToAllowlist,
    setAllowlistOnly,
    router,
  ]);

  const reset = useCallback(() => {
    setState({
      step1Status: 'pending',
      step2Status: 'pending',
      step3Status: 'pending',
      step4Status: 'pending',
      step5Status: 'pending',
      collectionId: null,
      contractAddress: null,
      txHash: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    submit,
    reset,
    isProcessing: state.step1Status === 'loading' ||
                  state.step2Status === 'loading' ||
                  state.step3Status === 'loading' ||
                  state.step4Status === 'loading' ||
                  state.step5Status === 'loading',
  };
}
