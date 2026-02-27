"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { ApiCollection } from "@/shared/types/collection";

interface CollectionCardProps {
  collection: ApiCollection;
}

// Map chainId to chain name for display
const CHAIN_NAMES: Record<string, string> = {
  'eip155:11155111': 'Sepolia',
  'eip155:8453': 'Base',
  'eip155:137': 'Polygon',
  'eip155:42161': 'Arbitrum',
  'eip155:56': 'BSC',
  'eip155:31337': 'Local',
};

// Status color mapping
const STATUS_COLORS: Record<string, string> = {
  'PENDING': 'bg-yellow-500/10 text-yellow-500',
  'DEPLOYED': 'bg-green-500/10 text-green-500',
  'FAILED': 'bg-destructive/10 text-destructive',
  'ARCHIVED': 'bg-muted text-muted-foreground',
};

export function CollectionCard({ collection }: CollectionCardProps) {
  const chainName = (collection.chainId && CHAIN_NAMES[collection.chainId]) || collection.chainId || 'Unknown';
  const statusColor = STATUS_COLORS[collection.status] || 'bg-muted text-muted-foreground';

  return (
    <Link href={`/collections/${collection.slug || collection.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative bg-muted">
          {collection.imageUrl ? (
            <Image
              src={collection.imageUrl}
              alt={collection.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg truncate flex-1">{collection.name}</h3>
            <Badge variant="outline" className="ml-2 text-xs">
              {collection.tokenStandard}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge className={`text-xs ${statusColor}`}>
              {collection.status}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {chainName}
            </Badge>
          </div>

          {collection.stats && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-muted-foreground">Items</p>
                <p className="font-medium">{collection.stats.totalItems || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Volume</p>
                <p className="font-medium">{collection.stats.totalVolumeWei || '0'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Floor</p>
                <p className="font-medium">{collection.stats.floorPriceWei || '0'}</p>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-3">
            Created {new Date(collection.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
