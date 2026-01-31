"use client";

import { useState } from "react";
import Link from "next/link";
import { getSentryStatus } from "@/shared/debug/sentry-status";
import {
  triggerSentryError,
  triggerSentryMessage,
  addSentryBreadcrumb,
  setSentryUser,
} from "@/shared/debug/trigger-sentry-error";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Bug,
  MessageSquare,
  Footprints,
  User,
  ArrowLeft,
} from "lucide-react";

export default function SentryDebugPage() {
  const [status, setStatus] = useState(getSentryStatus());
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("test-user-123");
  const [breadcrumbMessage, setBreadcrumbMessage] = useState("Test breadcrumb");

  const handleTriggerError = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await triggerSentryError();
      setResult({ type: "success", message: response.message });
    } catch (error) {
      setResult({
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerMessage = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await triggerSentryMessage();
      setResult({ type: "success", message: response.message });
    } catch (error) {
      setResult({
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBreadcrumb = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await addSentryBreadcrumb(breadcrumbMessage);
      setResult({ type: "success", message: response.message });
    } catch (error) {
      setResult({
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUser = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await setSentryUser(userId);
      setResult({ type: "success", message: response.message });
    } catch (error) {
      setResult({
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = () => {
    setStatus(getSentryStatus());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/debug"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Debug Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-frosted-1 flex items-center justify-center border border-border-subtle">
            <Bug className="w-5 h-5 text-os-info" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sentry Debug Panel</h1>
            <p className="text-muted-foreground">Test Sentry integration and monitor error tracking</p>
          </div>
        </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sentry Status</CardTitle>
            <Button variant="outline" size="sm" onClick={refreshStatus}>
              Refresh
            </Button>
          </div>
          <CardDescription>Current Sentry configuration and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={status.enabled ? "default" : "destructive"}>
              {status.enabled ? "Enabled" : "Disabled"}
            </Badge>
            <span className="text-sm text-muted-foreground">{status.reason}</span>
          </div>

          {status.dsn && (
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">DSN</Label>
              <code className="text-xs bg-frosted-1 px-2 py-1 rounded block border border-border-subtle">{status.dsn}</code>
            </div>
          )}

          {status.environment && (
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Environment</Label>
              <Badge variant="outline">{status.environment}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Alert */}
      {result && (
        <Alert variant={result.type === "success" ? "default" : "destructive"} className="mb-6">
          {result.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{result.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      {/* Test Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trigger Error */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Trigger Error
            </CardTitle>
            <CardDescription>Send a test error to Sentry to verify error tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleTriggerError}
              disabled={isLoading || !status.enabled}
              className="w-full"
              variant="destructive"
            >
              {isLoading ? "Sending..." : "Send Test Error"}
            </Button>
            {!status.enabled && (
              <p className="text-xs text-muted-foreground mt-2">
                Sentry is disabled. Enable it to test.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Send Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Message
            </CardTitle>
            <CardDescription>Send a test message (breadcrumb level) to Sentry</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleTriggerMessage}
              disabled={isLoading || !status.enabled}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send Test Message"}
            </Button>
          </CardContent>
        </Card>

        {/* Add Breadcrumb */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Footprints className="h-5 w-5" />
              Add Breadcrumb
            </CardTitle>
            <CardDescription>Add a breadcrumb for context tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={breadcrumbMessage}
              onChange={e => setBreadcrumbMessage(e.target.value)}
              placeholder="Enter breadcrumb message"
              disabled={!status.enabled}
            />
            <Button
              onClick={handleAddBreadcrumb}
              disabled={isLoading || !status.enabled}
              className="w-full"
              variant="secondary"
            >
              {isLoading ? "Adding..." : "Add Breadcrumb"}
            </Button>
          </CardContent>
        </Card>

        {/* Set User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Set User Context
            </CardTitle>
            <CardDescription>Set user context for better error tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="Enter user ID"
              disabled={!status.enabled}
            />
            <Button
              onClick={handleSetUser}
              disabled={isLoading || !status.enabled}
              className="w-full"
              variant="secondary"
            >
              {isLoading ? "Setting..." : "Set User"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert className="mt-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Usage Notes</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>Check your Sentry dashboard to see the captured events</li>
            <li>In local development, errors may not be sent depending on your configuration</li>
            <li>Breadcrumbs help provide context when errors occur</li>
            <li>User context helps filter errors by specific users</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
    </div>
  );
}
