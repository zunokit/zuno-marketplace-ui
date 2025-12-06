"use client";

import Header from "@/shared/components/layout/nav-bar/Header";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Web3Provider } from "@/shared/providers/Web3Provider";
import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppFooter } from "@/shared/components/layout/AppFooter";
import { ApolloProvider } from "@apollo/client/react";
import { apolloWrapper } from "@/shared/lib/apollo/apollo-wrapper";

export default function Wrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Listen for cart updates from marketplace component
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      setCartItemCount(event.detail.itemCount || 0);
    };

    const handleCartOpen = () => {
      // Cart open functionality can be implemented later
    };

    window.addEventListener('cartUpdate', handleCartUpdate as EventListener);
    window.addEventListener('cartOpen', handleCartOpen as EventListener);

    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate as EventListener);
      window.removeEventListener('cartOpen', handleCartOpen as EventListener);
    };
  }, []);

  // Check if current route has ChainTab
  // ChainTab only exists in (discover) routes (homepage)
  const hasChainTab = pathname === "/" || pathname?.startsWith("/discover");

  // Marketplace and other specific routes don't have ChainTab
  const isMarketplace = pathname?.startsWith("/marketplace");
  const isMint = pathname?.startsWith("/mint");

  // Determine padding class based on route
  const mainPaddingClass =
    isMarketplace || isMint
      ? "pt-16 md:pt-20" // Smaller padding when no ChainTab
      : hasChainTab
        ? "pt-[110px] md:pt-30" // Full padding for routes with ChainTab - increased for mobile
        : "pt-20 md:pt-24"; // Default padding for other routes

  return (
    <ApolloProvider client={apolloWrapper.getClient()}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Web3Provider>
          <div className="min-h-screen flex flex-col bg-secondary text-foreground dark:bg-card dark:text-foreground transition-all duration-150">
            {/* Fixed header */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <Header />
            </div>

            {/* Main content with padding to account for fixed header and footer */}
            <main
              className={`max-w-screen w-full mx-auto pb-24 flex-grow ${mainPaddingClass}`}
            >
              {children}
            </main>

            {/* Fixed footer */}
            <AppFooter
              itemCount={cartItemCount}
              openCart={() => {
                // Cart open functionality can be implemented later
              }}
            />
          </div>
        </Web3Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
