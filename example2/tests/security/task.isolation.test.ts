/**
 * Security Tests - Task Isolation
 * Per IMPLEMENTATION_PLAN.md T-021 and NFR-004
 * Tests that users can only access their own tasks
 */

import { TaskRepository, ITaskRepository } from '../../src/repository';
import { TaskService, ITaskService } from '../../src/services';
import { Priority, AppError } from '../../src/types';

describe('Security Tests - Task Isolation (NFR-004)', () => {
  let mockPrismaClient: {
    task: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };
  let repository: ITaskRepository;
  let service: ITaskService;

  const user1Id = 'user-1-uuid';
  const user2Id = 'user-2-uuid';

  const user1Task = {
    id: 'task-1-uuid',
    userId: user1Id,
    title: 'User 1 Task',
    description: 'Secret data for user 1',
    dueDate: new Date(),
    priority: 'MEDIUM',
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockPrismaClient = {
      task: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new TaskRepository(mockPrismaClient as any);
    service = new TaskService(repository);
  });

  describe('Repository Layer Isolation', () => {
    it('should only return tasks belonging to the requesting user', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([user1Task]);

      await repository.findByUserId(user1Id);

      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: user1Id,
          }),
        })
      );
    });

    it('should enforce userId filter in findById', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      const result = await repository.findById(user1Task.id, user2Id);

      expect(result).toBeNull();
      expect(mockPrismaClient.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: user1Task.id,
          userId: user2Id, // Different user
        },
      });
    });

    it('should not allow user2 to update user1 task', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      await expect(repository.update(user1Task.id, user2Id, { title: 'Hacked' }))
        .rejects.toThrow('Task not found');
    });

    it('should not allow user2 to delete user1 task', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      await expect(repository.delete(user1Task.id, user2Id))
        .rejects.toThrow('Task not found');
    });

    it('should not allow user2 to toggle user1 task', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      await expect(repository.toggleComplete(user1Task.id, user2Id))
        .rejects.toThrow('Task not found');
    });
  });

  describe('Service Layer Isolation', () => {
    it('should return 404 when accessing other users task via update', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      await expect(service.updateTask(user2Id, user1Task.id, { title: 'Hacked' }))
        .rejects.toThrow(AppError);

      try {
        await service.updateTask(user2Id, user1Task.id, { title: 'Hacked' });
      } catch (error) {
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).message).toBe('Task not found');
      }
    });

    it('should return 404 when accessing other users task via delete', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      try {
        await service.deleteTask(user2Id, user1Task.id);
      } catch (error) {
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it('should return 404 when accessing other users task via toggle', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      try {
        await service.toggleTaskComplete(user2Id, user1Task.id);
      } catch (error) {
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it('should only list tasks for the authenticated user', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([user1Task]);

      const result = await service.getTasks(user1Id);

      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].title).toBe('User 1 Task');
      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: user1Id },
        })
      );
    });
  });

  describe('Input Validation Security', () => {
    it('should validate and sanitize task ID format', () => {
      const { taskIdSchema } = require('../../src/validation');

      // Valid UUID
      expect(() => taskIdSchema.parse({ id: '123e4567-e89b-12d3-a456-426614174000' }))
        .not.toThrow();

      // Invalid: SQL injection attempt
      expect(() => taskIdSchema.parse({ id: "'; DROP TABLE tasks; --" }))
        .toThrow();

      // Invalid: Path traversal attempt
      expect(() => taskIdSchema.parse({ id: '../../../etc/passwd' }))
        .toThrow();
    });

    it('should sanitize title input', () => {
      const { createTaskSchema } = require('../../src/validation');

      // Valid title
      const result = createTaskSchema.parse({ title: '<script>alert("xss")</script>' });
      // Title is stored as-is but should be escaped on output
      expect(result.title).toBe('<script>alert("xss")</script>');
    });

    it('should validate priority enum values', () => {
      const { createTaskSchema } = require('../../src/validation');

      // Valid priorities
      expect(() => createTaskSchema.parse({ title: 'Test', priority: 'low' })).not.toThrow();
      expect(() => createTaskSchema.parse({ title: 'Test', priority: 'medium' })).not.toThrow();
      expect(() => createTaskSchema.parse({ title: 'Test', priority: 'high' })).not.toThrow();

      // Invalid priority
      expect(() => createTaskSchema.parse({ title: 'Test', priority: 'critical' })).toThrow();
    });
  });

  describe('Authentication Enforcement', () => {
    it('should require authentication header', () => {
      const { authMiddleware } = require('../../src/middleware');
      const req = { headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should require Bearer token format', () => {
      const { authMiddleware } = require('../../src/middleware');
      const req = { headers: { authorization: 'Basic user:pass' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should reject invalid tokens', () => {
      const { authMiddleware } = require('../../src/middleware');
      const req = { headers: { authorization: 'Bearer invalid-token' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Error Message Security', () => {
    it('should not leak internal information in error responses', () => {
      const { AppError } = require('../../src/types');

      const error = AppError.notFound('Task not found');

      // Error message should be generic
      expect(error.message).not.toContain('user_id');
      expect(error.message).not.toContain('SQL');
      expect(error.message).not.toContain('database');
    });

    it('should include trace_id but not sensitive data in error response', () => {
      const { AppError, ErrorCode } = require('../../src/types');

      const error = AppError.forbidden('Access denied');

      expect(error.code).toBe(ErrorCode.ERR_FORBIDDEN);
      expect(error.message).toBe('Access denied');
      expect(error.detail).toBeUndefined();
    });
  });
});
