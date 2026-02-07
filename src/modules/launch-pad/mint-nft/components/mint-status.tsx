"use client";

import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";
import { Lock } from "lucide-react";

export default function MintStatus() {
  const { collection, activeStageData } = useMintState();

  if (!collection) return null;

  const totalMinted = Number(collection.totalMinted || 0);
  const maxSupply = Number(collection.maxSupply || 0);
  const percentMinted = maxSupply > 0 ? ((totalMinted / maxSupply) * 100).toFixed(1) : "0";
  const stageName = activeStageData?.getActiveStage?.isPublicMint ? "Public" : "Allowlist";

  return (
    <div className="bg-[#252525] p-4 rounded-lg border border-white/[0.08] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Not Eligible Badge */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-white/[0.08] rounded-full px-2 py-1">
            <Lock size={14} />
            <span>Not Eligible</span>
          </div>

          {/* Active Stage Indicator */}
          <div className="flex items-center gap-1.5 bg-[#2a2a2a] rounded-full px-2 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-foreground capitalize">{stageName}</span>
          </div>
        </div>

        {/* Total Minted */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">Total Minted</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-[#ff1a75]">{percentMinted}%</span>
            <span className="text-xs text-muted-foreground">{totalMinted} / {maxSupply}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#ff1a75] to-[#ff4d94] rounded-full transition-all duration-500"
          role="progressbar"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Number(percentMinted)}
          style={{ width: `${percentMinted}%` }}
        ></div>
      </div>
    </div>
  );
}
