"use client";

import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, Terminal } from "lucide-react";

export function AlertSection() {
  return (
    <div className="space-y-8">
      {/* Alert Variants */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Alert Variants</h4>
        <div className="space-y-4 max-w-2xl">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert with neutral styling.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your transaction was completed successfully.
            </AlertDescription>
          </Alert>

          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error processing your request.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please review your information before proceeding.
            </AlertDescription>
          </Alert>

          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              New features are now available in your dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Without Title */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Without Title</h4>
        <div className="space-y-4 max-w-2xl">
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Your NFT has been successfully listed on the marketplace.
            </AlertDescription>
          </Alert>

          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Insufficient funds to complete this transaction.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
