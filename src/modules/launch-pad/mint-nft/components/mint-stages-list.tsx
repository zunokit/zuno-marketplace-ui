"use client";

import React from "react";
import { Lock, HelpCircle } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";

type StageStatus = "ended" | "active";

interface MintStageItem {
  id: string;
  name: string;
  status: StageStatus;
  mintLimit: number;
  price: string;
  minted?: number;
  countdown?: { d: string; h: string; m: string; s: string };
}

const STAGES: MintStageItem[] = [
  { id: "og", name: "OG", status: "ended", mintLimit: 1, price: "0.25 SOL", minted: 32 },
  { id: "gtd", name: "GTD", status: "ended", mintLimit: 1, price: "0.27 SOL", minted: 33 },
  { id: "fcfs", name: "FCFS", status: "ended", mintLimit: 2, price: "0.27 SOL", minted: 44 },
  {
    id: "public",
    name: "Public",
    status: "active",
    mintLimit: 5,
    price: "0.3 SOL",
    countdown: { d: "03d", h: "22h", m: "38m", s: "40s" },
  },
];

interface MintStageCardProps {
  stage: MintStageItem;
}

function MintStageCard({ stage }: MintStageCardProps) {
  const isActive = stage.status === "active";

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted p-3",
        isActive
          ? "border-2 border-[#ff1a75]/50 shadow-[0_0_20px_rgba(255,26,117,0.1)]"
          : "border-border-subtle"
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center mb-2",
          isActive && "flex-col xs:flex-row xs:justify-between xs:items-center gap-2"
        )}
      >
        <div className="flex items-center gap-2">
          <Lock className="text-muted-foreground shrink-0" size={16} />
          <span className="bg-secondary text-foreground text-sm px-2 py-1 rounded flex items-center gap-1">
            {isActive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500/75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            )}
            {stage.name}
            <HelpCircle className="text-muted-foreground shrink-0" size={14} />
          </span>
        </div>
        {isActive && stage.countdown ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground shrink-0">ENDS</span>
            <div className="flex items-center gap-1">
              <span className="bg-secondary text-foreground font-medium px-2 py-1 rounded text-xs tabular-nums">
                {stage.countdown.d}
              </span>
              <span className="bg-secondary text-foreground font-medium px-2 py-1 rounded text-xs tabular-nums">
                {stage.countdown.h}
              </span>
              <span className="bg-secondary text-foreground font-medium px-1.5 py-1 rounded text-xs tabular-nums hidden sm:inline">
                {stage.countdown.m}
              </span>
              <span className="bg-secondary text-foreground font-medium px-1.5 py-1 rounded text-xs tabular-nums hidden sm:inline">
                {stage.countdown.s}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs shrink-0">ENDED</span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className={isActive ? "hidden lg:block" : undefined}>
          Mint Limit: {stage.mintLimit}
        </span>
        <span className="flex items-center gap-1">
          Price: <span className="text-foreground">{stage.price}</span>
        </span>
        {stage.minted != null && <span>Minted: {stage.minted}</span>}
      </div>
    </div>
  );
}

export default function MintStagesList() {
  return (
    <div className="space-y-2">
      {STAGES.map((stage) => (
        <MintStageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
}
