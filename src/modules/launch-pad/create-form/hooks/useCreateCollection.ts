"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/shared/hooks/useAuth";
import { useMediaUpload } from "@/shared/hooks/useMediaUpload";
import { useRecovery } from "@/shared/hooks/use-recovery";
import { usePersistedCreation } from "@/shared/hooks/use-persisted-creation";
import { useGasEstimation } from "@/shared/hooks/use-gas-estimation";
import { useTransactionState } from "@/shared/hooks/use-transaction-state";
import { CreationMachine } from "@/shared/machines/creation-machine";
import {
  useCreateCollectionMutation,
  useAddToAllowlistMutation,
  useUpdateCollectionMutation,
} from "@/shared/graphql";
import {
  CollectionError,
  MediaUploadError,
  DatabaseError,
  DeploymentError,
  UserRejectionError,
  getCollectionErrorMessage,
  isRecoverableError,
} from "@/shared/errors/collection-errors";
import type { MintTerminalCreateForm } from "@/shared/types/mint";
import type { CreateCollectionInput, ApiTokenStandard } from "@/shared/types/collection";
import { useCollection } from "zuno-marketplace-sdk/react";
import type { CollectionParams } from "zuno-marketplace-sdk";
import { durationToSeconds } from "@/shared/utils/time";

const CHAIN_ID_MAP: Record<string, string> = {
  sepolia: "eip155:11155111",
  ethereum: "eip155:1",
  polygon: "eip155:137",
  bsc: "eip155:56",
  anvil: "eip155:31337",
};

export type StepStatus = "pending" | "loading" | "success" | "error";

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

