/**
 * Authentication Service
 *
 * Type-safe authentication using auto-generated GraphQL types
 */

import { graphqlClient } from "@/shared/lib/graphql-client";
import { authLogger } from "@/shared/lib/logger";
import {
  GetNonceDocument,
  VerifySiweDocument,
  RefreshSessionDocument,
  RevokeSessionDocument,
  LogoutDocument,
  MeDocument,
  type GetNonceQuery,
  type VerifySiweMutation,
  type RefreshSessionMutation,
  type LogoutMutation,
  type MeQuery,
  type GetNonceQueryVariables,
  type VerifySiweMutationVariables,
  type RefreshSessionMutationVariables,
  type RevokeSessionMutationVariables,
  type LogoutMutationVariables,
} from "@/shared/graphql/generated";

class AuthService {
  /**
   * Get a nonce for SIWE authentication
   */
  async getNonce(
    accountId: string,
    chainId: string,
    domain: string
  ): Promise<GetNonceQuery["getNonce"]> {
    authLogger.group("Get Nonce");
    authLogger.info("Requesting nonce", { accountId, chainId, domain });

    try {
      const variables: GetNonceQueryVariables = { accountId, chainId, domain };
      const data = await graphqlClient.queryTyped(GetNonceDocument, variables, "GetNonce");

      authLogger.info("Nonce retrieved successfully", {
        expiresAt: data.getNonce.expiresAt,
      });
      authLogger.groupEnd();

      return data.getNonce;
    } catch (error) {
      authLogger.error("Failed to get nonce", error, { accountId, chainId, domain });
      authLogger.groupEnd();
      throw error;
    }
  }

  /**
   * Verify SIWE signature and create session
   */
  async verifySiwe(
    accountId: string,
    message: string,
    signature: string
  ): Promise<VerifySiweMutation["verifySiwe"]> {
    authLogger.group("Verify SIWE");
    authLogger.info("Verifying SIWE signature", {
      accountId,
      signatureLength: signature.length,
      messagePreview: message.substring(0, 50) + "...",
    });

    try {
      const variables: VerifySiweMutationVariables = { accountId, message, signature };
      const data = await graphqlClient.mutateTyped(VerifySiweDocument, variables, "VerifySiwe");

      // Store access token
      graphqlClient.setAccessToken(data.verifySiwe.accessToken);

      authLogger.info("SIWE verification successful", {
        userId: data.verifySiwe.userId,
        address: data.verifySiwe.address,
      });

      // Dispatch login event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:login"));
      }

      authLogger.groupEnd();
      return data.verifySiwe;
    } catch (error) {
      authLogger.error("SIWE verification error", error);
      authLogger.groupEnd();
      throw error;
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshSession(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<RefreshSessionMutation["refreshSession"]> {
    authLogger.info("Refreshing session");

    try {
      const variables: RefreshSessionMutationVariables = { refreshToken, userAgent, ipAddress };
      const data = await graphqlClient.mutateTyped(
        RefreshSessionDocument,
        variables,
        "RefreshSession"
      );

      graphqlClient.setAccessToken(data.refreshSession.accessToken);
      authLogger.info("Session refreshed successfully");

      return data.refreshSession;
    } catch (error) {
      authLogger.error("Session refresh error", error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<MeQuery["me"]> {
    authLogger.debug("Fetching current user");

    try {
      const data = await graphqlClient.queryTyped(MeDocument, {}, "Me");

      authLogger.debug("Current user fetched", {
        userId: data.me?.id,
        username: data.me?.profile?.username,
      });

      return data.me;
    } catch (error) {
      authLogger.error("Failed to get current user", error);
      return null;
    }
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<boolean> {
    authLogger.info("Revoking session", { sessionId });

    try {
      const variables: RevokeSessionMutationVariables = { sessionId };
      const data = await graphqlClient.mutateTyped(
        RevokeSessionDocument,
        variables,
        "RevokeSession"
      );

      authLogger.info("Session revoked", {
        sessionId,
        success: data.revokeSession,
      });

      return data.revokeSession;
    } catch (error) {
      authLogger.error("Failed to revoke session", error, { sessionId });
      return false;
    }
  }

  /**
   * Logout - revoke session on backend and clear tokens
   */
  async logout(): Promise<boolean> {
    authLogger.info("Logging out");

    try {
      // Call backend logout mutation (uses refresh_token cookie)
      const variables: LogoutMutationVariables = {};
      const data = await graphqlClient.mutateTyped(LogoutDocument, variables, "Logout");

      authLogger.info("Logout successful", { success: data.logout });

      // Clear access token from memory
      graphqlClient.setAccessToken(null);

      // Dispatch logout event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }

      return data.logout;
    } catch (error) {
      authLogger.error("Failed to logout on backend", error);

      // Even if backend call fails, clear local token
      graphqlClient.setAccessToken(null);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }

      return false;
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return graphqlClient.getAccessToken();
  }
}

export const authService = new AuthService();
