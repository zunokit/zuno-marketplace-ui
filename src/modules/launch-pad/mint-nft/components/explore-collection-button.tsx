import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Collection } from "@/shared/types";
import { collectionFaker } from "@/shared/utils/mock/fakers";

export default function ExploreCollectionButton() {
  const [collection, setCollection] = useState<Collection | null>(null);
  useEffect(() => {
    setCollection(collectionFaker.collection());
  }, []);
  return (
    <div className="w-full bg-secondary dark:bg-card p-3 rounded-xs">
      <Link
        href={`/marketplace/${collection?.slug}`}
        className="flex items-center justify-center gap-2 p-2 w-full rounded-xs bg-muted hover:bg-muted/80 text-foreground dark:bg-muted dark:hover:bg-muted/80 dark:text-foreground text-sm"
      >
        <p>Explore Collection</p>
        <ExternalLink className="w-3 h-3" />
      </Link>
    </div>
  );
}
