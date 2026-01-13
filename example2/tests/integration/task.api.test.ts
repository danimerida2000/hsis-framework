/**
 * Task API Integration Tests
 * Per IMPLEMENTATION_PLAN.md T-008 through T-013
 */

import { Request, Response, NextFunction } from 'express';
import { createTaskRoutes } from '../../src/routes';
import { ITaskService } from '../../src/services';
import { authMiddleware } from '../../src/middleware';
import { Priority, TaskResponse, TaskListResponse, ToggleResponse, AppError } from '../../src/types';

describe('Task API Integration Tests', () => {
  let mockTaskService: jest.Mocked<ITaskService>;

  const mockTaskResponse: TaskResponse = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-01-25T17:00:00.000Z',
    priority: Priority.MEDIUM,
    isCompleted: false,
    createdAt: '2024-01-20T10:00:00.000Z',
    updatedAt: '2024-01-20T10:00:00.000Z',
  };

  beforeEach(() => {
    mockTaskService = {
      getTasks: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      toggleTaskComplete: jest.fn(),
    };
  });

  describe('Authentication Middleware', () => {
    it('should require authorization header', () => {
      const req = { headers: {} } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should require Bearer token format', () => {
      const req = { headers: { authorization: 'Basic token123' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should accept valid test token', () => {
      const req = {
        headers: { authorization: 'Bearer test-token-user-123' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject invalid token', () => {
      const req = {
        headers: { authorization: 'Bearer invalid-token' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Task Routes', () => {
    // Helper to get route handlers
    function getRouteHandler(
      router: ReturnType<typeof createTaskRoutes>,
      method: string,
      pathMatch: string
    ): ((req: Request, res: Response, next: NextFunction) => Promise<void>) | undefined {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layer = (router as any).stack.find((l: any) => {
        const route = l.route;
        if (!route) return false;
        const hasMethod = route.methods[method];
        const matchesPath = route.path === pathMatch || route.path?.includes(pathMatch);
        return hasMethod && matchesPath;
      });
      return layer?.route?.stack?.[0]?.handle;
    }

    describe('GET /tasks', () => {
      it('should call service with user ID', async () => {
        const listResponse: TaskListResponse = { tasks: [mockTaskResponse], total: 1 };
        mockTaskService.getTasks.mockResolvedValue(listResponse);

        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'get', '/');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          query: {},
        } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(mockTaskService.getTasks).toHaveBeenCalledWith('user-123', expect.any(Object));
          expect(res.json).toHaveBeenCalledWith(listResponse);
        }
      });

      it('should pass filters to service', async () => {
        mockTaskService.getTasks.mockResolvedValue({ tasks: [], total: 0 });

        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'get', '/');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          query: { status: 'active', sort: 'due_date' },
        } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(mockTaskService.getTasks).toHaveBeenCalledWith('user-123', {
            status: 'active',
            sort: 'due_date',
          });
        }
      });
    });

    describe('POST /tasks', () => {
      it('should create a task and return 201', async () => {
        mockTaskService.createTask.mockResolvedValue(mockTaskResponse);

        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'post', '/');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          body: {
            title: 'Test Task',
            description: 'Test Description',
            dueDate: '2024-01-25T17:00:00Z',
            priority: 'medium',
          },
        } as unknown as Request;
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(res.status).toHaveBeenCalledWith(201);
          expect(mockTaskService.createTask).toHaveBeenCalledWith(
            'user-123',
            expect.objectContaining({ title: 'Test Task' })
          );
        }
      });

      it('should call next with error for invalid input', async () => {
        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'post', '/');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          body: { description: 'No title' },
        } as unknown as Request;
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(next).toHaveBeenCalled();
          expect(mockTaskService.createTask).not.toHaveBeenCalled();
        }
      });
    });

    describe('PUT /tasks/:id', () => {
      it('should update a task', async () => {
        const updatedTask = { ...mockTaskResponse, title: 'Updated Title' };
        mockTaskService.updateTask.mockResolvedValue(updatedTask);

        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'put', '/:id');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          params: { id: '123e4567-e89b-12d3-a456-426614174000' },
          body: { title: 'Updated Title' },
        } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(mockTaskService.updateTask).toHaveBeenCalledWith(
            'user-123',
            '123e4567-e89b-12d3-a456-426614174000',
            expect.objectContaining({ title: 'Updated Title' })
          );
        }
      });

      it('should call next with error for invalid UUID', async () => {
        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'put', '/:id');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          params: { id: 'invalid-uuid' },
          body: { title: 'Updated Title' },
        } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(next).toHaveBeenCalled();
          expect(mockTaskService.updateTask).not.toHaveBeenCalled();
        }
      });
    });

    describe('PATCH /tasks/:id/toggle', () => {
      it('should toggle task completion', async () => {
        const toggleResponse: ToggleResponse = {
          id: mockTaskResponse.id,
          isCompleted: true,
          updatedAt: '2024-01-20T15:00:00.000Z',
        };
        mockTaskService.toggleTaskComplete.mockResolvedValue(toggleResponse);

        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'patch', 'toggle');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          params: { id: '123e4567-e89b-12d3-a456-426614174000' },
        } as unknown as Request;
        const res = { json: jest.fn() } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(mockTaskService.toggleTaskComplete).toHaveBeenCalledWith(
            'user-123',
            '123e4567-e89b-12d3-a456-426614174000'
          );
          expect(res.json).toHaveBeenCalledWith(toggleResponse);
        }
      });
    });

    describe('DELETE /tasks/:id', () => {
      it('should delete a task and return 204', async () => {
        mockTaskService.deleteTask.mockResolvedValue();

        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'delete', '/:id');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          params: { id: '123e4567-e89b-12d3-a456-426614174000' },
        } as unknown as Request;
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(mockTaskService.deleteTask).toHaveBeenCalledWith(
            'user-123',
            '123e4567-e89b-12d3-a456-426614174000'
          );
          expect(res.status).toHaveBeenCalledWith(204);
        }
      });

      it('should handle not found error', async () => {
        mockTaskService.deleteTask.mockRejectedValue(AppError.notFound('Task not found'));

        const router = createTaskRoutes(mockTaskService);
        const handler = getRouteHandler(router, 'delete', '/:id');

        const req = {
          user: { userId: 'user-123', email: 'test@test.com' },
          params: { id: '123e4567-e89b-12d3-a456-426614174000' },
        } as unknown as Request;
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();

        if (handler) {
          await handler(req, res, next);
          expect(next).toHaveBeenCalled();
          const error = next.mock.calls[0][0] as AppError;
          expect(error.statusCode).toBe(404);
        }
      });
    });
  });
});
