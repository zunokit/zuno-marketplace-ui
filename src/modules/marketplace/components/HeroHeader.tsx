"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/shared/utils/tailwind-utils";
import { Button } from "@/shared/components/ui/button";
import {
  Star,
  Copy,
  Globe,
  Share2,
  MoreHorizontal,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Collection } from "@/shared/utils/mock/collection";

// Verified Badge SVG Component
function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Verified"
      className={cn("fill-[#2081E2] size-6 shrink-0", className)}
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z" />
      <path className="fill-white" d="M438-338 L664-564 L608-622 L438-452 L352-538 L296-482 L438-338 Z" />
    </svg>
  );
}

// X (Twitter) Icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="X"
      className={cn("fill-current", className)}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
    >
      <path d="M9.14163 7.19284L13.6089 2H12.5503L8.67137 6.50887L5.57328 2H2L6.68492 8.81821L2 14.2637H3.05866L7.15491 9.50218L10.4267 14.2637H14L9.14163 7.19284ZM7.69165 8.87828L7.21697 8.19934L3.44011 2.79694H5.06615L8.11412 7.15685L8.5888 7.83579L12.5508 13.503H10.9248L7.69165 8.87828Z" />
    </svg>
  );
}

// Ethereum Icon
function EthereumIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("overflow-hidden aspect-auto h-2.5 w-auto translate-y-[-0.3px]", className)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="fill-current" fillRule="nonzero">
        <path d="m12 16.576 7.498-4.353L12 8.873zM4.5 12.223l7.5 4.353V8.874zM12 0v8.872l7.498 3.35z" />
        <path d="M12 0 4.5 12.223 12 8.872zM12 17.972V24l7.503-10.381zM12 24v-6.03L4.5 13.62z" />
      </g>
    </svg>
  );
}

// Stats Item Component
interface StatItemProps {
  label: string;
  value: string | number;
  suffix?: string;
  subValue?: string;
  className?: string;
}

function StatItem({ label, value, suffix, subValue, className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col items-end gap-2 whitespace-nowrap select-text", className)}>
      <span className="leading-tight font-mono uppercase text-xs opacity-60 self-start md:self-auto">
        {label}
      </span>
      <span className="leading-tight font-mono uppercase font-medium inline-flex items-center text-xs md:text-sm">
        <span className="font-mono text-foreground">{value}</span>
        {suffix && <span className="text-current font-mono">&nbsp;{suffix}</span>}
        {subValue && <span className="text-os-gray-300 ml-1">({subValue})</span>}
      </span>
    </div>
  );
}

// Tag Badge Component
interface TagBadgeProps {
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
}

