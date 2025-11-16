/**
 * Logger
 * Structured logging utility with namespace support
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private minLevel: LogLevel = this.isDevelopment ? "debug" : "info";
  private namespace: string;

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(namespace: string = "App") {
    this.namespace = namespace;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.namespace}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      const formatted = this.formatMessage("debug", message);
      if (context) {
        console.debug(formatted, context);
      } else {
        console.debug(formatted);
      }
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      const formatted = this.formatMessage("info", message);
      if (context) {
        console.info(formatted, context);
      } else {
        console.info(formatted);
      }
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      const formatted = this.formatMessage("warn", message);
      if (context) {
        console.warn(formatted, context);
      } else {
        console.warn(formatted);
      }
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog("error")) {
      const formatted = this.formatMessage("error", message);

      if (error instanceof Error) {
        console.error(formatted, {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          ...context,
        });
      } else if (error) {
        console.error(formatted, { error, ...context });
      } else if (context) {
        console.error(formatted, context);
      } else {
        console.error(formatted);
      }

      // TODO: Send to monitoring service in production
      // if (!this.isDevelopment) {
      //   Sentry.captureException(error, { extra: context });
      // }
    }
  }

  group(label: string): void {
    if (this.isDevelopment) {
      console.group(`[${this.namespace}] ${label}`);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  time(label: string): void {
    if (this.isDevelopment) {
      console.time(`[${this.namespace}] ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(`[${this.namespace}] ${label}`);
    }
  }

  /**
   * Log API request
   */
  logRequest(method: string, endpoint: string, params?: Record<string, unknown>): void {
    this.debug(`API Request: ${method} ${endpoint}`, params);
  }

  /**
   * Log API response
   */
  logResponse(method: string, endpoint: string, status: number, duration: number): void {
    this.debug(`API Response: ${method} ${endpoint}`, {
      status,
      duration: `${duration}ms`,
    });
  }

  /**
   * Log performance metric
   */
  logPerformance(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance: ${metric}`, { value, ...context });
  }

  /**
   * Log user action
   */
  logUserAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, context);
  }

  /**
   * Log blockchain transaction
   */
  logTransaction(
    type: "sent" | "confirmed" | "failed",
    txHash?: string,
    context?: LogContext
  ): void {
    this.info(`Transaction ${type}`, { txHash, ...context });
  }
}

// Create logger instances for different modules
export const logger = new Logger();
export const authLogger = new Logger("Auth");
export const graphqlLogger = new Logger("GraphQL");
export const walletLogger = new Logger("Wallet");
export const createLogger = (namespace: string) => new Logger(namespace);

export default Logger;
