import { Profile } from "@/modules/profile";
import { mockUserProfiles } from "@/shared/utils/mock/profile";

interface ProfileByAddressPageProps {
  params: Promise<{
    address: string;
  }>;
}

export async function generateMetadata({ params }: ProfileByAddressPageProps) {
  const { address } = await params;
  // In real app, fetch profile by wallet address
  const profile = mockUserProfiles.find(p => p.address.toLowerCase() === address.toLowerCase()) || {
    ...mockUserProfiles[0],
    address,
    username: undefined,
    displayName: undefined,
  };

  return {
    title: `${profile.displayName || address.slice(0, 8)} | NFT Marketplace`,
    description: `View NFT collection and activity for wallet ${address}`,
  };
}

export default async function ProfileByAddressPage({ params }: ProfileByAddressPageProps) {
  const { address } = await params;

  // In real app, fetch profile by wallet address
  // If no profile exists, create a basic one with just the address
  let profile = mockUserProfiles.find(p => p.address.toLowerCase() === address.toLowerCase());

  if (!profile) {
    // Create basic profile for unknown address
    // Generate deterministic mock stats based on address hash
    const addressHash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed1 = (addressHash % 100);
    const seed2 = (addressHash % 10);
    const seed3 = ((addressHash * 7) % 100);
    const seed4 = ((addressHash * 13) % 1000);
    
    profile = {
      id: `address-${address}`,
      address,
      username: undefined,
      displayName: undefined,
      bio: undefined,
      avatar: undefined,
      banner: undefined,
      email: undefined,
      website: undefined,
      twitter: undefined,
      discord: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false,
      stats: {
        nftsOwned: seed1,
        nftsCreated: 0,
        collections: seed2,
        totalVolume: `${(seed3).toFixed(2)} ETH`,
        floorPrice: `${(seed4 / 1000).toFixed(3)} ETH`,
        followers: 0,
        following: 0,
      },
    };
  }

  return <Profile profile={profile} isCurrentUser={false} />;
}
