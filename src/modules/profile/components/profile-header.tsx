"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Globe, Copy, Check, Settings, Share2, UserPlus, UserMinus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type UserProfile } from "@/shared/types/profile";
import { cn } from "@/shared/utils/tailwind-utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("fill-current", className)}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <path d="M9.14163 7.19284L13.6089 2H12.5503L8.67137 6.50887L5.57328 2H2L6.68492 8.81821L2 14.2637H3.05866L7.15491 9.50218L10.4267 14.2637H14L9.14163 7.19284ZM7.69165 8.87828L7.21697 8.19934L3.44011 2.79694H5.06615L8.11412 7.15685L8.5888 7.83579L12.5508 13.503H10.9248L7.69165 8.87828Z" />
    </svg>
  );
}

interface ProfileHeaderProps {
  profile: UserProfile;
  isCurrentUser?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  isFollowing?: boolean;
}

export function ProfileHeader({
  profile,
  isCurrentUser = false,
  onFollow,
  onUnfollow,
  isFollowing = false,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profile.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative h-40 sm:h-52 md:h-64 w-full overflow-hidden">
        {profile.banner ? (
          <Image src={profile.banner} alt="Profile banner" fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-pink-600/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background ring-2 ring-border shrink-0">
            <AvatarImage src={profile.avatar} alt={profile.displayName} />
            <AvatarFallback className="text-2xl">
              {profile.displayName?.[0] || profile.username?.[0] || "?"}
            </AvatarFallback>
          </Avatar>

          {/* Name and actions row */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 min-w-0 pb-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold truncate">
                  {profile.displayName || profile.username || truncateAddress(profile.address)}
                </h1>
                {profile.verified && (
                  <svg
                    className="h-5 w-5 fill-blue-500 shrink-0"
                    viewBox="0 -960 960 960"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                    <path
                      className="fill-white"
                      d="M438-338 L664-564 L608-622 L438-452 L352-538 L296-482 L438-338 Z"
                    />
                  </svg>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono bg-muted/50 px-2 py-1 rounded-md"
                >
                  {truncateAddress(profile.address)}
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={`https://twitter.com/${profile.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </a>
                )}
                <button className="p-1.5 rounded-md hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              {isCurrentUser ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile/settings/">
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Edit Profile
                  </Link>
                </Button>
              ) : isFollowing ? (
                <Button variant="outline" size="sm" onClick={onUnfollow}>
                  <UserMinus className="h-3.5 w-3.5 mr-1.5" />
                  Unfollow
                </Button>
              ) : (
                <Button size="sm" onClick={onFollow}>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Follow
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">{profile.bio}</p>
        )}

        {/* Stats row - inline like ME/OS */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-border">
          <StatInline label="Owned" value={profile.stats.nftsOwned} />
          <StatInline label="Created" value={profile.stats.nftsCreated} />
          <StatInline label="Collections" value={profile.stats.collections} />
          <StatInline label="Volume" value={profile.stats.totalVolume} />
          <StatInline label="Followers" value={profile.stats.followers.toLocaleString()} />
          <StatInline label="Following" value={profile.stats.following.toLocaleString()} />
        </div>
      </div>
    </div>
  );
}

function StatInline({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
