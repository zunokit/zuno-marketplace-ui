"use client";

import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { authLogger } from "@/shared/lib/logger";
import { useGetNonceLazyQuery, useVerifySiweMutation, useLogoutMutation } from "@/shared/graphql";
import { graphqlClient } from "@/shared/lib/graphql-client";

export function SignInButton() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { isAuthenticated } = useAuth();

  // Use generated hooks instead of manual service calls
  const [getNonce, { loading: nonceLoading }] = useGetNonceLazyQuery();
  const [verifySiwe, { loading: verifyLoading }] = useVerifySiweMutation();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();

  const isLoading = nonceLoading || verifyLoading;

  const handleSignIn = async () => {
    if (!address || !chainId) {
      authLogger.error("No wallet connected");
      return;
    }

    try {
      authLogger.info("Starting SIWE authentication", { address });

      const domain = window.location.host;
      const accountId = address;
      const chainIdCaip2 = `eip155:${chainId}`;

      // Get nonce using generated hook
      const { data: nonceData } = await getNonce({
        variables: { accountId, chainId: chainIdCaip2, domain },
      });

      if (!nonceData?.getNonce) {
        throw new Error("Failed to get nonce");
      }

      // Create SIWE message
      const message = new SiweMessage({
        domain,
        address,
        statement: "Sign in to Zuno Marketplace",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: nonceData.getNonce.nonce,
      });

      const preparedMessage = message.prepareMessage();

      // Sign message with wallet
      const signature = await signMessageAsync({
        message: preparedMessage,
      });

      // Verify signature using generated hook
      const { data: authData } = await verifySiwe({
        variables: {
          accountId,
          message: preparedMessage,
          signature,
        },
      });

      if (!authData?.verifySiwe) {
        throw new Error("Failed to verify signature");
      }

      // Store access token
      graphqlClient.setAccessToken(authData.verifySiwe.accessToken);

      // Dispatch login event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:login"));
      }

      authLogger.info("Sign in successful");
    } catch (error) {
      authLogger.error("Sign in failed", error);
    }
  };

  const handleSignOut = async () => {
    try {
      authLogger.info("User signing out");

      // Call logout mutation
      await logout();

      // Clear access token
      graphqlClient.setAccessToken(null);

      // Dispatch logout event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    } catch (error) {
      authLogger.error("Logout failed", error);
    }
  };

  if (!address) {
    return null; // Only show when wallet is connected
  }

  if (isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="h-7 sm:h-8 px-2 sm:px-3 text-xs whitespace-nowrap"
      >
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleSignIn}
      disabled={isLoading}
      className="h-7 sm:h-8 px-2 sm:px-3 text-xs whitespace-nowrap"
    >
      {isLoading ? "Signing..." : "Sign In"}
    </Button>
  );
}
