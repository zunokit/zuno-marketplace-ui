"use client";

import { LeftSidebar } from "@/shared/components/layout/left-sidebar";
import { TopNav } from "@/shared/components/layout/top-nav";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Web3Provider } from "@/shared/providers/Web3Provider";
import { ReactNode, useState, useEffect } from "react";
import { AppFooter } from "@/shared/components/layout/AppFooter";
import { ApolloProvider } from "@apollo/client/react";
import { apolloWrapper } from "@/shared/lib/apollo/apollo-wrapper";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/tailwind-utils";

export default function Wrapper({ children }: { children: ReactNode }) {
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();
  const isMarketplaceCollection = pathname?.startsWith("/marketplace/") ?? false;

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

  return (
    <ApolloProvider client={apolloWrapper.getClient()}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Web3Provider>
          <div
            className={cn(
              "flex flex-col bg-background text-foreground transition-all duration-150",
              isMarketplaceCollection ? "h-screen overflow-hidden" : "min-h-screen"
            )}
          >
            {/* Fixed Left Sidebar */}
            <LeftSidebar />

            {/* Fixed Top Navigation - full width */}
            <TopNav />

            {/* Main: h-screen+overflow-hidden on marketplace collection so when Hero is closed, no body scroll */}
            <div
              className={cn(
                "lg:ml-[52px] flex flex-col pt-10 sm:pt-11 lg:pt-12",
                isMarketplaceCollection ? "h-screen overflow-hidden" : "min-h-screen"
              )}
            >
              {/* Main content */}
              <main
                className={cn(
                  "max-w-screen w-full mx-auto flex-grow",
                  isMarketplaceCollection ? "pb-0 min-h-0 overflow-hidden" : "pb-24"
                )}
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
          </div>
        </Web3Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
