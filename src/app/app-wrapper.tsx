"use client";

import { LeftSidebar } from "@/shared/components/layout/left-sidebar";
import { TopNav } from "@/shared/components/layout/top-nav";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Web3Provider } from "@/shared/providers/web3-provider";
import { ReactNode } from "react";
import { AppFooter } from "@/shared/components/layout/app-footer";
import { ApolloProvider } from "@apollo/client/react";
import { apolloWrapper } from "@/shared/lib/apollo/apollo-wrapper";
import MarketplaceSelectionBarWrapper from "@/modules/marketplace/components/marketplace-selection-bar-wrapper";

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloWrapper.getClient()}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Web3Provider>
          <div className="h-screen flex flex-col bg-background text-foreground">
            {/* Fixed Left Sidebar */}
            <LeftSidebar />

            {/* Fixed Top Navigation - full width */}
            <TopNav />

            {/* Scrollable Content Area */}
            <div className="lg:ml-[52px] flex-1 flex flex-col min-h-0 pt-10 sm:pt-11 lg:pt-12">
              <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                {children}
              </main>

              {/* Bottom Action Bar + Footer - in document flow, not fixed */}
              <div className="shrink-0 relative z-40">
                <MarketplaceSelectionBarWrapper />
                <AppFooter />
              </div>
            </div>
          </div>
        </Web3Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