export function useCreateCollection() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { isAuthenticated } = useAuth();
  const { uploadFile } = useMediaUpload();

  const [createCollectionMutation] = useCreateCollectionMutation();
  const [addToAllowlistMutation] = useAddToAllowlistMutation();
  const [updateCollectionMutation] = useUpdateCollectionMutation();

  const sdkCollection = useCollection();
  const machineRef = useRef(new CreationMachine());
  const machine = machineRef.current;

  // Legacy state for backward compatibility with UI components
  const [legacyState, setLegacyState] = useState<CreateCollectionState>({
    step1Status: "pending",
    step2Status: "pending",
    step3Status: "pending",
    step4Status: "pending",
    step5Status: "pending",
    collectionId: null,
    contractAddress: null,
    txHash: null,
    error: null,
  });

  const recovery = useRecovery({
    maxRetries: 3,
    onRetry: (step, attempt) => {
      toast.info(`Retrying ${step} (attempt ${attempt})...`);
    },
  });

  const persistence = usePersistedCreation();
  const gasEstimation = useGasEstimation({ chainId: chainId ?? 1 });
  const txState = useTransactionState({
    onSuccess: (hash) => toast.success(`Transaction confirmed: ${hash.slice(0, 10)}...`),
    onReplaced: () => toast.info("Transaction was sped up"),
  });

  // Sync machine state with persistence and legacy state
  useEffect(() => {
    const unsubscribe = machine.subscribe((state, context) => {
      persistence.saveProgress({
        currentStep: state,
        collectionId: context.collectionId,
        stepResults: {
          imageUrl: context.imageUrl ?? undefined,
          contractAddress: context.contractAddress ?? undefined,
          txHash: context.txHash ?? undefined,
        },
      });

      // Update legacy state for UI compatibility
      setLegacyState(prev => ({
        ...prev,
        step1Status: state === "UPLOADING_MEDIA" ? "loading" : context.imageUrl ? "success" : prev.step1Status,
        step2Status: state === "CREATING_DB_RECORD" ? "loading" : context.collectionId ? "success" : prev.step2Status,
        step3Status: state === "ADDING_ALLOWLIST" ? "loading" : state === "DEPLOYING_CONTRACT" || state === "UPDATING_DB" || state === "COMPLETED" ? "success" : prev.step3Status,
        step4Status: state === "DEPLOYING_CONTRACT" ? "loading" : context.contractAddress ? "success" : prev.step4Status,
        step5Status: state === "UPDATING_DB" ? "loading" : state === "COMPLETED" ? "success" : prev.step5Status,
        collectionId: context.collectionId ?? prev.collectionId,
        contractAddress: context.contractAddress ?? prev.contractAddress,
        txHash: context.txHash ?? prev.txHash,
      }));
    });
    return unsubscribe;
  }, [machine, persistence]);

  // Step 1: Upload Media
  const uploadMedia = useCallback(async (formData: MintTerminalCreateForm) => {
    if (!formData.collectionImage) {
      return { imageUrl: undefined, bannerUrl: undefined };
    }

    const operation = async () => {
      const imageUrl = await uploadFile(formData.collectionImage!);
      return { imageUrl, bannerUrl: undefined };
    };

    try {
      return await operation();
    } catch (error) {
      if (isRecoverableError(error)) {
        return await recovery.retry("UPLOAD_MEDIA", operation);
      }
      throw new MediaUploadError(error instanceof Error ? error.message : "Upload failed");
    }
  }, [uploadFile, recovery]);

  // Step 2: Create DB Record
  const createDbRecord = useCallback(async (
    formData: MintTerminalCreateForm,
    imageUrl?: string,
    bannerUrl?: string
  ) => {
    const chainIdStr = CHAIN_ID_MAP[formData.chain] || "eip155:31337";
    const tokenStandard: ApiTokenStandard =
      formData.artworkMode === "ERC721" ? "ERC721" : "ERC1155";

    const stage = formData.stages?.[0];
    const allowlistAddresses = stage?.presale?.allowlistAddresses || [];
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
      description: formData.description || "",
      chainId: chainIdStr,
      tokenStandard,
      deployerAddress: address!,
      imageUrl: imageUrl || "",
      bannerUrl,
      baseUri: formData.metadataBaseUrl || `https://metadata.example.com/${formData.symbol}/`,
      maxSupply: formData.maxSupply ? Number(formData.maxSupply) : 10000,
      mintPriceAllowlist: stage?.presale?.price || "0",
      mintPricePublic: stage?.public?.price || formData.mintPrice || "0",
      mintStartTime: mintStartTime.toISOString(),
      allowlistStageEnd,
      mintLimitPerWallet: formData.mintLimitPerWallet || 10,
      royaltyFeeBps: formData.royaltyPercent ? formData.royaltyPercent * 100 : 500,
      royaltyRecipient: address!,
    };

    const result = await createCollectionMutation({ variables: { input } });

    if (!result.data?.createCollection) {
      throw new DatabaseError("Failed to create collection", true);
    }

    return result.data.createCollection.id;
  }, [address, createCollectionMutation]);

  // Step 3: Add Allowlist
  const addAllowlist = useCallback(async (
    collectionId: string,
    formData: MintTerminalCreateForm
  ) => {
    const stage = formData.stages?.[0];
    const allowlistAddresses = stage?.presale?.allowlistAddresses || [];

    if (allowlistAddresses.length === 0) return;

    const maxMintAmount = formData.mintLimitPerWallet || 10;

    await addToAllowlistMutation({
      variables: {
        input: {
          collectionId,
          walletAddresses: allowlistAddresses,
          maxMintAmount,
        },
      },
    });
  }, [addToAllowlistMutation]);

  // Step 4: Deploy Contract
  const deployContract = useCallback(async (
    formData: MintTerminalCreateForm,
    collectionId: string
  ) => {
    // Pre-flight gas check
    await gasEstimation.estimateGas();

    txState.startTransaction();

    try {
      const stage = formData.stages?.[0];
      const publicPrice = stage?.public?.price || formData.mintPrice || "0";
      const allowlistPrice = stage?.presale?.price || publicPrice;
      const allowlistAddresses = stage?.presale?.allowlistAddresses || [];

      const collectionParams: CollectionParams = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description || "",
        mintPrice: publicPrice,
        royaltyFee: Math.round((formData.royaltyPercent || 0) * 100),
        maxSupply: formData.maxSupply || 10000,
        mintLimitPerWallet: formData.mintLimitPerWallet || 0,
        allowlistMintPrice: allowlistPrice,
        publicMintPrice: publicPrice,
        allowlistStageDuration: allowlistAddresses.length > 0
          ? (stage?.presale?.duration ? durationToSeconds(stage.presale.duration) : 0)
          : 0,
        tokenURI: formData.metadataBaseUrl || "",
      };

      const deployResult = formData.artworkMode === "ERC721"
        ? await sdkCollection.createERC721.mutateAsync(collectionParams)
        : await sdkCollection.createERC1155.mutateAsync(collectionParams);

      // Convert hash to 0x${string} type
      const txHash = deployResult.tx.hash as `0x${string}`;

      // Use 0 as nonce since SDK TransactionReceipt doesn't include nonce
      txState.setSubmitted(txHash, 0);

      // Add to blockchain allowlist if needed
      if (allowlistAddresses.length > 0) {
        await sdkCollection.addToAllowlist.mutateAsync({
          collectionAddress: deployResult.address,
          addresses: allowlistAddresses,
        });
        await sdkCollection.setAllowlistOnly.mutateAsync({
          collectionAddress: deployResult.address,
          enabled: true,
        });
      }

      return deployResult;
    } catch (error) {
      txState.setFailed(error instanceof Error ? error : new Error("Deployment failed"));

      if (error instanceof Error && error.message.includes("rejected")) {
        throw new UserRejectionError();
      }
      throw new DeploymentError(error instanceof Error ? error.message : "Deployment failed");
    }
  }, [sdkCollection, gasEstimation, txState]);

  // Step 5: Update DB
  const updateDbRecord = useCallback(async (
    collectionId: string,
    contractAddress: string
  ) => {
    await updateCollectionMutation({
      variables: {
        id: collectionId,
        input: {
          contractAddress,
          status: "DEPLOYED" as const,
        },
      },
    });
  }, [updateCollectionMutation]);

  // Main submit function
  const submit = useCallback(async (formData: MintTerminalCreateForm) => {
    if (!isAuthenticated) {
      toast.error("Please sign in first");
      return;
    }
    if (!address) {
      toast.error("Wallet not connected");
      return;
    }

    // Reset legacy state
    setLegacyState({
      step1Status: "loading",
      step2Status: "pending",
      step3Status: "pending",
      step4Status: "pending",
      step5Status: "pending",
      collectionId: null,
      contractAddress: null,
      txHash: null,
      error: null,
    });

    machine.transition({ type: "START" });

    try {
      // Step 1
      const mediaResult = await uploadMedia(formData);
      const imageUrl = mediaResult?.imageUrl;
      const bannerUrl = mediaResult?.bannerUrl;

      machine.transition({ type: "MEDIA_UPLOADED", imageUrl: imageUrl || "", bannerUrl });

      // Step 2
      const collectionId = await createDbRecord(formData, imageUrl, bannerUrl);
      machine.transition({ type: "DB_RECORD_CREATED", collectionId });

      // Step 3
      await addAllowlist(collectionId, formData);
      machine.transition({ type: "ALLOWLIST_ADDED" });

      // Step 4
      const deployResult = await deployContract(formData, collectionId);
      const contractAddr = deployResult.address;
      const txHash = deployResult.tx.hash;

      machine.transition({
        type: "CONTRACT_DEPLOYED",
        contractAddress: contractAddr,
        txHash,
      });

      // Step 5
      await updateDbRecord(collectionId, contractAddr);
      machine.transition({ type: "DB_UPDATED" });

      // Success
      persistence.clearProgress();
      toast.success("Collection deployed successfully!");
      router.push("/my-collections");
    } catch (error) {
      const message = getCollectionErrorMessage(error);
      toast.error(message);

      // Update legacy state with error
      setLegacyState(prev => ({
        ...prev,
        step1Status: prev.step1Status === "loading" ? "error" : prev.step1Status,
        step2Status: prev.step2Status === "loading" ? "error" : prev.step2Status,
        step3Status: prev.step3Status === "loading" ? "error" : prev.step3Status,
        step4Status: prev.step4Status === "loading" ? "error" : prev.step4Status,
        step5Status: prev.step5Status === "loading" ? "error" : prev.step5Status,
        error: message,
      }));

      if (error instanceof CollectionError) {
        recovery.setFailure(error, error.step);
        machine.transition({
          type: `${error.step}_FAILED` as any,
          error,
        });
      }
    }
  }, [
    isAuthenticated,
    address,
    machine,
    uploadMedia,
    createDbRecord,
    addAllowlist,
    deployContract,
    updateDbRecord,
    persistence,
    recovery,
    router,
  ]);

  const retry = useCallback(async () => {
    if (!recovery.canRetry || !recovery.failedStep) return;

    // Retry logic based on failed step
    toast.info(`Retrying from ${recovery.failedStep}...`);
    // Implementation depends on which step failed
  }, [recovery]);

  const reset = useCallback(() => {
    machine.transition({ type: "RESET" });
    persistence.clearProgress();
    recovery.reset();
    txState.reset();
    setLegacyState({
      step1Status: "pending",
      step2Status: "pending",
      step3Status: "pending",
      step4Status: "pending",
      step5Status: "pending",
      collectionId: null,
      contractAddress: null,
      txHash: null,
      error: null,
    });
  }, [machine, persistence, recovery, txState]);

  // Return both legacy state (for backward compatibility) and new state
  return {
    // Legacy properties for backward compatibility
    ...legacyState,

    // New properties for enhanced functionality
    state: machine.currentState,
    context: machine.currentContext,
    submit,
    retry,
    reset,
    isProcessing: !machine.isTerminal && machine.currentState !== "IDLE",
    canRetry: recovery.canRetry,
    failedStep: recovery.failedStep,
    error: recovery.error?.message || legacyState.error,
    gasEstimate: gasEstimation.formattedCost,
    txStatus: txState.status,
  };
}
