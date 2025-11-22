"use client";

import { useMyCollectionsQuery } from "@/shared/graphql/hooks";
import { useAuth } from "@/shared/hooks/useAuth";
import { CollectionCard } from "@/modules/collections/components/CollectionCard";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function MyCollectionsPage() {
  const { isAuthenticated } = useAuth();
  const { data, loading, error } = useMyCollectionsQuery({
    page: 1,
    limit: 20
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">My Collections</h1>
        <p className="text-muted-foreground mb-4">
          Please connect your wallet and sign in to view your collections.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Collections</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">My Collections</h1>
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  const collections = data?.myCollections.items || [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Collections</h1>
        <Link href="/mint/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created any collections yet.
          </p>
          <Link href="/mint/create">
            <Button>Create Your First Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.myCollections.pageInfo && data.myCollections.pageInfo.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {/* Add pagination component */}
        </div>
      )}
    </div>
  );
}
