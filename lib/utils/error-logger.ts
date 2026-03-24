import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Error severity levels
 */
export type ErrorSeverity = "info" | "warning" | "error" | "critical";

/**
 * Error context for structured logging
 */
export interface ErrorContext {
  module: string;
  action: string;
  userId?: string;
  eventId?: string;
  attendeeId?: string;
  leadId?: string;
  donationId?: string;
  [key: string]: unknown;
}

/**
 * Log an error with context to console and optionally to the database
 *
 * @param error - The error object or message
 * @param context - Structured context about where the error occurred
 * @param severity - Error severity level
 * @param logToDatabase - Whether to also log to the activities table
 */
export async function logError(
  error: unknown,
  context: ErrorContext,
  severity: ErrorSeverity = "error",
  logToDatabase = false
): Promise<void> {
  // Format error message
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : JSON.stringify(error);

  const errorStack = error instanceof Error ? error.stack : undefined;

  // Build log entry
  const logEntry = {
    timestamp: new Date().toISOString(),
    severity,
    module: context.module,
    action: context.action,
    message: errorMessage,
    stack: errorStack,
    context: {
      ...context,
      module: undefined,
      action: undefined,
    },
  };

  // Console logging with color coding
  const severityColors: Record<ErrorSeverity, string> = {
    info: "\x1b[36m", // Cyan
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    critical: "\x1b[35m", // Magenta
  };
  const resetColor = "\x1b[0m";

  console.log(
    `${severityColors[severity]}[${severity.toUpperCase()}]${resetColor} [${context.module}:${context.action}] ${errorMessage}`
  );

  if (errorStack) {
    console.log(`Stack trace:`, errorStack);
  }

  if (Object.keys(context).length > 2) {
    console.log(`Context:`, JSON.stringify(context, null, 2));
  }

  // Optionally log to database for critical errors
  if (logToDatabase) {
    try {
      const supabase = createAdminClient();
      await supabase.from("activities").insert({
        activity_type: `system_${severity}`,
        description: `[${context.module}:${context.action}] ${errorMessage}`,
        metadata: {
          severity,
          error_message: errorMessage,
          error_stack: errorStack,
          ...context,
        },
      });
    } catch (dbError) {
      // Don't throw if logging fails - just log to console
      console.error("Failed to log error to database:", dbError);
    }
  }
}

/**
 * Log info-level message
 */
export async function logInfo(
  message: string,
  context: ErrorContext,
  logToDatabase = false
): Promise<void> {
  return logError(message, context, "info", logToDatabase);
}

/**
 * Log warning-level message
 */
export async function logWarning(
  message: string,
  context: ErrorContext,
  logToDatabase = false
): Promise<void> {
  return logError(message, context, "warning", logToDatabase);
}

/**
 * Log critical error (always logs to database)
 */
export async function logCritical(
  error: unknown,
  context: ErrorContext
): Promise<void> {
  return logError(error, context, "critical", true);
}

/**
 * Create a scoped logger for a specific module
 */
export function createLogger(module: string) {
  return {
    info: (message: string, context: Omit<ErrorContext, "module">, logToDb = false) =>
      logInfo(message, { ...context, module } as ErrorContext, logToDb),

    warning: (message: string, context: Omit<ErrorContext, "module">, logToDb = false) =>
      logWarning(message, { ...context, module } as ErrorContext, logToDb),

    error: (error: unknown, context: Omit<ErrorContext, "module">, logToDb = false) =>
      logError(error, { ...context, module } as ErrorContext, "error", logToDb),

    critical: (error: unknown, context: Omit<ErrorContext, "module">) =>
      logCritical(error, { ...context, module } as ErrorContext),
  };
}

/**
 * Pre-configured loggers for common modules
 */
export const checkoutLogger = createLogger("checkout");
export const webhookLogger = createLogger("webhook");
export const eventLogger = createLogger("events");
export const paymentLogger = createLogger("payments");
