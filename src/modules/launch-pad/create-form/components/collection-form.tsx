"use client";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { RotateCcw } from "lucide-react";
import { CollectionDetails } from "@/modules/launch-pad/create-form/components/collection-details";
import { ArtSection } from "@/modules/launch-pad/create-form/components/art-section";
import { MintDetails } from "@/modules/launch-pad/create-form/components/mint-details";
import { CollectionProcess } from "@/modules/launch-pad/create-form/components/collection-process";
import { useForm } from "react-hook-form";
import type { MintTerminalCreateForm } from "@/shared/types/mint";
import { MintTerminalCreateFormSchema } from "@/shared/types/mint";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/shared/hooks/useAuth";
import { useCreateCollection } from "../hooks/use-create-collection";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DEFAULT_FORM_VALUES: MintTerminalCreateForm = {
  chain: "sepolia",
  name: "My Awesome Collection",
  symbol: "MAC",
  collectionImage: undefined,
  artworkMode: "ERC721",
  mintStartAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  description: "A unique NFT collection with amazing artwork and exclusive benefits for holders.",
  sameArtworkImage: undefined,
  metadataBaseUrl: "",
  mintPrice: "0.01",
  royaltyPercent: 2.5,
  maxSupply: 10000,
  mintLimitPerWallet: 10,
  stages: [
    {
      public: {
        price: "0.01",
        duration: null,
      },
    },
  ],
  agreeTos: false,
};

export default function CollectionForm() {
  const { isAuthenticated, isWalletConnected } = useAuth();
  const {
    step1Status,
    step2Status,
    step3Status,
    step4Status,
    step5Status,
    txHash,
    contractAddress,
    submit,
    reset: resetProcess,
    isProcessing,
    error
  } = useCreateCollection();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<MintTerminalCreateForm>({
    resolver: zodResolver(MintTerminalCreateFormSchema),
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleClearForm = () => {
    form.reset(DEFAULT_FORM_VALUES);
    resetProcess();
  };

  const onSubmit = async (data: MintTerminalCreateForm) => {
    // Validate authentication
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in with your wallet");
      return;
    }

    // Form validation is handled by zodResolver
    // Open progress dialog and submit
    setIsDialogOpen(true);
    await submit(data);
  };

  // Close dialog on error after 3s and reset state
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setIsDialogOpen(false);
        resetProcess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, resetProcess]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-end mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearForm}
          className="text-os-gray-300 hover:text-foreground dark:hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Clear Form
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CollectionDetails />
          <ArtSection />
          <MintDetails />

          {/* Terms of Service */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreeTos"
              {...form.register("agreeTos")}
              className="rounded border-border-subtle"
            />
            <label htmlFor="agreeTos" className="text-sm text-foreground dark:text-foreground">
              I agree to the Terms of Service
            </label>
          </div>
          {form.formState.errors.agreeTos && (
            <p className="text-destructive text-sm">{form.formState.errors.agreeTos.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              isProcessing ||
              !isWalletConnected
            }
          >
            {!isWalletConnected
              ? "Connect Wallet"
              : !isAuthenticated
                ? "Sign In Required"
                : isProcessing
                  ? "Creating..."
                  : "Create Collection"
            }
          </Button>
        </form>
      </Form>

      <CollectionProcess
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetProcess();
          }
        }}
        step1Status={step1Status}
        step2Status={step2Status}
        step3Status={step3Status}
        step4Status={step4Status}
        step5Status={step5Status}
        txHash={txHash}
        contractAddress={contractAddress}
      />
    </div>
  );
}
