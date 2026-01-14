/**
 * Error Middleware Tests
 * Tests error handling middleware behavior
 */

import { Request, Response, NextFunction } from 'express';
import { errorMiddleware } from '../../src/middleware/error.middleware';
import { AppError } from '../../src/types';
import { ZodError, ZodIssue } from 'zod';

describe('Error Middleware', () => {
  let mockReq: any;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      traceId: 'test-trace-id',
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should handle ZodError and return 400', () => {
    const zodIssues: ZodIssue[] = [
      { code: 'invalid_type', expected: 'string', received: 'undefined', path: ['title'], message: 'Required' },
    ];
    const zodError = new ZodError(zodIssues);

    errorMiddleware(zodError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      code: 'ERR_VALIDATION',
      message: 'Validation failed',
    }));
  });

  it('should handle AppError and return correct status code', () => {
    const appError = AppError.notFound('Task not found');

    errorMiddleware(appError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      code: 'ERR_NOT_FOUND',
      message: 'Task not found',
    }));
  });

  it('should handle AppError with detail', () => {
    const appError = AppError.validation('Invalid input', 'Title is required');

    errorMiddleware(appError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      code: 'ERR_VALIDATION',
      message: 'Invalid input',
      detail: 'Title is required',
    }));
  });

  it('should handle unknown errors and return 500', () => {
    const unknownError = new Error('Something went wrong');

    errorMiddleware(unknownError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      code: 'ERR_INTERNAL',
      message: 'An unexpected error occurred',
    }));
  });

  it('should generate trace_id if not present in request', () => {
    const reqWithoutTraceId = {} as Request;
    const error = new Error('Test error');

    errorMiddleware(error, reqWithoutTraceId, mockRes as Response, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      trace_id: expect.any(String),
    }));
  });

  it('should handle forbidden error', () => {
    const appError = AppError.forbidden('Access denied');

    errorMiddleware(appError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      code: 'ERR_FORBIDDEN',
    }));
  });

  it('should handle unauthorized error', () => {
    const appError = AppError.unauthorized('Token expired');

    errorMiddleware(appError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      code: 'ERR_UNAUTHORIZED',
    }));
  });

  it('should handle internal error', () => {
    const appError = AppError.internal('Database error', 'Connection failed');

    errorMiddleware(appError, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      code: 'ERR_INTERNAL',
      detail: 'Connection failed',
    }));
  });
});
