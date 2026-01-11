"use client";

import { LeftSidebar } from "@/shared/components/layout/left-sidebar";
import { TopNav } from "@/shared/components/layout/top-nav";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Web3Provider } from "@/shared/providers/Web3Provider";
import { ReactNode, useState, useEffect } from "react";
import { AppFooter } from "@/shared/components/layout/AppFooter";
import { ApolloProvider } from "@apollo/client/react";
import { apolloWrapper } from "@/shared/lib/apollo/apollo-wrapper";

export default function Wrapper({ children }: { children: ReactNode }) {
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

  return (
    <ApolloProvider client={apolloWrapper.getClient()}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Web3Provider>
          <div className="min-h-screen flex flex-col bg-background text-foreground transition-all duration-150">
            {/* Fixed Left Sidebar */}
            <LeftSidebar />

            {/* Fixed Top Navigation - full width */}
            <TopNav />

            {/* Main wrapper with left margin for sidebar (only on lg+) and top padding for fixed nav */}
            <div className="lg:ml-[52px] flex flex-col min-h-screen pt-10 sm:pt-11 lg:pt-12">
              {/* Main content */}
              <main className="max-w-screen w-full mx-auto pb-24 flex-grow">
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
