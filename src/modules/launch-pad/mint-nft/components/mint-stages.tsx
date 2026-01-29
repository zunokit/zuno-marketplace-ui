"use client";

import { Lock } from "lucide-react";
import { cn } from "@/shared/utils/tailwind-utils";
import CountdownTimer from "@/modules/launch-pad/mint-nft/components/countdown-timer";
import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";

const MintStages = () => {
  const { collection, mintCostData, activeStageData } = useMintState();

  const status = collection?.status || "live";
  const startDate = collection?.mintStartDate || "";
  const endDate = collection?.mintEndDate || "";
  const mintPrice = mintCostData?.getMintCost?.mintPrice || "0";
  const isPublic = activeStageData?.getActiveStage?.isPublicMint;
  console.log(collection?.status);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium font-sans text-foreground dark:text-foreground">
        Mint Stages
      </h4>
      <div
        className={cn(
          "rounded-[8px] py-4 px-5 transition-all duration-200 border-2 border-border-subtle",
          status === "live" && "border border-primary bg-primary/10"
        )}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-os-gray-300" />
            <span className="text-foreground dark:text-foreground text-sm font-medium font-sans">
              {isPublic ? "Public" : "Allowlist"}
            </span>
          </div>
          {status === "live" && endDate && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-sm rounded-full bg-primary text-primary-foreground">
                LIVE
              </span>
              <CountdownTimer endTime={endDate} onEnd={() => {}} isLive={true} />
            </div>
          )}
          {status === "ended" && <span className="text-os-gray-300 text-sm">ENDED</span>}
          {status === "upcoming" && startDate && (
            <div className="flex items-center gap-2">
              <span className="text-os-gray-300 text-sm">STARTS IN</span>
              <CountdownTimer endTime={startDate} onEnd={() => {}} isLive={false} />
            </div>
          )}
        </div>
        <div className="text-foreground text-sm">Price: {mintPrice} ETH</div>
      </div>
    </div>
  );
};

export default MintStages;
