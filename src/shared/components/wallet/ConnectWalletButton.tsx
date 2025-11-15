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
                  <Button onClick={openConnectModal} size="default">
                    <Wallet className="size-4" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive" size="default">
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {/* SIWE Sign In Button */}
                  <SignInButton />

                  {/* Chain Selector Button */}
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="default"
                    className="hidden sm:flex"
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

                  {/* Account Button */}
                  <Button onClick={openAccountModal} variant="outline" size="default">
                    {account.displayBalance
                      ? ` ${account.displayBalance}`
                      : ""}
                    <span className="font-semibold">{account.displayName}</span>
                    <ChevronDown className="size-4" />
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
