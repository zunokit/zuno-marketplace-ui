import * as Sentry from "@sentry/nextjs";

/**
 * Sentry User Action Tracker
 *
 * Records user actions as breadcrumbs for error context.
 * Breadcrumbs appear in Sentry event details under "Breadcrumbs" tab.
 *
 * Example breadcrumb trail:
 * 1. user.login (wallet_connected)
 * 2. user.action (nft.list viewed)
 * 3. user.action (nft.mint clicked)
 * 4. user.action (nft.form submitted)
 * [ERROR occurs here]
 */
export class SentryTracker {
  /**
   * Add generic breadcrumb
   */
  static addBreadcrumb(
    category: string,
    message: string,
    level: "info" | "warning" | "error" = "info",
    data?: Record<string, unknown>
  ): void {
    Sentry.addBreadcrumb({
      category,
      message,
      level,
      data,
    });
  }

  /**
   * Track authentication events
   */
  static trackLogin(userId: string, method: "wallet" | "session"): void {
    Sentry.setUser({ id: userId });

    this.addBreadcrumb("auth", `User logged in via ${method}`, "info", {
      userId,
      method,
    });
  }

  static trackLogout(userId: string): void {
    this.addBreadcrumb("auth", "User logged out", "info", { userId });
    Sentry.setUser(null); // Clear user context
  }

  static trackLoginFailure(reason: string): void {
    this.addBreadcrumb("auth", "Login failed", "warning", { reason });
  }

  /**
   * Track NFT operations
   */
  static trackNftListed(filters?: Record<string, unknown>): void {
    this.addBreadcrumb("nft", "NFT list viewed", "info", { filters });
  }

  static trackNftViewed(nftId: string): void {
    this.addBreadcrumb("nft", "NFT details viewed", "info", { nftId });
  }

  static trackNftMinted(data: {
    contractAddress?: string;
    network?: string;
    tokenId: string;
  }): void {
    this.addBreadcrumb("nft", "NFT minted", "info", {
      contractAddress: data.contractAddress
        ? `${data.contractAddress.substring(0, 10)}...`
        : undefined,
      network: data.network,
      tokenId: data.tokenId,
    });
  }

  static trackNftListedForSale(nftId: string, price: string): void {
    this.addBreadcrumb("nft", "NFT listed for sale", "info", {
      nftId,
      price,
    });
  }

  static trackNftSold(nftId: string, price: string): void {
    this.addBreadcrumb("nft", "NFT sold", "info", {
      nftId,
      price,
    });
  }

  static trackNftTransfer(nftId: string, from: string, to: string): void {
    this.addBreadcrumb("nft", "NFT transferred", "info", {
      nftId,
      from: from.substring(0, 10) + "...",
      to: to.substring(0, 10) + "...",
    });
  }

  /**
   * Track collection operations
   */
  static trackCollectionViewed(collectionId: string): void {
    this.addBreadcrumb("collection", "Collection viewed", "info", {
      collectionId,
    });
  }

  static trackCollectionCreated(collectionId: string): void {
    this.addBreadcrumb("collection", "Collection created", "info", {
      collectionId,
    });
  }

  /**
   * Track wallet operations
   */
  static trackWalletConnected(address: string, chainId: number): void {
    this.addBreadcrumb("wallet", "Wallet connected", "info", {
      address: address.substring(0, 10) + "...",
      chainId,
    });
  }

  static trackWalletDisconnected(address: string): void {
    this.addBreadcrumb("wallet", "Wallet disconnected", "info", {
      address: address.substring(0, 10) + "...",
    });
  }

  static trackWalletSwitchedChain(fromChain: number, toChain: number): void {
    this.addBreadcrumb("wallet", "Chain switched", "info", {
      fromChain,
      toChain,
    });
  }

  /**
   * Track transaction operations
   */
  static trackTransactionSubmitted(txHash: string, type: string): void {
    this.addBreadcrumb("transaction", "Transaction submitted", "info", {
      txHash: txHash.substring(0, 10) + "...",
      type,
    });
  }

  static trackTransactionConfirmed(txHash: string): void {
    this.addBreadcrumb("transaction", "Transaction confirmed", "info", {
      txHash: txHash.substring(0, 10) + "...",
    });
  }

  static trackTransactionFailed(txHash: string, error: string): void {
    this.addBreadcrumb("transaction", "Transaction failed", "warning", {
      txHash: txHash.substring(0, 10) + "...",
      error,
    });
  }

  /**
   * Track launchpad operations
   */
  static trackLaunchpadViewed(projectId: string): void {
    this.addBreadcrumb("launchpad", "Launchpad project viewed", "info", {
      projectId,
    });
  }

  static trackLaunchpadJoined(projectId: string): void {
    this.addBreadcrumb("launchpad", "Joined launchpad allowlist", "info", {
      projectId,
    });
  }

  /**
   * Track errors with context
   */
  static trackError(category: string, message: string, error?: Error): void {
    this.addBreadcrumb("error", message, "error", {
      category,
      errorMessage: error?.message,
    });
  }

  /**
   * Track rate limit hits (informational, not errors)
   */
  static trackRateLimitHit(endpoint: string): void {
    this.addBreadcrumb("ratelimit", `Rate limit hit: ${endpoint}`, "warning", {
      endpoint,
    });
  }

  /**
   * Track cache operations
   */
  static trackCacheHit(key: string): void {
    this.addBreadcrumb("cache", "Cache hit", "info", {
      key: key.substring(0, 50),
    });
  }

  static trackCacheMiss(key: string): void {
    this.addBreadcrumb("cache", "Cache miss", "info", {
      key: key.substring(0, 50),
    });
  }

  /**
   * Track GraphQL operations
   */
  static trackGraphqlQuery(operationName: string): void {
    this.addBreadcrumb("graphql", "GraphQL query executed", "info", {
      operationName,
    });
  }

  static trackGraphqlError(operationName: string, error: string): void {
    this.addBreadcrumb("graphql", "GraphQL query failed", "error", {
      operationName,
      error,
    });
  }
}

/**
 * Initialize Sentry tracker with request context
 *
 * Call this at the start of each API request
 */
export function initRequestContext(requestId: string, path: string): void {
  Sentry.setContext("request", {
    requestId,
    path,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Clear request context
 *
 * Call this at the end of each API request
 */
export function clearRequestContext(): void {
  Sentry.setContext("request", null);
}
