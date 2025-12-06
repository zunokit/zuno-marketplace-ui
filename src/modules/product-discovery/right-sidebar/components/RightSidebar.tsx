"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/tailwind-utils";
import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/shared/types/collection";

interface TrendingToken {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  priceChange: number;
  verified?: boolean;
}

interface RightSidebarProps {
  collections: Collection[];
  tokens?: TrendingToken[];
  isCollapsed?: boolean;
  onToggle?: () => void;
}

type TabType = "nfts" | "tokens";
type ViewMode = "compact" | "expanded";
type TimePeriod = "1d" | "7d" | "30d" | "all";

const VerifiedBadge = ({ size = "normal" }: { size?: "small" | "normal" }) => (
  <svg
    aria-label="Verified"
    className={size === "small" ? "size-3.5 shrink-0" : "size-4 shrink-0"}
    fill="rgb(32, 129, 226)"
    height="24"
    role="img"
    viewBox="0 -960 960 960"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z" />
    <path d="M438-338 L664-564 L608-622 L438-452 L352-538 L296-482 L438-338 Z" fill="white" />
  </svg>
);

const EthereumIcon = () => (
  <svg className="aspect-square overflow-hidden" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="nonzero">
      <rect fill="#627EEA" height="24" rx="0" width="24" />
      <g fill="#FFF">
        <path d="M11.998 3v6.652l5.623 2.513z" fillOpacity="0.602" />
        <path d="m11.998 3-5.623 9.165 5.623-2.512z" />
        <path d="M11.998 16.476v4.52l5.627-7.784z" fillOpacity="0.602" />
        <path d="M11.998 20.996v-4.52l-5.623-3.264z" />
        <path d="m11.998 15.43 5.623-3.265L12 9.654z" fillOpacity="0.2" />
        <path d="m6.375 12.165 5.623 3.265V9.654z" fillOpacity="0.602" />
      </g>
    </g>
  </svg>
);

const NFTsIcon = () => (
  <svg
    aria-label="Auto Awesome Mosaic"
    className="fill-current hidden xl:block"
    fill="currentColor"
    height="16"
    role="img"
    viewBox="0 -960 960 960"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M440-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v720Zm-80-80v-560H200v560h160Zm160-320v-320h240q33 0 56.5 23.5T840-760v240H520Zm80-80h160v-160H600v160Zm-80 480v-320h320v240q0 33-23.5 56.5T760-120H520Zm80-80h160v-160H600v160ZM360-480Zm240-120Zm0 240Z" />
  </svg>
);

const TokensIcon = () => (
  <svg
    aria-label="Toll"
    className="fill-current hidden xl:block"
    fill="currentColor"
    height="16"
    role="img"
    viewBox="0 -960 960 960"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M600-160q-134 0-227-93t-93-227q0-134 93-227t227-93q134 0 227 93t93 227q0 134-93 227t-227 93Zm-320-10q-106-28-173-114T40-480q0-110 67-196t173-114v84q-72 25-116 87t-44 139q0 77 44 139t116 87v84Zm320-310Zm0 240q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Z" />
  </svg>
);

const TableRowsIcon = () => (
  <svg
    aria-label="Table Rows"
    className="fill-current"
    fill="currentColor"
    height="20"
    role="img"
    viewBox="0 -960 960 960"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M760-200v-120H200v120h560Zm0-200v-160H200v160h560Zm0-240v-120H200v120h560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z" />
  </svg>
);

const TableRowsNarrowIcon = () => (
  <svg
    aria-label="Table Rows Narrow"
    className="fill-current"
    fill="currentColor"
    height="20"
    role="img"
    viewBox="0 -960 960 960"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M760-360v-80H200v80h560Zm0-160v-80H200v80h560Zm0-160v-80H200v80h560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm560-80v-80H200v80h560Z" />
  </svg>
);

const DoubleChevronRightIcon = () => (
  <svg
    aria-label="Right arrow"
    className="fill-current"
    fill="currentColor"
    height="20"
    role="img"
    viewBox="0 -960 960 960"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z" />
  </svg>
);

