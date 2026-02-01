---
title: "Phase 16: UI Components & Feedback"
description: "Create progress indicators, error displays, and retry UI for collection creation"
status: pending
priority: P1
effort: 8-10h
dependencies: ["Phase 12", "Phase 13"]
parallel_group: E
---

# Phase 16: UI Components & Feedback

## Context Links
- Parent Plan: [plan.md](./plan.md)
- Brainstorm: [brainstorm-260201-1112-create-collection-comprehensive-flow.md](../../reports/brainstorm-260201-1112-create-collection-comprehensive-flow.md)
- Depends On: [Phase 12: Enhanced Hook](./phase-12-enhanced-hook.md)

## Parallelization Info
- **Can Run Concurrently With:** None
- **Must Complete Before:** Phase 17-19 (Testing)
- **File Dependencies:** Phase 12 (uses enhanced hook)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Effort | 8-10 hours |
| Status | pending |
| Review Status | not started |

Create UI components for visual feedback during collection creation: progress indicators, error displays, and retry interfaces.

## Key Insights

1. Visual progress reduces user anxiety during long operations
2. Clear error messages enable self-service recovery
3. Retry UI should be prominent but not intrusive
4. Responsive design for all screen sizes

## Requirements

### Functional Requirements
- Progress indicator showing all 5 steps
- Visual states for pending/loading/success/error
- Error recovery UI with retry button
- Gas cost display before deployment
- Transaction status updates

### Non-Functional Requirements
- Accessible (ARIA labels)
- Responsive design
- Smooth animations
- Dark/light theme support

## Architecture

```
src/modules/create/components/
├── creation-progress.tsx         # Progress indicator
├── error-recovery.tsx            # Error display & retry
└── index.ts                      # Barrel export
```

## Related Code Files

### Files to Create
1. `src/modules/create/components/creation-progress.tsx` (NEW)
2. `src/modules/create/components/error-recovery.tsx` (NEW)

### Files to Modify
1. `src/modules/create/components/index.ts` - Add exports

## File Ownership

| File | Owner | Purpose |
|------|-------|---------|
| `src/modules/create/components/creation-progress.tsx` | Phase 06 | Progress indicator |
| `src/modules/create/components/error-recovery.tsx` | Phase 06 | Error recovery UI |

## Implementation Steps

### Step 1: Create Progress Component

Create `src/modules/create/components/creation-progress.tsx`:

```typescript
'use client';

import { Check, Loader2, X } from 'lucide-react';
import { cn } from '@/shared/utils/tailwind-utils';

type StepStatus = 'pending' | 'loading' | 'success' | 'error';

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
    <div className={cn('space-y-4', className)}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'flex items-start gap-4 p-4 rounded-lg border transition-colors',
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
                'font-medium',
                step.status === 'loading' && 'text-primary',
                step.status === 'success' && 'text-green-600',
                step.status === 'error' && 'text-red-600'
              )}>
                {step.label}
              </h4>
              {step.status === 'loading' && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
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
      return <Check className="h-5 w-5 text-green-500" />;
    case 'error':
      return <X className="h-5 w-5 text-red-500" />;
    case 'loading':
      return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    default:
      return <div className="h-5 w-5 rounded-full border-2 border-muted" />;
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
      'h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium',
      status === 'success' && 'bg-green-500 text-white',
      status === 'error' && 'bg-red-500 text-white',
      isActive && status === 'loading' && 'bg-primary text-primary-foreground',
      !isActive && status === 'pending' && 'bg-muted text-muted-foreground'
    )}>
      {number}
    </div>
  );
}
```

### Step 2: Create Error Recovery Component

Create `src/modules/create/components/error-recovery.tsx`:

```typescript
'use client';

import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import type { CreationStep } from '@/shared/errors/collection-errors';

interface ErrorRecoveryProps {
  error: Error | null;
  failedStep: CreationStep | null;
  canRetry: boolean;
  attemptsRemaining: number;
  onRetry: () => void;
  onCancel: () => void;
}

export function ErrorRecovery({
  error,
  failedStep,
  canRetry,
  attemptsRemaining,
  onRetry,
  onCancel,
}: ErrorRecoveryProps) {
  if (!error) return null;

  const stepLabels: Record<CreationStep, string> = {
    UPLOAD_MEDIA: 'Media Upload',
    CREATE_DB_RECORD: 'Database Creation',
    ADD_ALLOWLIST: 'Allowlist Setup',
    DEPLOY_CONTRACT: 'Contract Deployment',
    UPDATE_DB: 'Finalizing',
  };

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        Failed at: {failedStep ? stepLabels[failedStep] : 'Unknown Step'}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm">{error.message}</p>

        <div className="flex items-center gap-2 mt-4">
          {canRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry ({attemptsRemaining} attempts left)
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
```

### Step 3: Update Barrel Exports

Update `src/modules/create/components/index.ts`:
```typescript
export { CreationProgress } from './creation-progress';
export { ErrorRecovery } from './error-recovery';
```

## Todo List

- [ ] Create `creation-progress.tsx`
- [ ] Create `error-recovery.tsx`
- [ ] Update barrel exports
- [ ] Test responsive design
- [ ] Verify dark/light theme
- [ ] Run accessibility checks

## Success Criteria

- [ ] Progress component shows all 5 steps
- [ ] Visual states for pending/loading/success/error
- [ ] Error recovery UI with retry button
- [ ] Responsive design
- [ ] Accessible with ARIA labels
- [ ] TypeScript compiles without errors

## Conflict Prevention

This phase creates new files only. No conflicts with other phases.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Theme inconsistency | Medium | Low | Use shadcn/ui components |
| Animation performance | Low | Medium | Use CSS transitions |

## Security Considerations

- No sensitive data in UI components
- Error messages are user-safe

## Next Steps

After completion:
1. Phase 07 (Testing) can proceed
2. Review and merge before Phase 07 starts
