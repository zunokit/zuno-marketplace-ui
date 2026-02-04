"use client";

import { useMintState } from "@/modules/launch-pad/mint-nft/hooks/use-mint-state";

export default function MintStatus() {
  const { collection, activeStageData } = useMintState();

  if (!collection) return null;

  const totalMinted = Number(collection.totalMinted || 0);
  const maxSupply = Number(collection.maxSupply || 0);
  const percentMinted = maxSupply > 0 ? ((totalMinted / maxSupply) * 100).toFixed(1) : "0";
  const stageName = activeStageData?.getActiveStage?.isPublicMint ? "Public" : "Allowlist";

  return (
    <div className="bg-layer-03 p-4 rounded space-y-4">
      <div className="flex space-x-4 items-center justify-between">
        <div className="basis-1/2 flex items-center space-x-3 overflow-hidden">
          {/* Not Eligible Badge - Keeping it static for now as per HTML design unless we have logic */}
          <div className="w-fit flex items-center justify-center min-h-6 text-xs rounded-full border border-border text-muted-foreground min-w-fit py-1 px-1.5 max-lg:hidden bg-transparent">
            <div className="cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="self-center cursor-default"
                color="currentColor"
                width="16"
                height="16"
              >
                <path stroke="none" d="M0 0h24v24H0z"></path>
                <rect width="14" height="10" x="5" y="11" rx="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M8 11V7a4 4 0 018 0v4"></path>
              </svg>
            </div>
            <span className="ml-1">Not Eligible</span>
          </div>

          <div className="hidden max-lg:block !ml-0">
            <div className="cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="self-center cursor-default"
                color="currentColor"
                width="16"
                height="16"
              >
                <path stroke="none" d="M0 0h24v24H0z"></path>
                <rect width="14" height="10" x="5" y="11" rx="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M8 11V7a4 4 0 018 0v4"></path>
              </svg>
            </div>
          </div>

          {/* Active Stage Indicator */}
          <div className="space-x-2 flex items-center empty:hidden">
            <div className="flex space-x-2 items-center">
              <span
                className="shrink-0 relative flex items-center justify-center h-[8px] w-[8px]"
                aria-hidden="true"
              >
                <span className="absolute rounded-full bg-os-success animate-ping [animation-duration:2s] h-[10px] w-[10px]"></span>
                <span className="relative block rounded-full bg-os-success h-[8px] w-[8px]"></span>
              </span>
              <span className="ml-1 capitalize truncate max-w-[100px]">{stageName}</span>
            </div>
          </div>
        </div>

        <div className="basis-1/2">
          <div className="flex flex-col gap-1 grow">
            <div className="flex items-center justify-between gap-x-5 text-xs text-muted-foreground">
              <span className="max-md:hidden max-w-[70px] truncate">Total Minted</span>
              <div className="flex gap-x-1 max-md:w-full md:items-center">
                <span className="text-foreground font-bold max-md:mr-auto">{percentMinted}%</span>
                <span className="text-foreground">
                  {totalMinted} / {maxSupply}
                </span>
              </div>
            </div>
            <div className="bg-white/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-os-epic rounded-full h-full"
                role="progressbar"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={Number(percentMinted)}
                style={{ width: `${percentMinted}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