const DoubleChevronLeftIcon = () => (
  <svg
    aria-label="Left arrow"
    className="fill-current"
    fill="currentColor"
    height="20"
    role="img"
    viewBox="0 -960 960 960"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    aria-label="Chevron Left"
    className="fill-current transition duration-[250ms]"
    fill="currentColor"
    height="20"
    role="img"
    viewBox="0 -960 960 960"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
  </svg>
);

export function RightSidebar({ collections, tokens = [], isCollapsed: externalIsCollapsed, onToggle }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("nfts");
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1d");
  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false);

  const isCollapsed = externalIsCollapsed ?? false;
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const timePeriodLabels: Record<TimePeriod, string> = {
    "1d": "1d",
    "7d": "7d",
    "30d": "30d",
    all: "All",
  };

  const activeTabButtonStyles = cn(
    "inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm",
    "transition-[transform,background,border] duration-200 ease-out active:scale-[0.97]",
    "font-medium text-foreground h-8 rounded-md px-2.5 backdrop-blur-2xl cursor-pointer",
    "bg-frosted-2 hover:bg-frosted-6 focus:bg-frosted-6 active:bg-frosted-6",
    "border border-border-medium hover:border-border-strong focus:border-border-strong active:border-border-strong"
  );

  const inactiveTabButtonStyles = cn(
    "inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm",
    "transition-[transform,background,border] duration-200 ease-out active:scale-[0.97]",
    "text-os-gray-300 h-8 rounded-md px-2.5 backdrop-blur-2xl cursor-pointer",
    "bg-transparent hover:bg-frosted-1 focus:bg-frosted-1 active:bg-frosted-1",
    "border border-border-subtle hover:border-border-medium focus:border-border-medium active:border-border-medium"
  );

  return (
    <>
      {/* Expand Button (visible when collapsed) */}
      <button
        onClick={handleToggle}
        className={cn(
          "fixed right-0 top-1/2 z-50 -translate-y-1/2",
          "inline-flex items-center justify-center",
          "rounded-l-lg border border-r-0 border-border-subtle",
          "backdrop-blur-2xl bg-background p-2",
          "transition-all duration-700 ease-in-out",
          "hover:bg-frosted-1 hover:border-border-medium",
          isCollapsed ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        )}
        aria-label="Expand sidebar"
      >
        <DoubleChevronLeftIcon />
      </button>

      <aside
        className={cn(
          "fixed top-10 sm:top-11 lg:top-12 right-0",
          "hidden h-[calc(100vh-40px)] sm:h-[calc(100vh-44px)] lg:h-[calc(100vh-48px)]",
          "flex-shrink-0 border-l border-border-subtle bg-background",
          "transition-all duration-700 ease-in-out",
          "lg:flex lg:flex-col overflow-hidden z-30",
          isCollapsed ? "w-0 border-l-0" : "w-[420px]"
        )}
        role="complementary"
      >
        {/* Header */}
        <div className={cn(
          "flex justify-between h-[68px] shrink-0 items-center gap-2 px-2",
          isCollapsed ? "w-0" : "w-[420px]"
        )}>
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("nfts")}
              className={activeTab === "nfts" ? activeTabButtonStyles : inactiveTabButtonStyles}
              type="button"
              aria-checked={activeTab === "nfts"}
              role="switch"
            >
              <NFTsIcon />
              NFTs
            </button>
            <button
              onClick={() => setActiveTab("tokens")}
              className={activeTab === "tokens" ? activeTabButtonStyles : inactiveTabButtonStyles}
              type="button"
              aria-checked={activeTab === "tokens"}
              role="switch"
            >
              <TokensIcon />
              Tokens
            </button>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {/* Time Period Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTimePeriodDropdown(!showTimePeriodDropdown)}
                className={cn(
                  "inline-flex items-center whitespace-nowrap rounded-md",
                  "transition duration-200 min-w-16 h-8 gap-1 text-sm px-3 pr-2 justify-between",
                  "bg-transparent hover:bg-frosted-1",
                  "border border-border-subtle focus:outline-none focus-visible:outline-none",
                  showTimePeriodDropdown && "[&>svg]:-rotate-90"
                )}
                type="button"
                aria-haspopup="menu"
                aria-expanded={showTimePeriodDropdown}
              >
                {timePeriodLabels[timePeriod]}
                <ChevronLeftIcon />
              </button>
              {showTimePeriodDropdown && (
                <div className="absolute right-0 top-full z-10 mt-1 w-20 rounded-md border border-border-subtle bg-background shadow-lg">
                  {(Object.keys(timePeriodLabels) as TimePeriod[]).map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setTimePeriod(period);
                        setShowTimePeriodDropdown(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm transition-all duration-150",
                        "hover:bg-frosted-1 first:rounded-t-md last:rounded-b-md",
                        timePeriod === period && "bg-frosted-2 font-medium"
                      )}
                    >
                      {timePeriodLabels[period]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden xl:inline-flex rounded-md" role="group">
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                className={cn(
                  "relative flex items-center rounded-md py-1",
                  "text-os-gray-300 outline-hidden hover:text-foreground",
                  "transition-[transform,background,border] duration-200 ease-out active:scale-[0.97]",
                  "aspect-square justify-center text-sm h-8",
                  viewMode === "compact" && "font-medium text-foreground"
                )}
                role="radio"
                aria-checked={viewMode === "compact"}
              >
                <span className="relative z-[1]">
                  <TableRowsIcon />
                </span>
                {viewMode === "compact" && (
                  <span className="absolute inset-0 size-full rounded-md backdrop-blur-2xl bg-transparent border border-border-subtle" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("expanded")}
                className={cn(
                  "relative flex items-center rounded-md py-1",
                  "text-os-gray-300 outline-hidden hover:text-foreground",
                  "transition-[transform,background,border] duration-200 ease-out active:scale-[0.97]",
                  "aspect-square justify-center text-sm h-8",
                  viewMode === "expanded" && "font-medium text-foreground"
                )}
                role="radio"
                aria-checked={viewMode === "expanded"}
              >
                <span className="relative z-[1]">
                  <TableRowsNarrowIcon />
                </span>
                {viewMode === "expanded" && (
                  <span className="absolute inset-0 size-full rounded-md backdrop-blur-2xl bg-transparent border border-border-subtle" />
                )}
              </button>
            </div>

            {/* Collapse Button */}
            <button
              type="button"
              onClick={handleToggle}
              className={cn(
                "inline-flex items-center whitespace-nowrap rounded-md justify-center font-medium",
                "transition-[transform,background,border] duration-200 ease-out",
                "focus-visible:outline-none active:scale-[0.97]",
                "backdrop-blur-2xl h-8 w-8 p-1.5 cursor-pointer",
                "bg-transparent hover:bg-frosted-1 focus:bg-frosted-1 active:bg-frosted-1",
                "border border-border-subtle hover:border-border-medium"
              )}
              aria-label="Collapse sidebar"
            >
              <div className="flex pointer-events-none" aria-hidden="true">
                <DoubleChevronRightIcon />
              </div>
            </button>
          </div>
        </div>

        {/* Column Headers */}
        <div className={cn(
          "pb-2 inline-flex min-w-full overflow-auto h-6 min-h-6 bg-transparent px-2",
          "scrollbar-hidden",
          viewMode === "compact" ? "gap-2" : "gap-4",
          isCollapsed ? "w-0 overflow-hidden" : "w-[420px]"
        )} role="row">
          <div
            className="flex items-center shrink-0 overflow-hidden first:pl-2 last:pr-2 justify-start text-os-gray-300 font-mono uppercase text-xs w-[100px] grow"
            role="columnheader"
          >
            {activeTab === "nfts" ? "Collection" : "Token"}
          </div>
          <div
            className={cn(
              "flex items-center shrink-0 grow-0 overflow-hidden first:pl-2 last:pr-2 text-os-gray-300 font-mono uppercase text-xs justify-end whitespace-nowrap",
              viewMode === "compact" ? "w-[125px]" : "w-[104px]"
            )}
            role="columnheader"
          >
            {activeTab === "nfts" ? "Floor" : "Price"}
          </div>
          {viewMode === "expanded" && (
            <div
              className="flex items-center shrink-0 grow-0 overflow-hidden first:pl-2 last:pr-2 text-os-gray-300 font-mono uppercase text-xs w-[60px] justify-end whitespace-nowrap"
              role="columnheader"
            >
              % Change
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden scrollbar-hidden",
            isCollapsed ? "w-0" : "w-[420px]"
          )}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          role="rowgroup"
        >
          {activeTab === "nfts"
            ? collections.map((collection) => {
                const floorPrice = 0.5 + Math.random() * 5;
                const priceChange = (Math.random() - 0.5) * 50;
                const currency = "ETH";

                return viewMode === "compact" ? (
                  // Compact View (60px rows with chain badge)
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.slug}`}
                    className="cursor-pointer no-underline disabled:pointer-events-none disabled:opacity-40"
                  >
                    <div
                      className={cn(
                        "inline-flex relative w-max min-w-full items-center rounded group cursor-pointer",
                        "hover:bg-frosted-1 active:bg-frosted-2",
                        "h-[60px] text-sm gap-2"
                      )}
                      role="row"
                    >
                      {/* Collection Info Cell */}
                      <div
                        className="flex items-center shrink-0 first:pl-2 last:pr-2 justify-start overflow-visible w-[100px] grow"
                        role="cell"
                      >
                        <div className="flex items-center gap-3 w-auto max-w-full">
                          {/* Image with Chain Badge */}
                          <div className="relative inline-block shrink-0" style={{ width: 40, height: 40 }}>
                            <Image
                              src={collection.imageUrl || "/placeholder.svg"}
                              alt={collection.name}
                              width={40}
                              height={40}
                              className="aspect-square overflow-hidden min-h-10 min-w-10 shrink-0 rounded object-cover"
                            />
                            {/* Chain Badge */}
                            <div className="flex flex-col justify-center items-center absolute overflow-hidden right-[-3px] bottom-[-3px] size-4 rounded bg-frosted-2 p-0">
                              <EthereumIcon />
                            </div>
                          </div>
                          {/* Name and Verified Badge */}
                          <div className="flex flex-col justify-center order-2 min-w-0 overflow-hidden flex-auto items-start self-stretch">
                            <div className="flex items-center min-w-0 gap-1">
                              <div className="max-w-full truncate break-all min-w-0 flex-1 leading-tight">
                                <span className="leading-normal font-normal text-foreground text-sm cursor-pointer">
                                  {collection.name}
                                </span>
                              </div>
                              {collection.isVerified && <VerifiedBadge />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floor Price Cell */}
                      <div
                        className="flex items-center shrink-0 grow-0 overflow-hidden first:pl-2 last:pr-2 w-[125px] justify-end whitespace-nowrap"
                        role="cell"
                      >
                        <div className="flex flex-col min-w-0 items-end font-mono">
                          <div className="max-w-full truncate break-all">
                            <div className="inline-flex">
                              <div className="items-center inline-flex gap-1 truncate cursor-pointer">
                                <span className="font-mono text-foreground">
                                  {floorPrice.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                                <span className="text-os-gray-300 font-mono">&nbsp;{currency}</span>
                              </div>
                            </div>
                          </div>
                          <div className="inline-flex">
                            <span className={cn("font-mono", priceChange >= 0 ? "text-success" : "text-destructive")}>
                              {priceChange >= 0 ? "+" : ""}
                              {priceChange.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  // Expanded View (32px rows, no chain badge, 3 columns)
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.slug}`}
                    className="cursor-pointer no-underline disabled:pointer-events-none disabled:opacity-40"
                  >
                    <div
                      className={cn(
                        "inline-flex relative w-max min-w-full items-center rounded group cursor-pointer",
                        "hover:bg-frosted-1 active:bg-frosted-2",
                        "h-8 text-sm gap-4"
                      )}
                      role="row"
                    >
                      {/* Collection Info Cell */}
                      <div
                        className="flex items-center shrink-0 first:pl-2 last:pr-2 justify-start w-[100px] grow overflow-hidden"
                        role="cell"
                      >
                        <div className="flex items-center gap-2 w-auto max-w-full">
                          {/* Image (smaller, no chain badge) */}
                          <div className="relative inline-block shrink-0">
                            <Image
                              src={collection.imageUrl || "/placeholder.svg"}
                              alt={collection.name}
                              width={24}
                              height={24}
                              className="aspect-square overflow-hidden size-6 min-h-6 min-w-6 shrink-0 rounded object-cover"
                            />
                            <div className="absolute inset-0 inset-shadow-border rounded" />
                          </div>
                          {/* Name and Verified Badge */}
                          <div className="flex flex-col justify-center order-2 min-w-0 overflow-hidden flex-auto items-start self-stretch">
                            <div className="flex items-center min-w-0 gap-1">
                              <div className="max-w-full truncate break-all min-w-0 flex-1 leading-tight">
                                <span className="leading-normal font-normal text-foreground text-sm cursor-pointer">
                                  {collection.name}
                                </span>
                              </div>
                              {collection.isVerified && <VerifiedBadge size="small" />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floor Price Cell */}
                      <div
                        className="flex items-center shrink-0 grow-0 overflow-hidden first:pl-2 last:pr-2 w-[104px] justify-end whitespace-nowrap font-mono"
                        role="cell"
                      >
                        <div className="max-w-full truncate break-all">
                          <div className="inline-flex">
                            <div className="items-center inline-flex gap-1 truncate cursor-pointer">
                              <span className="font-mono text-foreground">
                                {floorPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <span className="text-os-gray-300 font-mono">&nbsp;{currency}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* % Change Cell */}
                      <div
                        className="flex items-center shrink-0 grow-0 overflow-hidden first:pl-2 last:pr-2 w-[60px] justify-end whitespace-nowrap font-mono"
                        role="cell"
                      >
                        <div className="inline-flex">
                          <span className={cn("font-mono", priceChange >= 0 ? "text-success" : "text-destructive")}>
                            {priceChange >= 0 ? "+" : ""}
                            {priceChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            : tokens.map((token) =>
                viewMode === "compact" ? (
                  // Compact View (60px rows with chain badge)
                  <div
                    key={token.id}
                    className={cn(
                      "inline-flex relative w-max min-w-full items-center rounded group cursor-pointer",
                      "hover:bg-frosted-1 active:bg-frosted-2",
                      "h-[60px] text-sm gap-2"
                    )}
                    role="row"
                  >
                    {/* Token Info Cell */}
                    <div
                      className="flex items-center shrink-0 first:pl-2 last:pr-2 justify-start overflow-visible w-[100px] grow"
                      role="cell"
                    >
                      <div className="flex items-center gap-3 w-auto max-w-full">
                        {/* Image with Chain Badge */}
                        <div className="relative inline-block shrink-0" style={{ width: 40, height: 40 }}>
                          <Image
                            src={token.icon || "/placeholder.svg"}
                            alt={token.name}
                            width={40}
                            height={40}
                            className="aspect-square overflow-hidden min-h-10 min-w-10 shrink-0 rounded-full object-cover"
                          />
                          {/* Chain Badge */}
                          <div className="flex flex-col justify-center items-center absolute overflow-hidden right-[-3px] bottom-[-3px] size-4 rounded bg-frosted-2 p-0">
                            <EthereumIcon />
                          </div>
                        </div>
                        {/* Name and Verified Badge */}
                        <div className="flex flex-col justify-center order-2 min-w-0 overflow-hidden flex-auto items-start self-stretch">
                          <div className="flex items-center min-w-0 gap-1">
                            <div className="max-w-full truncate break-all min-w-0 flex-1 leading-tight">
                              <span className="leading-normal font-normal text-foreground text-sm cursor-pointer">
                                {token.name}
                              </span>
                            </div>
                            {token.verified && <VerifiedBadge />}
                          </div>
                          <span className="text-xs text-os-gray-300">{token.symbol}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Cell */}
                    <div
                      className="flex items-center shrink-0 grow-0 overflow-hidden first:pl-2 last:pr-2 w-[125px] justify-end whitespace-nowrap"
                      role="cell"
                    >
                      <div className="flex flex-col min-w-0 items-end font-mono">
                        <div className="max-w-full truncate break-all">
                          <div className="inline-flex">
                            <div className="items-center inline-flex gap-1 truncate cursor-pointer">
                              <span className="font-mono text-foreground">
                                {token.price < 0.01 ? "< " : ""}$
                                {token.price < 0.01
                                  ? token.price.toFixed(6)
                                  : token.price.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 4,
                                    })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex">
                          <span className={cn("font-mono", token.priceChange >= 0 ? "text-success" : "text-destructive")}>
                            {token.priceChange >= 0 ? "+" : ""}
                            {token.priceChange}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Expanded View (32px rows, no chain badge, 3 columns)
                  <div
                    key={token.id}
                    className={cn(
                      "inline-flex relative w-max min-w-full items-center rounded group cursor-pointer",
                      "hover:bg-frosted-1 active:bg-frosted-2",
                      "h-8 text-sm gap-4"
                    )}
                    role="row"
                  >
                    {/* Token Info Cell */}
                    <div
                      className="flex items-center shrink-0 first:pl-2 last:pr-2 justify-start w-[100px] grow overflow-hidden"
                      role="cell"
                    >
                      <div className="flex items-center gap-2 w-auto max-w-full">
                        {/* Image (smaller, no chain badge) */}
                        <div className="relative inline-block shrink-0">
                          <Image
                            src={token.icon || "/placeholder.svg"}
                            alt={token.name}
                            width={24}
                            height={24}
                            className="aspect-square overflow-hidden size-6 min-h-6 min-w-6 shrink-0 rounded-full object-cover"
                          />
                          <div className="absolute inset-0 inset-shadow-border rounded-full" />
                        </div>
                        {/* Name and Verified Badge */}
                        <div className="flex flex-col justify-center order-2 min-w-0 overflow-hidden flex-auto items-start self-stretch">
                          <div className="flex items-center min-w-0 gap-1">
                            <div className="max-w-full truncate break-all min-w-0 flex-1 leading-tight">
                              <span className="leading-normal font-normal text-foreground text-sm cursor-pointer">
                                {token.name}
                              </span>
                            </div>
                            {token.verified && <VerifiedBadge size="small" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Cell */}
                    <div
                      className="flex items-center shrink-0 grow-0 overflow-hidden first:pl-2 last:pr-2 w-[104px] justify-end whitespace-nowrap font-mono"
                      role="cell"
                    >
                      <div className="max-w-full truncate break-all">
                        <div className="inline-flex">
                          <div className="items-center inline-flex gap-1 truncate cursor-pointer">
                            <span className="font-mono text-foreground">
                              {token.price < 0.01 ? "< " : ""}$
                              {token.price < 0.01
                                ? token.price.toFixed(6)
                                : token.price.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 4,
                                  })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* % Change Cell */}
                    <div
                      className="flex items-center shrink-0 grow-0 overflow-hidden first:pl-2 last:pr-2 w-[60px] justify-end whitespace-nowrap font-mono"
                      role="cell"
                    >
                      <div className="inline-flex">
                        <span className={cn("font-mono", token.priceChange >= 0 ? "text-success" : "text-destructive")}>
                          {token.priceChange >= 0 ? "+" : ""}
                          {token.priceChange}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
        </div>
      </aside>
    </>
  );
}
