/**
 * Logger utility
 * Per ARCHITECTURE.md Section 8 - Observability
 */

import { v4 as uuidv4 } from 'uuid';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  event: string;
  userId?: string;
  taskId?: string;
  duration?: number;
  trace_id: string;
  message?: string;
  error?: string;
}

const SERVICE_NAME = 'task-service';

/**
 * Create a structured log entry
 */
function createLogEntry(
  level: LogLevel,
  event: string,
  data: Partial<LogEntry> = {}
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    service: SERVICE_NAME,
    event,
    trace_id: data.trace_id || uuidv4(),
    ...data,
  };
}

/**
 * Logger instance with structured logging methods
 */
export const logger = {
  info(event: string, data?: Partial<LogEntry>): void {
    const entry = createLogEntry('info', event, data);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  },

  warn(event: string, data?: Partial<LogEntry>): void {
    const entry = createLogEntry('warn', event, data);
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify(entry));
  },

  error(event: string, error?: Error, data?: Partial<LogEntry>): void {
    const entry = createLogEntry('error', event, {
      ...data,
      error: error?.message,
    });
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(entry));
  },

  debug(event: string, data?: Partial<LogEntry>): void {
    if (process.env.NODE_ENV === 'development') {
      const entry = createLogEntry('debug', event, data);
      // eslint-disable-next-line no-console
      console.debug(JSON.stringify(entry));
    }
  },
};

/**
 * Generate a new trace ID
 */
export function generateTraceId(): string {
  return uuidv4();
}
