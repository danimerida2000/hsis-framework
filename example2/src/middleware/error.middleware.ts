/**
 * Error Handling Middleware
 * Per CLAUDE.md Error Handling Standards
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorResponse } from '../types';
import { logger, generateTraceId } from '../utils';
import { ZodError } from 'zod';

/**
 * Convert Zod validation errors to user-friendly format
 */
function formatZodError(error: ZodError): string {
  return error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
}

/**
 * Global error handling middleware
 */
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const traceId = (req as Request & { traceId?: string }).traceId || generateTraceId();

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      code: 'ERR_VALIDATION',
      message: 'Validation failed',
      detail: formatZodError(error),
      trace_id: traceId,
    };
    logger.warn('validation.failed', { trace_id: traceId, error: response.detail });
    res.status(400).json(response);
    return;
  }

  // Handle application errors
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      code: error.code,
      message: error.message,
      detail: error.detail,
      trace_id: traceId,
    };
    logger.warn('app.error', { trace_id: traceId, error: error.message });
    res.status(error.statusCode).json(response);
    return;
  }

  // Handle unknown errors
  logger.error('unexpected.error', error, { trace_id: traceId });
  const response: ErrorResponse = {
    code: 'ERR_INTERNAL',
    message: 'An unexpected error occurred',
    trace_id: traceId,
  };
  res.status(500).json(response);
}
