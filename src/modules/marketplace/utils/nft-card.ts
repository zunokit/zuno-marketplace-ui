import type { Nft } from "@/modules/marketplace/types";
import { NftStatus } from "@/modules/marketplace/types";

export function getPriceDisplay(nft: Nft): string {
  if (nft.status === NftStatus.Listed) return nft.listPrice || nft.mintPrice || "—";
  return nft.mintPrice || "—";
}

export function getStatusMeta(nft: Nft): { label: string; color: string } {
  switch (nft.status) {
    case NftStatus.Listed:
      return { label: "Listed", color: "bg-green-500" };
    case NftStatus.Sold:
      return { label: "Sold", color: "bg-amber-500" };
    case NftStatus.Cancelled:
      return { label: "Cancelled", color: "bg-muted-foreground/60" };
    default:
      return { label: "Owner", color: "bg-muted-foreground/60" };
  }
}
