"use client";

import { cn } from "@/shared/utils/tailwind-utils";
import { ConnectWalletButton } from "@/shared/components/wallet/ConnectWalletButton";
import Link from "next/link";
import { useScroll } from "@/shared/hooks/use-scroll";

const SearchIcon = () => (
  <svg className="fill-current size-[18px] shrink-0" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="fill-current size-5" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
    <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
  </svg>
);

export default function TopNav() {
  const isScrolled = useScroll(10);

  return (
    <nav
      aria-label="Top Navigation"
      className={cn(
        "fixed top-0 left-0 right-0 z-40 flex h-10 sm:h-11 lg:h-12 py-1.5 sm:py-2",
        "transition-colors duration-200 ease-out"
      )}
    >
      {/* Background with border */}
      <div
        className={cn(
          "absolute inset-0 -z-10 pointer-events-none",
          "border-b border-border-subtle",
          isScrolled ? "bg-frosted-2 backdrop-blur-xl" : "bg-background"
        )}
      />

      {/* Content container - with left padding for sidebar on lg+ */}
      <div className="min-h-0 w-full min-w-0 px-3 sm:px-4 lg:px-6 lg:pl-[68px] flex items-center justify-between gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "inline-flex items-center whitespace-nowrap h-7 sm:h-8 gap-1.5 text-sm px-2 sm:px-2.5 w-full cursor-text rounded-md",
              "border border-border-subtle hover:bg-frosted-1",
              "bg-frosted-1 backdrop-blur-lg",
              "max-w-[160px] sm:max-w-[220px] lg:max-w-[320px]",
              "transition-[background-color,box-shadow] duration-150 ease-out"
            )}
          >
            <div className="flex items-center min-w-fit text-foreground">
              <SearchIcon />
            </div>
            <input
              aria-invalid="false"
              autoComplete="off"
              data-testid="NavSearch"
              placeholder="Search"
              className={cn(
                "w-full border-0 bg-transparent outline-none",
                "text-xs sm:text-sm text-foreground placeholder:text-muted-foreground",
                "[appearance:textfield]",
                "[&::-webkit-inner-spin-button]:appearance-none",
                "[&::-webkit-outer-spin-button]:appearance-none"
              )}
            />
            {/* Keyboard shortcut indicator - hidden on mobile */}
            <div className="hidden sm:flex items-center min-w-fit">
              <div className="flex flex-col justify-center items-center size-5 rounded border border-border-subtle bg-frosted-2 text-muted-foreground">
                <span className="leading-normal text-xs">/</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center shrink-0 gap-0.5 sm:gap-1">
          {/* Connect Wallet Button */}
          <ConnectWalletButton />

          {/* Separator - hidden on mobile */}
          <div
            data-orientation="vertical"
            role="none"
            className="hidden sm:block shrink-0 bg-border-subtle w-px h-5 sm:h-6"
          />

          {/* Profile Button */}
          <Link
            href="/profile"
            aria-label="Profile"
            className={cn(
              "inline-flex items-center justify-center rounded-md h-7 w-7 sm:h-8 sm:w-8 p-1.5",
              "font-medium transition-[transform,colors] duration-200 ease-out",
              "focus-visible:outline-none active:scale-[0.97]",
              "hover:bg-frosted-2 focus:bg-frosted-2 active:bg-frosted-2"
            )}
          >
            <div className="flex pointer-events-none" aria-hidden="true">
              <ProfileIcon />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
