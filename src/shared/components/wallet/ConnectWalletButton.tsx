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
                    size="default"
                    className="h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 text-xs sm:text-sm"
                  >
                    <Wallet className="size-3 sm:size-4" />
                    <span className="hidden xs:inline sm:hidden md:inline">Connect Wallet</span>
                    <span className="inline xs:hidden sm:inline md:hidden">Connect</span>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    size="default"
                    className="h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 text-xs sm:text-sm whitespace-nowrap"
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
                    size="default"
                    className="hidden xl:flex"
                  >
                    {chain.hasIcon && (
                      <div className="size-4 rounded-full overflow-hidden">
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            width={16}
                            height={16}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <ChevronDown className="size-4" />
                  </Button>

                  {/* Account Button - Responsive sizing */}
                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    size="default"
                    className="text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4"
                  >
                    {/* Hide balance on screens below lg */}
                    {account.displayBalance && (
                      <span className="hidden lg:inline text-xs">
                        {account.displayBalance}
                      </span>
                    )}
                    <span className="font-semibold truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px] xl:max-w-none">
                      {account.displayName}
                    </span>
                    <ChevronDown className="size-3 sm:size-4 shrink-0" />
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
