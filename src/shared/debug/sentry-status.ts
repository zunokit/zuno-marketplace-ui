/**
 * Debug utility for Sentry status
 * Only used by debug pages
 */

export function getSentryStatus(): {
  enabled: boolean;
  reason: string;
  dsn?: string;
  environment?: string;
} {
  // Must have DSN configured
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return { enabled: false, reason: "No DSN configured" };
  }

  // Check if explicitly disabled
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === "false") {
    return { enabled: false, reason: "NEXT_PUBLIC_SENTRY_ENABLED=false", dsn: maskDsn(dsn) };
  }

  // Get environment
  const vercelEnv = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
  const gitRef = process.env.VERCEL_GIT_COMMIT_REF || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
  const nodeEnv = process.env.NODE_ENV;

  let environment: string = nodeEnv || "unknown";
  if (vercelEnv === "production") environment = "production";
  else if (vercelEnv === "staging") environment = "staging";
  else if (vercelEnv === "preview" || gitRef) {
    if (gitRef === "develop") environment = "develop";
    else if (gitRef === "staging") environment = "staging";
    else if (gitRef) environment = gitRef.replace(/\//g, "-").replace(/[^a-zA-Z0-9\-_]/g, "");
    else environment = "preview";
  } else if (!vercelEnv && !gitRef && nodeEnv === "development") {
    environment = "local";
  }

  // Enabled
  return {
    enabled: true,
    reason: "DSN configured and enabled",
    dsn: maskDsn(dsn),
    environment,
  };
}

function maskDsn(dsn: string): string {
  // Mask DSN for security - show first and last parts only
  try {
    const url = new URL(dsn);
    const protocol = url.protocol;
    const host = url.hostname;
    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      const projectId = pathParts[pathParts.length - 1];
      return `${protocol}//${host}/***${projectId.substring(-4)}`;
    }
    return `${protocol}//${host}/***`;
  } catch {
    return "***";
  }
}
