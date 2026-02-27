"use client";

import MintStatus from "@/modules/launch-pad/mint-nft/components/mint-status";
import MintForm from "@/modules/launch-pad/mint-nft/components/mint-form";
import MintSocialLinks from "@/modules/launch-pad/mint-nft/components/mint-social-links";
import MintStagesList from "@/modules/launch-pad/mint-nft/components/mint-stages-list";
import { MintConfirmDialog } from "@/modules/launch-pad/mint-nft/components/mint-confirm-dialog";

interface MintPanelProps {
  currentGalleryImage?: string;
}

export default function MintPanel({ currentGalleryImage }: MintPanelProps) {
  return (
    <div className="space-y-3 lg:sticky lg:top-16 lg:z-10 lg:max-h-[90vh] lg:overflow-y-auto self-start bg-card text-foreground h-full p-3.5 rounded-lg border border-border-subtle/50">
      <div className="space-y-3 mint-panel w-full" data-mint-panel>
        <MintSocialLinks />

        <div className="flex flex-col gap-y-4">
          <MintStatus />

          <div className="bg-secondary p-4 rounded-lg space-y-4 border border-border-subtle">
            <MintForm />
          </div>
        </div>

        <MintStagesList />
      </div>

      <MintConfirmDialog />
    </div>
  );
}
