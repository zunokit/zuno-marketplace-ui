"use client";
import MobileMenu from "@/shared/components/layout/nav-bar/MobileMenu";
import NavDropdown from "@/shared/components/layout/nav-bar/NavDropdown";
import SearchBar from "@/shared/components/layout/nav-bar/SearchBar";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useScroll } from "@/shared/hooks/use-scroll";
import { getNavItems } from "@/shared/utils/menu";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/shared/utils/tailwind-utils";
import { ConnectWalletButton } from "@/shared/components/wallet/ConnectWalletButton";

export default function Header() {
  const isMobile = useIsMobile();
  const isScrolled = useScroll(10);

  // Get authentication status from Redux
  //   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Get the appropriate nav items based on authentication status
  const allNavItems = getNavItems(true);

  // Filter out Stats menu on mobile since it's in footer
  const navItems = isMobile ? allNavItems.filter(item => item.id !== "stats") : allNavItems;
  return (
    <header
      className={cn(
        "border-b py-3 transition-all duration-150",
        isScrolled
          ? "bg-frosted-2 backdrop-blur-xl border-border-subtle"
          : "bg-background border-border-subtle"
      )}
    >
      <div className="flex items-center justify-between gap-0.5 sm:gap-1 md:gap-2 lg:gap-3 px-2 sm:px-3 md:px-4 lg:px-6 mx-auto max-w-[1920px] w-full">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
            <Image
              src="https://zunokit.github.io/zuno-marketplace-assets/images/zuno-logo.png"
              alt="Zuno"
              width={32}
              height={32}
              className="w-7 h-7 sm:w-8 sm:h-8"
            />
            <div className="hidden sm:block text-base md:text-lg lg:text-xl font-medium tracking-wide text-foreground whitespace-nowrap font-sans">
              ZUNO
            </div>
          </Link>

          {/* Desktop Navigation - Only show on desktop (lg+) */}
          {!isMobile && (
            <nav className="hidden lg:flex items-center space-x-0 xl:space-x-0.5 shrink-0 ml-1 xl:ml-2">
              {navItems.map(item => (
                <NavDropdown
                  key={item.id}
                  href={item.href}
                  active={false}
                  hasDropdown={item.hasDropdown}
                  dropdownItems={item.dropdownItems}
                >
                  {item.label}
                </NavDropdown>
              ))}
            </nav>
          )}
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 flex justify-center min-w-0 px-1 sm:px-2 md:px-4">
          <div className={cn(
            "w-full",
            isMobile
              ? "max-w-[160px] sm:max-w-[200px] md:max-w-[280px]"
              : "max-w-[240px] lg:max-w-[280px] xl:max-w-md"
          )}>
            <SearchBar isMobile={isMobile} />
          </div>
        </div>

        {/* Right Section - Wallet & Mobile Menu */}
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 pl-1 sm:pl-1.5 md:pl-2 border-l border-transparent sm:border-border-subtle shrink-0">
          {/* Wallet Connect Button */}
          <ConnectWalletButton />
          {/* Mobile Menu - Show when desktop menu is hidden (< 1024px) */}
          {isMobile && <MobileMenu navItems={navItems} />}
        </div>
      </div>
    </header>
  );
}
