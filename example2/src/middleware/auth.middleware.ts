/**
 * Authentication Middleware
 * Per ARCHITECTURE.md Section 6 - Security Model
 * Validates JWT tokens and extracts user information
 */

import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { logger, generateTraceId } from '../utils';

/**
 * Mock JWT verification for development
 * In production, this would use a real JWT library (jsonwebtoken)
 * and verify against the auth service's secret
 */
function verifyToken(token: string): { userId: string; email: string } | null {
  // For testing/development: Accept format "test-token-{userId}"
  // or a base64 encoded JSON payload
  if (token.startsWith('test-token-')) {
    const userId = token.replace('test-token-', '');
    return { userId, email: `user-${userId}@test.com` };
  }

  // Try to decode as base64 JSON
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(decoded) as { userId?: string; email?: string };
    if (payload.userId && payload.email) {
      return { userId: payload.userId, email: payload.email };
    }
  } catch {
    // Not a valid base64 JSON token
  }

  return null;
}

/**
 * Authentication middleware
 * Validates Bearer token and attaches user to request
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const traceId = generateTraceId();
  (req as AuthenticatedRequest & { traceId: string }).traceId = traceId;

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('auth.missing_header', { trace_id: traceId });
    res.status(401).json({
      code: 'ERR_UNAUTHORIZED',
      message: 'Authorization header required',
      trace_id: traceId,
    });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    logger.warn('auth.invalid_format', { trace_id: traceId });
    res.status(401).json({
      code: 'ERR_UNAUTHORIZED',
      message: 'Invalid authorization header format. Use: Bearer <token>',
      trace_id: traceId,
    });
    return;
  }

  const token = parts[1];
  const payload = verifyToken(token);

  if (!payload) {
    logger.warn('auth.invalid_token', { trace_id: traceId });
    res.status(401).json({
      code: 'ERR_UNAUTHORIZED',
      message: 'Invalid or expired token',
      trace_id: traceId,
    });
    return;
  }

  // Attach user to request
  (req as AuthenticatedRequest).user = {
    userId: payload.userId,
    email: payload.email,
  };

  logger.debug('auth.success', { userId: payload.userId, trace_id: traceId });
  next();
}
