/**
 * Structured production logger for PrepPilot AI.
 *
 * Outputs JSON-formatted log entries with timestamp, level, and message.
 * Designed to be machine-parseable by log aggregators (Datadog, CloudWatch, etc.)
 * while remaining human-readable during development.
 */

const isDev = process.env.NODE_ENV !== "production";

const formatLog = (level, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: "preppilot-api",
    message,
    ...meta,
  };

  if (isDev) {
    // Human-readable format in development
    const prefix = { info: "ℹ️", warn: "⚠️", error: "❌" }[level] || "📋";
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `${prefix} [${entry.timestamp}] ${message}${metaStr}`;
  }

  // JSON format in production for log aggregators
  return JSON.stringify(entry);
};

const logger = {
  info: (message, meta = {}) => {
    console.log(formatLog("info", message, meta));
  },

  warn: (message, meta = {}) => {
    console.warn(formatLog("warn", message, meta));
  },

  error: (message, meta = {}) => {
    console.error(formatLog("error", message, meta));
  },
};

export default logger;
