"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { CheckCircle2, Loader2, XCircle, Circle } from "lucide-react";
import type { StepStatus } from "../hooks/use-create-collection";

interface CollectionProcessProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  step1Status: StepStatus;
  step2Status: StepStatus;
  step3Status?: StepStatus;
  step4Status?: StepStatus;
  step5Status?: StepStatus;
  txHash?: string | null;
  contractAddress?: string | null;
}

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'loading':
      return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-destructive" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" />;
  }
}

export function CollectionProcess({
  isOpen,
  onOpenChange,
  step1Status,
  step2Status,
  step3Status = 'pending',
  step4Status = 'pending',
  step5Status = 'pending',
  txHash,
  contractAddress,
}: CollectionProcessProps) {
  const steps = [
    {
      title: "Uploading Media",
      description: "Uploading collection images to storage",
      status: step1Status,
    },
    {
      title: "Creating Collection",
      description: "Saving collection data to database",
      status: step2Status,
    },
    {
      title: "Configuring Allowlist",
      description: "Setting up presale allowlist addresses",
      status: step3Status,
    },
    {
      title: "Deploying Contract",
      description: txHash ? `Transaction: ${txHash.slice(0, 10)}...` : "Deploying smart contract to blockchain",
      status: step4Status,
    },
    {
      title: "Finalizing Deployment",
      description: contractAddress ? `Contract: ${contractAddress.slice(0, 10)}...` : "Updating collection with contract address",
      status: step5Status,
    },
  ];

  const allDone = step1Status === 'success' &&
    step2Status === 'success' &&
    step3Status === 'success' &&
    step4Status === 'success' &&
    step5Status === 'success';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {allDone ? "Collection Created!" : "Creating Collection..."}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${step.status === 'loading'
                  ? 'bg-primary/10'
                  : step.status === 'error'
                    ? 'bg-destructive/10'
                    : step.status === 'success'
                      ? 'bg-green-500/10'
                      : 'bg-muted/50'
                }`}
            >
              <StepIcon status={step.status} />
              <div className="flex-1">
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {allDone && (
          <p className="text-sm text-center text-muted-foreground">
            Redirecting to your collections...
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
