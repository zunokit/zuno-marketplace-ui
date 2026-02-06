import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCollectionStatus } from "@/shared/utils/collection";
import type { Collection } from "@/shared/graphql/schema.generated";

interface CollectionCardProps {
  item: Collection;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Map GraphQL status to UI status format
const mapStatusToUI = (status: Collection["status"]): "upcoming" | "live" | "ended" | "paused" => {
  switch (status) {
    case "PENDING": return "upcoming";
    case "DEPLOYED": return "live";
    case "FAILED": return "paused";
    case "ARCHIVED": return "ended";
    default: return "upcoming";
  }
};

export function CollectionCard({
  item,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: CollectionCardProps) {
  // Map GraphQL fields to UI format for getCollectionStatus
  const uiStatus = mapStatusToUI(item.status);

  const { isLive, isUpcoming, statusText, statusColor } = getCollectionStatus({
    status: uiStatus,
    mintStartDate: item.mintStartTime ?? undefined,
    publicMint: item.mintStartTime ? {
      startDate: item.mintStartTime,
      endDate: item.allowlistStageEnd ?? undefined,
      mintPrice: item.mintPricePublic ?? undefined,
    } : undefined,
    totalMinted: item.totalMinted.toString(),
    maxSupply: (item.maxSupply ?? 0).toString(),
  });

  const imageSrc = item.imageUrl ?? "/placeholder.svg";
  const fallbackSrc = "https://placehold.co/300x200";

  const handleCardClick = () => {
    if (isLive && item.slug) {
      redirect(`/marketplace/${item.slug}`);
    }
  };

  const handleMintClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.slug) {
      redirect(`/mint/${item.slug}`);
    }
  };

  return (
    <div
      className="relative group cursor-pointer h-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleCardClick}
    >
      <Card className="overflow-hidden border border-border-subtle dark:border-border-subtle bg-background dark:bg-card text-foreground dark:text-foreground text-sm h-full p-0">
        <div className="flex flex-col h-full">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              onError={e => {
                e.currentTarget.src = fallbackSrc;
              }}
            />
            {(isLive || isUpcoming) && (
              <div
                className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 h-16 flex items-end transform transition-transform duration-300 ${
                  isHovered ? "translate-y-0" : "translate-y-full"
                }`}
              >
                <div className="flex flex-col items-center gap-2 w-full">
                  <Button
                    className="w-full text-xs cursor-pointer bg-background/90 hover:bg-background text-foreground dark:bg-background/90 dark:hover:bg-background dark:text-foreground"
                    variant="secondary"
                    size="sm"
                    type="button"
                    disabled={isUpcoming}
                    onClick={handleMintClick}
                  >
                    {isLive ? "Mint Now" : "Coming Soon"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-3 flex flex-col h-[120px] justify-between">
            <h3 className="font-medium font-sans truncate text-base text-foreground dark:text-foreground mb-2">
              {item.name}
            </h3>

            <div className="grid grid-cols-3 gap-1 mb-auto">
              <div>
                <p className="text-[10px] uppercase font-medium text-os-gray-300 dark:text-os-gray-300">
                  PRICE
                </p>
                <p className="font-medium text-sm text-foreground dark:text-foreground truncate">
                  {item.mintPricePublic || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-os-gray-300 dark:text-os-gray-300">
                  ITEMS
                </p>
                <p className="font-medium text-sm text-foreground dark:text-foreground truncate">
                  {item.maxSupply ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-os-gray-300 dark:text-os-gray-300">
                  MINTED
                </p>
                <p className="font-medium text-sm text-foreground dark:text-foreground truncate">
                  {item.totalMinted}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-border-subtle dark:border-border-subtle">
              <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
              <span
                className="text-xs text-foreground dark:text-foreground truncate"
                title={statusText}
              >
                {statusText}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
