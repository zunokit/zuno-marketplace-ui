"use client";

import { Suspense, createContext, useContext, useState } from "react";
import ChainMenu from "@/modules/chain/chain-menu/chain-menu";
import ChainTabsSkeleton from "@/modules/chain/chain-menu/chain-menu-ske";
import { RightSidebar } from "@/modules/product-discovery/right-sidebar";
import { mockSidebarCollections, mockTrendingTokens } from "@/shared/utils/mock/sidebarData";
import { cn } from "@/shared/utils/tailwind-utils";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <div className="relative flex flex-col min-h-0 h-full">
        <div
          className={cn("flex-1 min-h-0 transition-all duration-700", isCollapsed ? "lg:mr-0" : "lg:mr-[420px]")}
        >
          <Suspense fallback={<ChainTabsSkeleton />}>
            <ChainMenu onToggleSidebar={toggleSidebar} isSidebarCollapsed={isCollapsed} />
          </Suspense>
          <div className="flex flex-col min-h-0">
            {children}
          </div>
        </div>
        <RightSidebar
          collections={mockSidebarCollections}
          tokens={mockTrendingTokens}
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
        />
      </div>
    </SidebarContext.Provider>
  );
}
