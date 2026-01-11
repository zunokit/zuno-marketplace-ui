import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";

import { CheckCircle2, Loader2 } from "lucide-react";
export type ProcessStatus = "pending" | "processing" | "completed";

// Dynamic step interface
export type ProcessStep = {
  id: string;
  title: string;
  description?: string;
  status: ProcessStatus;
  details?: string;
};

// Updated props interface
export type ProcessDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  steps: ProcessStep[];
};

export function ProcessDialog({
  isOpen,
  onOpenChange,
  title = "Processing",
  steps,
}: ProcessDialogProps) {
  const getStatusIcon = (status: ProcessStatus) => {
    switch (status) {
      case "processing":
        return (
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
          </div>
        );
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "pending":
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-border" />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] bg-background dark:bg-dialog border-border text-foreground [&>button]:hidden"
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-medium">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {steps.map(step => (
            <div key={step.id} className="bg-secondary dark:bg-muted rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getStatusIcon(step.status)}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground text-base">
                    {step.title}
                  </h4>
                  {step.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                  {step.details && (
                    <p className="text-sm text-muted-foreground">{step.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Backward compatibility - keep the old component name for existing usage
