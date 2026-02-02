'use client';

import { Check, Loader2, X } from 'lucide-react';
import { cn } from '@/shared/utils/tailwind-utils';

export type StepStatus = 'pending' | 'loading' | 'success' | 'error';

interface CreationStep {
  id: string;
  label: string;
  description: string;
  status: StepStatus;
}

interface CreationProgressProps {
  steps: CreationStep[];
  currentStep: string;
  className?: string;
}

export function CreationProgress({ steps, currentStep, className }: CreationProgressProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className={cn('space-y-3', className)}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'flex items-start gap-3 p-3 rounded-lg border transition-colors',
            step.status === 'loading' && 'border-primary bg-primary/5',
            step.status === 'success' && 'border-green-500/30 bg-green-500/5',
            step.status === 'error' && 'border-red-500/30 bg-red-500/5',
            step.status === 'pending' && 'border-muted bg-muted/30'
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            <StepIcon status={step.status} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className={cn(
                'font-medium text-sm',
                step.status === 'loading' && 'text-primary',
                step.status === 'success' && 'text-green-600',
                step.status === 'error' && 'text-red-600'
              )}>
                {step.label}
              </h4>
              {step.status === 'loading' && (
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <StepNumber
              number={index + 1}
              status={step.status}
              isActive={index === currentIndex}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StepIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'success':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'error':
      return <X className="h-4 w-4 text-red-500" />;
    case 'loading':
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
  }
}

function StepNumber({
  number,
  status,
  isActive,
}: {
  number: number;
  status: StepStatus;
  isActive: boolean;
}) {
  return (
    <div className={cn(
      'h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium',
      status === 'success' && 'bg-green-500 text-white',
      status === 'error' && 'bg-red-500 text-white',
      isActive && status === 'loading' && 'bg-primary text-primary-foreground',
      !isActive && status === 'pending' && 'bg-muted text-muted-foreground'
    )}>
      {number}
    </div>
  );
}
