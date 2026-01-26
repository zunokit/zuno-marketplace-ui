"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ZunoContextProvider, WagmiProviderSync } from "zuno-marketplace-sdk/react";
import { ZunoSDKConfig } from "zuno-marketplace-sdk";
import { wagmiConfig } from "@/shared/config/wagmi";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
    },
  },
});

const zunoConfig: ZunoSDKConfig = {
  apiKey: process.env.NEXT_PUBLIC_ZUNO_API_KEY || "",
  network: (process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID
    ? parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID)
    : 31337) as number | "mainnet" | "sepolia" | "polygon" | "arbitrum",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
};

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ZunoContextProvider config={zunoConfig} queryClient={queryClient}>
            <WagmiProviderSync />
            {children}
          </ZunoContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
