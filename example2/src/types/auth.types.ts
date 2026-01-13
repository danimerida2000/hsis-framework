/**
 * Authentication Types
 * Per ARCHITECTURE.md Section 6 - Security Model
 */

import { Request } from 'express';

/**
 * JWT token payload structure
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}
