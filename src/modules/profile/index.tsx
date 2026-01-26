"use client";

import { useState } from "react";
import { ProfileHeader } from "@/modules/profile/components/profile-header";
import { ProfileTabs } from "@/modules/profile/components/profile-tabs";
export { ProfileSettings } from "@/modules/profile/components/profile-settings";
export { ActivityList } from "@/modules/profile/components/activity-list";
export { ProfileActivity } from "@/modules/profile/components/profile-activity";
export { ProfileCollections } from "@/modules/profile/components/profile-collections";
export { ProfileFavorites } from "@/modules/profile/components/profile-favorites";
export { ProfileNFTs } from "@/modules/profile/components/profile-nfts";
import { type UserProfile, type ProfileTab } from "@/shared/types/profile";
import { mockCurrentUser } from "@/shared/utils/mock/profile";

interface ProfileProps {
  profile?: UserProfile;
  isCurrentUser?: boolean;
}

export function Profile({ profile = mockCurrentUser, isCurrentUser = false }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("collected");
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(true);
    // Add follow logic
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    // Add unfollow logic
  };

  return (
    <div className="min-h-screen">
      <ProfileHeader
        profile={profile}
        isCurrentUser={isCurrentUser}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        isFollowing={isFollowing}
      />

      <div className="mx-auto px-4">
        <ProfileTabs profile={profile} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
