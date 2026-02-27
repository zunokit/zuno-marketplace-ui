"use client";

import { ResponsiveDialogDrawer } from "@/shared/components/responsive-dialog-drawer/responsive-dialog-drawer";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useFormContext } from "react-hook-form";
import React, { useEffect, useState } from "react";

const MAX_WALLET_LENGTH = 42; // EVM address length

interface AllowlistStageProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllowlistStage({ isOpen, onOpenChange }: AllowlistStageProps) {
  const { setValue, watch } = useFormContext();
  const stages = watch("stages");
  const mintStartAt = watch("mintStartAt");
  const [allowlistText, setAllowlistText] = useState("");

  // Get current presale data (avoid empty-string price)
  const presaleData = stages?.[0]?.presale || {
    price: undefined,
    duration: { days: 1, hours: 0 },
    allowlistAddresses: [],
  };

  // Sync textarea from form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setAllowlistText((presaleData.allowlistAddresses || []).join("\n"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync when opening
  }, [isOpen]);

  // Set default mintStartAt if not set
  React.useEffect(() => {
    if (!mintStartAt) {
      const defaultDate = new Date(Date.now() + 5 * 60 * 1000);
      setValue("mintStartAt", defaultDate.toISOString());
    }
  }, [mintStartAt, setValue]);

  return (
    <ResponsiveDialogDrawer
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Allowlist Stage"
      description="Set presale price, duration, and allowlist wallets."
      contentClassName="space-y-4 max-w-md"
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
            value={presaleData.price || ""}
            onChange={e => {
              const newStages = [...(stages || [])];
              if (newStages[0]) {
                newStages[0] = {
                  ...newStages[0],
                  presale: {
                    ...presaleData,
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
      </div>

      <div>
        <Label className="text-foreground dark:text-foreground">Stage Duration</Label>
        <div className="flex gap-2 mt-2">
          <div className="flex flex-1">
            <Input
              placeholder="1"
              type="number"
              min="0"
              value={presaleData.duration?.days || ""}
              onChange={e => {
                const days = parseInt(e.target.value) || 0;
                const newStages = [...(stages || [])];
                if (newStages[0]) {
                  newStages[0] = {
                    ...newStages[0],
                    presale: {
                      ...presaleData,
                      price: presaleData.price || undefined,
                      duration: { ...presaleData.duration, days },
                    },
                  };
                  setValue("stages", newStages);
                  setTimeout(() => setValue("stages", [...newStages]), 0);
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
              value={presaleData.duration?.hours || ""}
              onChange={e => {
                const hours = parseInt(e.target.value) || 0;
                const newStages = [...(stages || [])];
                if (newStages[0]) {
                  newStages[0] = {
                    ...newStages[0],
                    presale: {
                      ...presaleData,
                      price: presaleData.price || undefined,
                      duration: { ...presaleData.duration, hours },
                    },
                  };
                  setValue("stages", newStages);
                  setTimeout(() => setValue("stages", [...newStages]), 0);
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

      <div>
        <Label className="text-foreground dark:text-foreground">Wallets (one per line)</Label>
        <Textarea
          value={allowlistText}
          onChange={e => {
            const text = e.target.value;
            setAllowlistText(text);
            const newWallets = text
              .split(/\r?\n/)
              .map(w => w.trim())
              .filter(Boolean)
              .map(w => (w.length > MAX_WALLET_LENGTH ? w.slice(0, MAX_WALLET_LENGTH) : w));
            const newStages = [...(stages || [])];
            if (newStages[0]) {
              newStages[0] = {
                ...newStages[0],
                presale: {
                  ...presaleData,
                  price: presaleData.price || undefined,
                  allowlistAddresses: newWallets,
                },
              };
              setValue("stages", newStages);
            }
          }}
          placeholder="0x123...\n0x456..."
          className="bg-secondary dark:bg-muted border-border-subtle dark:border-border-subtle text-foreground dark:text-foreground mt-2 min-h-[100px] max-h-[300px] overflow-y-auto focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </ResponsiveDialogDrawer>
  );
}
