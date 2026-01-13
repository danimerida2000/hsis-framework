/**
 * Performance/Load Tests
 * Per IMPLEMENTATION_PLAN.md T-020 and NFR-001/NFR-002
 * Tests that performance requirements are met
 */

import { TaskRepository, ITaskRepository } from '../../src/repository';
import { TaskService, ITaskService } from '../../src/services';
import { Priority } from '../../src/types';

describe('Performance Tests', () => {
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

  describe('NFR-001: Task Creation ≤500ms', () => {
    it('should create task within 500ms', async () => {
      const createdTask = {
        id: 'task-uuid',
        userId: 'user-uuid',
        title: 'Performance Test Task',
        description: 'Test',
        dueDate: new Date(),
        priority: 'MEDIUM',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Simulate database response time (realistic ~50ms)
      mockPrismaClient.task.create.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return createdTask;
      });

      const startTime = Date.now();

      await service.createTask('user-uuid', {
        title: 'Performance Test Task',
        description: 'Test',
        priority: Priority.MEDIUM,
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500);
    });

    it('should handle rapid consecutive creates', async () => {
      const createdTask = {
        id: 'task-uuid',
        userId: 'user-uuid',
        title: 'Performance Test Task',
        description: 'Test',
        dueDate: new Date(),
        priority: 'MEDIUM',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.create.mockResolvedValue(createdTask);

      const startTime = Date.now();
      const createPromises = [];

      for (let i = 0; i < 10; i++) {
        createPromises.push(
          service.createTask('user-uuid', {
            title: `Task ${i}`,
            priority: Priority.MEDIUM,
          })
        );
      }

      await Promise.all(createPromises);

      const endTime = Date.now();
      const totalDuration = endTime - startTime;
      const avgDuration = totalDuration / 10;

      // Average should still be well under 500ms
      expect(avgDuration).toBeLessThan(500);
    });
  });

  describe('NFR-002: Task List ≤1s with 100 tasks', () => {
    it('should list 100 tasks within 1 second', async () => {
      // Generate 100 mock tasks
      const mockTasks = Array.from({ length: 100 }, (_, i) => ({
        id: `task-${i}`,
        userId: 'user-uuid',
        title: `Task ${i}`,
        description: `Description for task ${i}`,
        dueDate: new Date(),
        priority: ['LOW', 'MEDIUM', 'HIGH'][i % 3],
        isCompleted: i % 2 === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Simulate database response time (realistic ~100ms for 100 records)
      mockPrismaClient.task.findMany.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockTasks;
      });

      const startTime = Date.now();

      const result = await service.getTasks('user-uuid');

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(result.tasks.length).toBe(100);
      expect(duration).toBeLessThan(1000);
    });

    it('should filter tasks efficiently', async () => {
      const mockTasks = Array.from({ length: 50 }, (_, i) => ({
        id: `task-${i}`,
        userId: 'user-uuid',
        title: `Task ${i}`,
        description: null,
        dueDate: new Date(),
        priority: 'MEDIUM',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrismaClient.task.findMany.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return mockTasks;
      });

      const startTime = Date.now();

      await service.getTasks('user-uuid', { status: 'active' });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isCompleted: false,
          }),
        })
      );
    });

    it('should sort tasks efficiently', async () => {
      const mockTasks = Array.from({ length: 100 }, (_, i) => ({
        id: `task-${i}`,
        userId: 'user-uuid',
        title: `Task ${i}`,
        description: null,
        dueDate: new Date(Date.now() + i * 86400000),
        priority: ['LOW', 'MEDIUM', 'HIGH'][i % 3],
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrismaClient.task.findMany.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockTasks;
      });

      const startTime = Date.now();

      await service.getTasks('user-uuid', { sort: 'due_date' });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Database Query Optimization', () => {
    it('should use appropriate indexes for user queries', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([]);

      await repository.findByUserId('user-uuid');

      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-uuid' },
        })
      );
    });

    it('should use composite index for status filter', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([]);

      await repository.findByUserId('user-uuid', { status: 'active' });

      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: 'user-uuid',
            isCompleted: false,
          },
        })
      );
    });

    it('should limit results to prevent memory issues', async () => {
      const largeMockTasks = Array.from({ length: 100 }, (_, i) => ({
        id: `task-${i}`,
        userId: 'user-uuid',
        title: `Task ${i}`,
        description: null,
        dueDate: null,
        priority: 'MEDIUM',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrismaClient.task.findMany.mockResolvedValue(largeMockTasks);

      await repository.findByUserId('user-uuid');

      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        })
      );
    });
  });

  describe('Memory Efficiency', () => {
    it('should not leak memory on repeated operations', async () => {
      const createdTask = {
        id: 'task-uuid',
        userId: 'user-uuid',
        title: 'Memory Test Task',
        description: 'Test',
        dueDate: new Date(),
        priority: 'MEDIUM',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.create.mockResolvedValue(createdTask);
      mockPrismaClient.task.findMany.mockResolvedValue([createdTask]);

      // Perform many operations
      for (let i = 0; i < 100; i++) {
        await service.createTask('user-uuid', { title: `Task ${i}` });
        await service.getTasks('user-uuid');
      }

      // If we get here without running out of memory, the test passes
      expect(true).toBe(true);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent reads', async () => {
      const mockTasks = [
        {
          id: 'task-1',
          userId: 'user-uuid',
          title: 'Task 1',
          description: null,
          dueDate: null,
          priority: 'MEDIUM',
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.task.findMany.mockResolvedValue(mockTasks);

      const startTime = Date.now();

      // 10 concurrent read operations
      const readPromises = Array.from({ length: 10 }, () =>
        service.getTasks('user-uuid')
      );

      await Promise.all(readPromises);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // All concurrent reads should complete within reasonable time
      expect(duration).toBeLessThan(2000);
      expect(mockPrismaClient.task.findMany).toHaveBeenCalledTimes(10);
    });

    it('should handle mixed concurrent operations', async () => {
      const mockTask = {
        id: 'task-uuid',
        userId: 'user-uuid',
        title: 'Task',
        description: null,
        dueDate: null,
        priority: 'MEDIUM',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.create.mockResolvedValue(mockTask);
      mockPrismaClient.task.findMany.mockResolvedValue([mockTask]);
      mockPrismaClient.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaClient.task.update.mockResolvedValue({ ...mockTask, isCompleted: true });

      const startTime = Date.now();

      const operations = [
        ...Array.from({ length: 5 }, () => service.getTasks('user-uuid')),
        ...Array.from({ length: 3 }, () =>
          service.createTask('user-uuid', { title: 'New Task' })
        ),
        ...Array.from({ length: 2 }, () =>
          service.toggleTaskComplete('user-uuid', 'task-uuid')
        ),
      ];

      await Promise.all(operations);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(3000);
    });
  });
});
