"use client";

import { useState } from "react";
import { ProfileHeader } from "@/modules/profile/components/ProfileHeader";
import { ProfileTabs } from "@/modules/profile/components/ProfileTabs";
export { ProfileSettings } from "@/modules/profile/components/ProfileSettings";
export { ActivityList } from "@/modules/profile/components/ActivityList";
export { UserActivity } from "@/modules/profile/components/UserActivity";
export { UserCollections } from "@/modules/profile/components/UserCollections";
export { UserFavorites } from "@/modules/profile/components/UserFavorites";
export { UserNFTs } from "@/modules/profile/components/UserNFTs";
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
