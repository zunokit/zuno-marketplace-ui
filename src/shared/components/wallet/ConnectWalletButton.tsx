"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/shared/components/ui/button";
import { Wallet, ChevronDown, LogIn } from "lucide-react";
import Image from "next/image";
import { SignInButton } from "@/shared/components/auth/SignInButton";

export function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    size="sm"
                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                  >
                    <Wallet className="size-3 sm:size-3.5" />
                    <span className="hidden sm:inline">Connect</span>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    size="sm"
                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs whitespace-nowrap"
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                  {/* SIWE Sign In Button */}
                  <SignInButton />

                  {/* Chain Selector Button - Hidden on mobile and tablet */}
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="sm"
                    className="hidden xl:flex h-7 sm:h-8 px-2 text-xs"
                  >
                    {chain.hasIcon && (
                      <div className="size-3.5 rounded-full overflow-hidden">
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            width={14}
                            height={14}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <ChevronDown className="size-3" />
                  </Button>

                  {/* Account Button - Responsive sizing */}
                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    size="sm"
                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                  >
                    {/* Hide balance on screens below lg */}
                    {account.displayBalance && (
                      <span className="hidden lg:inline text-xs">
                        {account.displayBalance}
                      </span>
                    )}
                    <span className="font-semibold truncate max-w-[60px] sm:max-w-[80px] lg:max-w-[100px]">
                      {account.displayName}
                    </span>
                    <ChevronDown className="size-3 shrink-0" />
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
