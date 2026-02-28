import { CollectionDetailContent } from "./collection-detail-content";
import { mockCollections, mockNFTs } from "@/shared/utils/mock/marketplace";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = mockCollections[0];

  return {
    title: `${collection.name} Collection | NFT Marketplace`,
    description: collection.description || `Browse NFTs from ${collection.name} collection`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection =
    mockCollections.find(c => c.name.toLowerCase().replace(/\s+/g, "-") === slug) ||
    mockCollections[0];

  const collectionNFTs = mockNFTs.filter(nft => nft.collection.address === collection.address);

  return <CollectionDetailContent collection={collection} nfts={collectionNFTs} />;
}
