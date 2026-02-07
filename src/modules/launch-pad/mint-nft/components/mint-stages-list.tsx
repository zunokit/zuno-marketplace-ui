"use client";

import React from "react";
import { Lock, HelpCircle } from "lucide-react";

export default function MintStagesList() {
  return (
    <div className="space-y-3">
      {/* OG Stage - Ended */}
      <div className="rounded-lg border border-white/[0.08] bg-[#1f1f1f] p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Lock className="text-muted-foreground flex-shrink-0" size={16} />
            <span className="bg-[#2a2a2a] text-foreground text-sm px-2 py-1 rounded flex items-center gap-1">
              OG
              <HelpCircle className="text-muted-foreground flex-shrink-0" size={14} />
            </span>
          </div>
          <span className="text-muted-foreground text-xs flex-shrink-0">ENDED</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Mint Limit: 1</span>
          <span className="flex items-center gap-1">
            Price: <span className="text-foreground">0.25 SOL</span>
          </span>
          <span>Minted: 32</span>
        </div>
      </div>

      {/* GTD Stage - Ended */}
      <div className="rounded-lg border border-white/[0.08] bg-[#1f1f1f] p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Lock className="text-muted-foreground flex-shrink-0" size={16} />
            <span className="bg-[#2a2a2a] text-foreground text-sm px-2 py-1 rounded flex items-center gap-1">
              GTD
              <HelpCircle className="text-muted-foreground flex-shrink-0" size={14} />
            </span>
          </div>
          <span className="text-muted-foreground text-xs flex-shrink-0">ENDED</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Mint Limit: 1</span>
          <span className="flex items-center gap-1">
            Price: <span className="text-foreground">0.27 SOL</span>
          </span>
          <span>Minted: 33</span>
        </div>
      </div>

      {/* FCFS Stage - Ended */}
      <div className="rounded-lg border border-white/[0.08] bg-[#1f1f1f] p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Lock className="text-muted-foreground flex-shrink-0" size={16} />
            <span className="bg-[#2a2a2a] text-foreground text-sm px-2 py-1 rounded flex items-center gap-1">
              FCFS
              <HelpCircle className="text-muted-foreground flex-shrink-0" size={14} />
            </span>
          </div>
          <span className="text-muted-foreground text-xs flex-shrink-0">ENDED</span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Mint Limit: 2</span>
          <span className="flex items-center gap-1">
            Price: <span className="text-foreground">0.27 SOL</span>
          </span>
          <span>Minted: 44</span>
        </div>
      </div>

      {/* Public Stage - Active */}
      <div className="rounded-lg border-2 border-[#ff1a75]/50 bg-[#1f1f1f] p-3 shadow-[0_0_20px_rgba(255,26,117,0.1)]">
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Lock className="text-muted-foreground flex-shrink-0" size={16} />
            <span className="bg-[#2a2a2a] text-foreground text-sm px-2 py-1 rounded flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Public
              <HelpCircle className="text-muted-foreground flex-shrink-0" size={14} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground flex-shrink-0">ENDS</span>
            <div className="flex items-center gap-1">
              <span className="bg-[#2a2a2a] text-foreground font-medium px-2 py-1 rounded text-xs tabular-nums">03d</span>
              <span className="bg-[#2a2a2a] text-foreground font-medium px-2 py-1 rounded text-xs tabular-nums">22h</span>
              <span className="bg-[#2a2a2a] text-foreground font-medium px-1.5 py-1 rounded text-xs tabular-nums hidden sm:inline">38m</span>
              <span className="bg-[#2a2a2a] text-foreground font-medium px-1.5 py-1 rounded text-xs tabular-nums hidden sm:inline">40s</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="hidden lg:block">Mint Limit: 5</span>
          <span className="flex items-center gap-1">
            Price: <span className="text-foreground">0.3 SOL</span>
          </span>
        </div>
      </div>
    </div>
  );
}