function TagBadge({ children, href, icon, className }: TagBadgeProps) {
  const content = (
    <div
      className={cn(
        "flex items-center h-[18px] w-fit whitespace-nowrap rounded px-1.5 py-1",
        "border border-frosted-6 bg-frosted-2 font-mono uppercase text-xs gap-1 cursor-pointer",
        "hover:bg-frosted-6 transition-colors",
        className
      )}
    >
      {icon}
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

// Mock data for demo purposes
const MOCK_COLLECTION_DATA = {
  name: "REGULAR ANIMALS",
  image: "https://picsum.photos/seed/nft-avatar/250/250",
  videoUrl: "/videos/hero-banner.mp4",
  bannerImage: "https://picsum.photos/seed/nft-banner/1920/600",
  contractAddress: "0xfa3ac053d3afb13d0e22a2c8420a8421c07e339c",
  verified: true,
  totalSupply: 129,
  chain: "Ethereum",
  category: "Art",
  createdDate: "Dec 2025",
  websiteUrl: "https://regularanimals.ai/",
  twitterUrl: "https://x.com/beeple",
  stats: {
    floorPrice: "11.50",
    topOffer: "6.89",
    totalVolume: "25.45",
    volume24h: "25.45",
    listed: "5.43",
    owners: 70,
    ownerPercentage: "54.26",
  },
};

interface HeroHeaderProps {
  collection?: Collection;
  videoUrl?: string;
  bannerUrl?: string;
  useMockData?: boolean;
}

export default function HeroHeader({
  collection,
  videoUrl,
  bannerUrl,
  useMockData = true
}: HeroHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Use mock data or real collection data
  const displayData = useMockData ? {
    name: MOCK_COLLECTION_DATA.name,
    image: MOCK_COLLECTION_DATA.image,
    contractAddress: MOCK_COLLECTION_DATA.contractAddress,
    verified: MOCK_COLLECTION_DATA.verified,
    totalSupply: MOCK_COLLECTION_DATA.totalSupply,
    description: collection?.description,
  } : {
    name: collection?.name || "Collection",
    image: collection?.image || "/placeholder-nft.png",
    contractAddress: collection?.contractAddress || "0x0000",
    verified: collection?.verified || false,
    totalSupply: collection?.totalSupply || 0,
    description: collection?.description,
  };

  // Media URL priority: props > mock banner image (use image instead of video for reliability)
  const mediaUrl = videoUrl || bannerUrl || MOCK_COLLECTION_DATA.bannerImage;
  const isVideo = mediaUrl.includes(".mp4") || mediaUrl.includes(".webm");

  // Stats data
  const stats = useMockData ? MOCK_COLLECTION_DATA.stats : {
    floorPrice: collection?.floorPrice || "0.00",
    topOffer: "0.00",
    totalVolume: collection?.volume24h || "0.00",
    listed: "0.00",
    owners: collection?.owners || 0,
    ownerPercentage: "0.00",
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(displayData.contractAddress);
    toast.success("Contract address copied!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div id="hero-header" className="relative">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div
          className={cn(
            "pointer-events-auto right-0 flex w-full z-10 absolute transition-all duration-500 ease-out",
            isExpanded
              ? "aspect-[8/3] xl:h-[min(670px,calc(100vh-400px))] xl:min-w-full"
              : "h-24"
          )}
        >
          {/* Content Overlay */}
          <div className="mx-auto min-h-0 min-w-0  px-4 md:px-6 z-[1] flex w-full items-end dark">
            <div
              className={cn(
                "flex w-full min-w-0 flex-col pb-4 md:grid md:grid-cols-[1fr_auto] md:items-end md:justify-between xl:gap-4 xl:pb-5",
                "transition-all duration-300"
              )}
            >
              {/* Left Column: Collection Info */}
              <div className="flex flex-col md:grow">
                <div className="flex w-full items-center gap-3 border-0 p-0 min-w-0 select-text">
                  {/* Avatar */}
                  <div className="flex group relative">
                    <div className="relative inline-block shrink-0" style={{ width: 60, height: 60 }}>
                      <Image
                        alt={displayData.name}
                        width={60}
                        height={60}
                        className="object-cover aspect-square overflow-hidden rounded max-h-[60px] max-w-[60px]"
                        src={displayData.image}
                      />
                      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded" />
                    </div>
                  </div>

                  {/* Title and Actions */}
                  <div className="flex flex-col justify-center min-w-0 flex-auto items-start self-stretch gap-1 overflow-visible">
                    <div className="flex w-full min-w-0 flex-col items-start gap-2 md:flex-row md:items-center md:gap-0">
                      {/* Title with Verified Badge */}
                      <div className="flex min-w-0 items-center gap-2">
                        <h1 className="flex items-center gap-4">
                          <span className="leading-normal font-medium text-foreground text-xl md:text-2xl line-clamp-1">
                            {displayData.name}
                          </span>
                          {displayData.verified && <VerifiedBadge />}
                        </h1>

                        {/* Star Button */}
                        <button
                          className="inline-flex items-center disabled:pointer-events-none disabled:opacity-40 hover:opacity-70 transition-opacity"
                          type="button"
                          onClick={() => setIsStarred(!isStarred)}
                        >
                          <Star
                            className={cn(
                              "size-5",
                              isStarred ? "fill-warning text-warning" : "text-current"
                            )}
                          />
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="hidden md:flex h-full items-center">
                        <div className="shrink-0 bg-frosted-6 h-full mx-4 max-h-6 w-[2px]" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-5">
                        <button
                          className="inline-flex items-center hover:opacity-70 transition-opacity"
                          type="button"
                          onClick={handleCopyAddress}
                        >
                          <Copy className="size-5 text-foreground" />
                        </button>

                        {displayData.description && (
                          <Link
                            href={MOCK_COLLECTION_DATA.websiteUrl}
                            className="no-underline hover:opacity-70 transition-opacity"
                            target="_blank"
                            rel="nofollow noopener"
                          >
                            <Globe className="size-5 text-foreground" />
                          </Link>
                        )}

                        <Link
                          href={MOCK_COLLECTION_DATA.twitterUrl}
                          className="no-underline hover:opacity-70 transition-opacity"
                          target="_blank"
                          rel="nofollow noopener"
                        >
                          <XIcon className="size-5 text-foreground hover:text-os-gray-300" />
                        </Link>

                        <button
                          className="inline-flex items-center hover:opacity-70 transition-opacity"
                          type="button"
                          onClick={handleShare}
                        >
                          <Share2 className="size-5 text-foreground" />
                        </button>

                        <button
                          className="inline-flex items-center hover:opacity-70 transition-opacity"
                          type="button"
                        >
                          <MoreHorizontal className="size-5 text-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Tags Row */}
                    <div className="flex scrollbar-hide w-full flex-nowrap gap-2 overflow-auto mt-2">
                      <TagBadge href={`/${displayData.contractAddress.slice(0, 8)}/created`}>
                        <span className="truncate break-all max-w-[150px]">
                          By {displayData.contractAddress.slice(0, 6)}
                        </span>
                      </TagBadge>

                      <TagBadge href="/collections?chains=ethereum" icon={<EthereumIcon />}>
                        {MOCK_COLLECTION_DATA.chain}
                      </TagBadge>

                      <TagBadge icon={<Layers className="size-3" />}>
                        <span className="font-mono">{displayData.totalSupply}</span>
                      </TagBadge>

                      <TagBadge>{MOCK_COLLECTION_DATA.createdDate}</TagBadge>

                      <TagBadge href="/collections?category=art">{MOCK_COLLECTION_DATA.category}</TagBadge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Stats */}
              <div className="mt-4 flex min-w-0 flex-col overflow-x-visible md:mt-0 md:flex-row md:justify-end md:pl-8 md:[mask-image:linear-gradient(to_right,transparent,black_32px)]">
                <div className="mt-6 gap-3">
                  <div className="flex items-center overflow-hidden md:gap-8 md:justify-end">
                    <div className="flex group/stat-display flex-none gap-4 overflow-hidden md:gap-8 w-full justify-between md:w-auto">
                      <StatItem label="Floor price" value={stats.floorPrice} suffix="ETH" />
                      <StatItem label="Top offer" value={stats.topOffer} suffix="WETH" />
                      <StatItem label="Total volume" value={stats.totalVolume} suffix="ETH" />
                      <div className="hidden md:flex md:hidden 3xl:flex">
                        <StatItem label="Listed" value={stats.listed} suffix="%" />
                      </div>
                      <div className="hidden md:flex md:hidden 2xl:flex">
                        <StatItem
                          label="Owners (Unique)"
                          value={stats.owners}
                          subValue={`${stats.ownerPercentage}%`}
                        />
                      </div>
                    </div>

                    {/* Collapse/Expand Banner Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 backdrop-blur-2xl bg-frosted-2 hover:bg-frosted-6 border border-frosted-6"
                      onClick={() => setIsExpanded(!isExpanded)}
                      title={isExpanded ? "Hide banner" : "Show banner"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-5" />
                      ) : (
                        <ChevronDown className="size-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Media - Hide/Show based on isExpanded */}
        <div
          className={cn(
            "absolute right-0 flex w-full pointer-events-none top-0 z-0 overflow-hidden transition-all duration-500 ease-out",
            isExpanded
              ? "aspect-[8/3] xl:h-[min(670px,calc(100vh-400px))] xl:min-w-full opacity-100"
              : "h-24 opacity-30"
          )}
        >
          <div className="absolute inset-0 transition-opacity duration-1000 ease-out top-0 size-full overflow-hidden z-10">
            <div className="relative size-full inset-0">
              {isVideo ? (
                <video
                  className="size-full object-cover object-center"
                  loop
                  playsInline
                  autoPlay
                  muted
                >
                  <source src={mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={mediaUrl}
                  alt={displayData.name}
                  fill
                  className="object-cover object-center"
                  priority
                />
              )}
              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 z-20 dark transition-opacity duration-500 ease-out"
                style={{
                  background: isExpanded
                    ? "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 75%, rgb(0,0,0) 100%)"
                    : "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgb(0,0,0) 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Spacer for layout */}
        <div
          className={cn(
            "pointer-events-none opacity-0 -mx-4 md:-mx-6 relative w-full transition-all duration-500 ease-out",
            isExpanded
              ? "aspect-[8/3] xl:h-[min(670px,calc(100vh-400px))] xl:min-w-full"
              : "h-24"
          )}
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-4 md:p-6">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative shrink-0" style={{ width: 48, height: 48 }}>
            <Image
              alt={displayData.name}
              width={48}
              height={48}
              className="object-cover aspect-square overflow-hidden rounded"
              src={displayData.image}
            />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium text-foreground truncate">
                {displayData.name}
              </h1>
              {displayData.verified && <VerifiedBadge className="size-5" />}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <TagBadge icon={<EthereumIcon />}>{MOCK_COLLECTION_DATA.chain}</TagBadge>
              <TagBadge>{displayData.totalSupply} items</TagBadge>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-frosted-6">
          <div className="text-center">
            <div className="text-xs text-os-gray-300 font-mono uppercase">Floor</div>
            <div className="text-sm font-medium font-mono mt-1">{stats.floorPrice} ETH</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-os-gray-300 font-mono uppercase">Volume</div>
            <div className="text-sm font-medium font-mono mt-1">{stats.totalVolume} ETH</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-os-gray-300 font-mono uppercase">Owners</div>
            <div className="text-sm font-medium font-mono mt-1">{stats.owners}</div>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsStarred(!isStarred)}>
              <Star
                className={cn(
                  "size-5",
                  isStarred ? "fill-warning text-warning" : "text-foreground"
                )}
              />
            </button>
            <button onClick={handleShare}>
              <Share2 className="size-5 text-foreground" />
            </button>
            <button onClick={handleCopyAddress}>
              <Copy className="size-5 text-foreground" />
            </button>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            <MoreHorizontal className="size-4 mr-1" />
            More
          </Button>
        </div>
      </div>
    </div>
  );
}
