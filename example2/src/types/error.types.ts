/**
 * Error Types
 * Per CLAUDE.md Error Handling Standards and ARCHITECTURE.md Section 5
 */

/**
 * Standard error response format
 */
export interface ErrorResponse {
  code: string;
  message: string;
  detail?: string;
  trace_id: string;
}

/**
 * Error codes used in the application
 */
export enum ErrorCode {
  ERR_VALIDATION = 'ERR_VALIDATION',
  ERR_UNAUTHORIZED = 'ERR_UNAUTHORIZED',
  ERR_FORBIDDEN = 'ERR_FORBIDDEN',
  ERR_NOT_FOUND = 'ERR_NOT_FOUND',
  ERR_INTERNAL = 'ERR_INTERNAL',
}

/**
 * Application error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly detail?: string;

  constructor(code: ErrorCode, message: string, statusCode: number, detail?: string) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.detail = detail;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  static validation(message: string, detail?: string): AppError {
    return new AppError(ErrorCode.ERR_VALIDATION, message, 400, detail);
  }

  static unauthorized(message: string = 'Authentication required'): AppError {
    return new AppError(ErrorCode.ERR_UNAUTHORIZED, message, 401);
  }

  static forbidden(message: string = 'Access denied'): AppError {
    return new AppError(ErrorCode.ERR_FORBIDDEN, message, 403);
  }

  static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(ErrorCode.ERR_NOT_FOUND, message, 404);
  }

  static internal(message: string = 'Internal server error', detail?: string): AppError {
    return new AppError(ErrorCode.ERR_INTERNAL, message, 500, detail);
  }
}
