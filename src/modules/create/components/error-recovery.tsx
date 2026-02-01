'use client';

import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import type { CreationStep } from '@/shared/errors/collection-errors';
import { cn } from '@/shared/utils/tailwind-utils';

interface ErrorRecoveryProps {
  error: Error | null;
  failedStep: CreationStep | null;
  canRetry: boolean;
  attemptsRemaining: number;
  onRetry: () => void;
  onCancel: () => void;
  className?: string;
}

const stepLabels: Record<string, string> = {
  UPLOAD_MEDIA: 'Media Upload',
  CREATE_DB_RECORD: 'Database Creation',
  ADD_ALLOWLIST: 'Allowlist Setup',
  DEPLOY_CONTRACT: 'Contract Deployment',
  UPDATE_DB: 'Finalizing',
};

export function ErrorRecovery({
  error,
  failedStep,
  canRetry,
  attemptsRemaining,
  onRetry,
  onCancel,
  className,
}: ErrorRecoveryProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={cn('mt-4', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-sm">
        Failed at: {failedStep ? stepLabels[failedStep] || failedStep : 'Unknown Step'}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm opacity-90">{error.message}</p>

        <div className="flex items-center gap-2 mt-3">
          {canRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry ({attemptsRemaining} left)
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
