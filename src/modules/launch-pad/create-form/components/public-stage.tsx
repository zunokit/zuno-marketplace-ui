 
"use client";

import { ResponsiveDialogDrawer } from "@/shared/components/responsive-dialog-drawer/responsive-dialog-drawer";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

interface PublicStageProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublicStage({ isOpen, onOpenChange }: PublicStageProps) {
  const { register, formState, setValue, getValues, watch } = useFormContext();
  const stages = watch("stages");
  const mintStartAt = watch("mintStartAt");

  // Watch for changes in allowlist duration to auto-update public start date display
  useEffect(() => {
    // This effect will trigger re-render when stages change
    // The DateTimePicker will automatically show the updated calculated date
  }, [stages, mintStartAt]);

  // Get current public data
  const publicData = stages?.[0]?.public || {
    price: undefined,
    duration: null,
  };

  // Calculate public stage start date based on mint start + presale duration
  const getPublicStartDate = () => {
    if (!mintStartAt) return undefined;

    const mintStart = new Date(mintStartAt);

    // If there's a presale stage, public starts after presale ends
    if (stages?.[0]?.presale?.duration) {
      const presaleDuration = stages[0].presale.duration;
      const publicStart = new Date(mintStart);
      publicStart.setDate(publicStart.getDate() + (presaleDuration.days || 0));
      publicStart.setHours(publicStart.getHours() + (presaleDuration.hours || 0));
      return publicStart;
    }

    // If no presale, public starts at mint start time
    return mintStart;
  };

  // Calculate minimum start date for public stage
  const getMinPublicStartDate = () => {
    const now = new Date();
    const calculatedStart = getPublicStartDate();

    if (calculatedStart) {
      return new Date(Math.max(calculatedStart.getTime(), now.getTime() + 5 * 60 * 1000));
    }

    return new Date(now.getTime() + 5 * 60 * 1000);
  };

  return (
    <ResponsiveDialogDrawer
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Public Stage"
      footer={
        <Button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Done
        </Button>
      }
    >
      <div>
        <Label className="text-foreground dark:text-foreground">Mint Price</Label>
        <div className="flex mt-2">
          <Input
            placeholder="0.00"
            value={publicData.price || ""}
            onChange={e => {
              const newStages = [...(stages || [])];
              if (newStages[0]) {
                newStages[0] = {
                  ...newStages[0],
                  public: {
                    ...publicData,
                    price: e.target.value || undefined,
                  },
                };
                setValue("stages", newStages);
              }
            }}
            className="bg-secondary dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground dark:text-foreground rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="bg-muted dark:bg-hover border border-border-subtle dark:border-border-subtle rounded-r-md px-4 flex items-center text-foreground dark:text-foreground">
            ETH
          </div>
        </div>
        {formState.errors.stages &&
          Array.isArray(formState.errors.stages) &&
          formState.errors.stages[0]?.public?.price && (
            <p className="text-destructive text-sm mt-1">
              {formState.errors.stages[0].public?.price?.message}
            </p>
          )}
      </div>

      <div>
        <Label className="text-foreground dark:text-foreground">Stage Duration</Label>
        <div className="flex gap-2 mt-2">
          <div className="flex flex-1">
            <Input
              placeholder="1"
              type="number"
              min="0"
              value={publicData.duration?.days || ""}
              onChange={e => {
                const days = parseInt(e.target.value) || 0;
                const newStages = [...(stages || [])];
                if (newStages[0]) {
                  newStages[0] = {
                    ...newStages[0],
                    public: {
                      ...publicData,
                      price: publicData.price || undefined,
                      duration:
                        days === 0 && !publicData.duration?.hours
                          ? null
                          : { days, hours: publicData.duration?.hours || 0 },
                    },
                  };
                  setValue("stages", newStages);
                }
              }}
              className="bg-secondary dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground dark:text-foreground rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="bg-muted dark:bg-hover border border-border-subtle dark:border-border-subtle rounded-r-md px-4 flex items-center text-foreground dark:text-foreground">
              Days
            </div>
          </div>
          <div className="flex flex-1">
            <Input
              placeholder="0"
              type="number"
              min="0"
              max="23"
              value={publicData.duration?.hours || ""}
              onChange={e => {
                const hours = parseInt(e.target.value) || 0;
                const newStages = [...(stages || [])];
                if (newStages[0]) {
                  newStages[0] = {
                    ...newStages[0],
                    public: {
                      ...publicData,
                      price: publicData.price || undefined,
                      duration:
                        !publicData.duration?.days && hours === 0
                          ? null
                          : { days: publicData.duration?.days || 0, hours },
                    },
                  };
                  setValue("stages", newStages);
                }
              }}
              className="bg-secondary dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground dark:text-foreground rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="bg-muted dark:bg-hover border border-border-subtle dark:border-border-subtle rounded-r-md px-4 flex items-center text-foreground dark:text-foreground">
              Hours
            </div>
          </div>
        </div>
      </div>
    </ResponsiveDialogDrawer>
  );
}
