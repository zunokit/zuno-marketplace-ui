"use client";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { RotateCcw } from "lucide-react";
import { CollectionDetails } from "@/modules/mint/create-form/components/CollectionDetails";
import { ArtSection } from "@/modules/mint/create-form/components/ArtSection";
import { MintDetails } from "@/modules/mint/create-form/components/MintDetails";
import { CollectionProcess } from "@/modules/mint/create-form/components/CollectionProcess";
import { useForm } from "react-hook-form";
import type { MintTerminalCreateForm } from "@/shared/types/mint";
import { MintTerminalCreateFormSchema } from "@/shared/types/mint";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/shared/hooks/useAuth";
import { useCreateCollection } from "../hooks/useCreateCollection";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    defaultValues: {
      chain: "sepolia",
      name: "",
      symbol: "",
      collectionImage: undefined,
      artworkMode: "ERC721",
      mintStartAt: new Date(Date.now()).toISOString(),
      description: "",
      sameArtworkImage: undefined,
      metadataBaseUrl: "",
      mintPrice: "0",
      royaltyPercent: 0,
      maxSupply: null,
      mintLimitPerWallet: null,
      stages: [
        {
          public: {
            price: "0",
            duration: null,
          },
        },
      ],
      agreeTos: true,
    },
  });

  const handleClearForm = () => {
    form.reset();
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

  // Close dialog on error after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setIsDialogOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
        onOpenChange={setIsDialogOpen}
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
