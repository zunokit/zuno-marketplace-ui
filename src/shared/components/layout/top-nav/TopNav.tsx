"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/utils/tailwind-utils";
import { ConnectWalletButton } from "@/shared/components/wallet/ConnectWalletButton";
import Link from "next/link";
import Image from "next/image";
import { useScroll } from "@/shared/hooks/use-scroll";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const SearchIcon = () => (
  <svg
    className="fill-current size-[18px] shrink-0"
    viewBox="0 -960 960 960"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="fill-current size-5" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
    <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="fill-current size-5" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
  </svg>
);

const DiscoverIcon = () => (
  <svg
    className="fill-current size-5 shrink-0"
    viewBox="0 -960 960 960"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m260-260 300-140 140-300-300 140-140 300Zm220-180q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520q17 0 28.5 11.5T520-480q0 17-11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
  </svg>
);

const CollectionsIcon = () => (
  <svg
    className="fill-current size-5 shrink-0"
    viewBox="0 -960 960 960"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M440-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v720Zm-80-80v-560H200v560h160Zm160-320v-320h240q33 0 56.5 23.5T840-760v240H520Zm80-80h160v-160H600v160Zm-80 480v-320h320v240q0 33-23.5 56.5T760-120H520Zm80-80h160v-160H600v160ZM360-480Zm240-120Zm0 240Z" />
  </svg>
);

const TokensIcon = () => (
  <svg
    className="fill-current size-5 shrink-0"
    viewBox="0 -960 960 960"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M600-160q-134 0-227-93t-93-227q0-134 93-227t227-93q134 0 227 93t93 227q0 134-93 227t-227 93Zm-320-10q-106-28-173-114T40-480q0-110 67-196t173-114v84q-72 25-116 87t-44 139q0 77 44 139t116 87v84Zm320-310Zm0 240q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70Z" />
  </svg>
);

const ActivityIcon = () => (
  <svg
    className="fill-current size-5 shrink-0"
    viewBox="0 -960 960 960"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M100-180v-121.54h121.54V-180H100Zm216.92 0v-121.54H860V-180H316.92ZM100-419.23v-121.54h121.54v121.54H100Zm216.92 0v-121.54H860v121.54H316.92ZM100-658.46V-780h121.54v121.54H100Zm216.92 0V-780H860v121.54H316.92Z" />
  </svg>
);

const StudioIcon = () => (
  <svg
    className="fill-current size-5 shrink-0"
    viewBox="0 -960 960 960"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z" />
  </svg>
);

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-md h-7 w-7 sm:h-8 sm:w-8 p-1.5",
        "font-medium transition-[transform,colors] duration-200 ease-out",
        "focus-visible:outline-none active:scale-[0.97]",
        "hover:bg-frosted-2 focus:bg-frosted-2 active:bg-frosted-2"
      )}
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
};

const SettingsIcon = () => (
  <svg
    className="fill-current size-5 shrink-0"
    viewBox="0 -960 960 960"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
  </svg>
);

interface MobileNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const MobileNavItem = ({ href, icon, label, isActive, onClick }: MobileNavItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-3 rounded-md p-3 transition-colors duration-200",
      "hover:bg-frosted-2",
      isActive ? "bg-frosted-2 text-foreground" : "text-muted-foreground"
    )}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
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
        {/* Logo - visible on mobile/tablet, hidden on lg+ (left sidebar has logo) */}
        <Link href="/" className="lg:hidden flex items-center gap-1.5 shrink-0">
          <Image
            src="https://zunokit.github.io/zuno-marketplace-assets/images/zuno-logo.png"
            alt="Zuno"
            width={24}
            height={24}
            className="size-6 rounded-full"
          />
          <span className="text-sm font-medium tracking-wide">ZUNO</span>
        </Link>

        {/* Search Bar - full on sm+, icon only on mobile */}
        <div className="min-w-0 flex-1 flex justify-end sm:justify-start">
          {/* Mobile: Search icon button */}
          <button
            type="button"
            className={cn(
              "sm:hidden inline-flex items-center justify-center rounded-md h-7 w-7 p-1.5",
              "transition-[transform,colors] duration-200 ease-out",
              "focus-visible:outline-none active:scale-[0.97]",
              "hover:bg-frosted-2 focus:bg-frosted-2 active:bg-frosted-2"
            )}
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          {/* Desktop/Tablet: Full search input */}
          <div
            className={cn(
              "hidden sm:inline-flex items-center whitespace-nowrap h-8 gap-1.5 text-sm px-2.5 w-full cursor-text rounded-md",
              "border border-border-subtle hover:bg-frosted-1",
              "bg-frosted-1 backdrop-blur-lg",
              "max-w-[220px] lg:max-w-[320px]",
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
                "text-sm text-foreground placeholder:text-muted-foreground",
                "[appearance:textfield]",
                "[&::-webkit-inner-spin-button]:appearance-none",
                "[&::-webkit-outer-spin-button]:appearance-none"
              )}
            />
            {/* Keyboard shortcut indicator */}
            <div className="hidden lg:flex items-center min-w-fit">
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

          {/* Theme Toggle - always visible */}
          <ThemeToggle />

          {/* Profile Button - hidden on mobile */}
          <Link
            href="/profile"
            aria-label="Profile"
            className={cn(
              "hidden sm:inline-flex items-center justify-center rounded-md h-7 w-7 sm:h-8 sm:w-8 p-1.5",
              "font-medium transition-[transform,colors] duration-200 ease-out",
              "focus-visible:outline-none active:scale-[0.97]",
              "hover:bg-frosted-2 focus:bg-frosted-2 active:bg-frosted-2"
            )}
          >
            <div className="flex pointer-events-none" aria-hidden="true">
              <ProfileIcon />
            </div>
          </Link>

          {/* Mobile Menu Button - visible on mobile/tablet, hidden on lg+ */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className={cn(
              "lg:hidden inline-flex items-center justify-center rounded-md h-7 w-7 sm:h-8 sm:w-8 p-1.5",
              "font-medium transition-[transform,colors] duration-200 ease-out",
              "focus-visible:outline-none active:scale-[0.97]",
              "hover:bg-frosted-2 focus:bg-frosted-2 active:bg-frosted-2"
            )}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
          <SheetHeader className="p-4 border-b border-border-subtle">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col p-2 overflow-y-auto">
            {/* Navigation Items */}
            <MobileNavItem
              href="/"
              icon={<DiscoverIcon />}
              label="Discover"
              isActive={pathname === "/"}
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileNavItem
              href="/collections"
              icon={<CollectionsIcon />}
              label="Collections"
              isActive={pathname?.startsWith("/collections")}
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileNavItem
              href="/tokens"
              icon={<TokensIcon />}
              label="Tokens"
              isActive={pathname?.startsWith("/tokens")}
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileNavItem
              href="/activity"
              icon={<ActivityIcon />}
              label="Activity"
              isActive={pathname?.startsWith("/activity")}
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileNavItem
              href="/studio"
              icon={<StudioIcon />}
              label="Studio"
              isActive={pathname?.startsWith("/studio")}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Separator */}
            <div className="h-px bg-border-subtle my-2" />

            <MobileNavItem
              href="/profile"
              icon={<ProfileIcon />}
              label="Profile"
              isActive={pathname?.startsWith("/profile")}
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileNavItem
              href="/settings"
              icon={<SettingsIcon />}
              label="Settings"
              isActive={pathname?.startsWith("/settings")}
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
