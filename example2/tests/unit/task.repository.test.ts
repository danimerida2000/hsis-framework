/**
 * Task Repository Unit Tests
 * Per IMPLEMENTATION_PLAN.md T-005
 */

import { TaskRepository, ITaskRepository } from '../../src/repository';
import { Priority, CreateTaskDto, UpdateTaskDto, TaskFilters } from '../../src/types';

// Mock Prisma client
const mockPrismaClient = {
  task: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('TaskRepository', () => {
  let repository: ITaskRepository;

  const mockTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-123',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date('2024-01-25T17:00:00Z'),
    priority: 'MEDIUM',
    isCompleted: false,
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new TaskRepository(mockPrismaClient as any);
  });

  describe('findByUserId', () => {
    it('should return all tasks for a user', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([mockTask]);

      const result = await repository.findByUserId('user-123');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockTask.id);
      expect(result[0].userId).toBe('user-123');
      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123' },
        })
      );
    });

    it('should filter by active status', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([mockTask]);

      const filters: TaskFilters = { status: 'active' };
      await repository.findByUserId('user-123', filters);

      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123', isCompleted: false },
        })
      );
    });

    it('should filter by completed status', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([]);

      const filters: TaskFilters = { status: 'completed' };
      await repository.findByUserId('user-123', filters);

      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-123', isCompleted: true },
        })
      );
    });

    it('should sort by due_date', async () => {
      mockPrismaClient.task.findMany.mockResolvedValue([mockTask]);

      const filters: TaskFilters = { sort: 'due_date' };
      await repository.findByUserId('user-123', filters);

      expect(mockPrismaClient.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ dueDate: 'asc' }],
        })
      );
    });

    it('should sort by priority', async () => {
      const highPriorityTask = { ...mockTask, id: 'task-high', priority: 'HIGH' };
      const lowPriorityTask = { ...mockTask, id: 'task-low', priority: 'LOW' };
      mockPrismaClient.task.findMany.mockResolvedValue([
        lowPriorityTask,
        highPriorityTask,
        mockTask,
      ]);

      const filters: TaskFilters = { sort: 'priority' };
      const result = await repository.findByUserId('user-123', filters);

      // Should be sorted high > medium > low
      expect(result[0].id).toBe('task-high');
      expect(result[1].id).toBe(mockTask.id);
      expect(result[2].id).toBe('task-low');
    });
  });

  describe('findById', () => {
    it('should return a task if found and belongs to user', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(mockTask);

      const result = await repository.findById(mockTask.id, 'user-123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe(mockTask.id);
      expect(mockPrismaClient.task.findFirst).toHaveBeenCalledWith({
        where: { id: mockTask.id, userId: 'user-123' },
      });
    });

    it('should return null if task not found', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      const result = await repository.findById('non-existent', 'user-123');

      expect(result).toBeNull();
    });

    it('should enforce user isolation', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      const result = await repository.findById(mockTask.id, 'different-user');

      expect(result).toBeNull();
      expect(mockPrismaClient.task.findFirst).toHaveBeenCalledWith({
        where: { id: mockTask.id, userId: 'different-user' },
      });
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      mockPrismaClient.task.create.mockResolvedValue(mockTask);

      const data: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-01-25T17:00:00Z',
        priority: Priority.MEDIUM,
      };

      const result = await repository.create('user-123', data);

      expect(result.title).toBe('Test Task');
      expect(result.userId).toBe('user-123');
      expect(mockPrismaClient.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-123',
          title: 'Test Task',
          isCompleted: false,
        }),
      });
    });

    it('should create task with default priority if not provided', async () => {
      mockPrismaClient.task.create.mockResolvedValue(mockTask);

      const data: CreateTaskDto = { title: 'Test Task' };
      await repository.create('user-123', data);

      expect(mockPrismaClient.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          priority: 'MEDIUM',
        }),
      });
    });

    it('should handle optional fields', async () => {
      const taskWithoutOptionals = {
        ...mockTask,
        description: null,
        dueDate: null,
      };
      mockPrismaClient.task.create.mockResolvedValue(taskWithoutOptionals);

      const data: CreateTaskDto = { title: 'Test Task' };
      const result = await repository.create('user-123', data);

      expect(result.description).toBeNull();
      expect(result.dueDate).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(mockTask);
      const updatedTask = { ...mockTask, title: 'Updated Title' };
      mockPrismaClient.task.update.mockResolvedValue(updatedTask);

      const data: UpdateTaskDto = { title: 'Updated Title' };
      const result = await repository.update(mockTask.id, 'user-123', data);

      expect(result.title).toBe('Updated Title');
      expect(mockPrismaClient.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { title: 'Updated Title' },
      });
    });

    it('should throw error if task not found', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      const data: UpdateTaskDto = { title: 'Updated Title' };

      await expect(repository.update('non-existent', 'user-123', data))
        .rejects.toThrow('Task not found');
    });

    it('should update multiple fields', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaClient.task.update.mockResolvedValue(mockTask);

      const data: UpdateTaskDto = {
        title: 'New Title',
        description: 'New Description',
        priority: Priority.HIGH,
      };
      await repository.update(mockTask.id, 'user-123', data);

      expect(mockPrismaClient.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: expect.objectContaining({
          title: 'New Title',
          description: 'New Description',
          priority: 'HIGH',
        }),
      });
    });
  });

  describe('delete', () => {
    it('should delete an existing task', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(mockTask);
      mockPrismaClient.task.delete.mockResolvedValue(mockTask);

      await repository.delete(mockTask.id, 'user-123');

      expect(mockPrismaClient.task.delete).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
    });

    it('should throw error if task not found', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      await expect(repository.delete('non-existent', 'user-123'))
        .rejects.toThrow('Task not found');
    });
  });

  describe('toggleComplete', () => {
    it('should toggle incomplete task to complete', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(mockTask);
      const toggledTask = { ...mockTask, isCompleted: true };
      mockPrismaClient.task.update.mockResolvedValue(toggledTask);

      const result = await repository.toggleComplete(mockTask.id, 'user-123');

      expect(result.isCompleted).toBe(true);
      expect(mockPrismaClient.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { isCompleted: true },
      });
    });

    it('should toggle complete task to incomplete', async () => {
      const completedTask = { ...mockTask, isCompleted: true };
      mockPrismaClient.task.findFirst.mockResolvedValue(completedTask);
      const toggledTask = { ...mockTask, isCompleted: false };
      mockPrismaClient.task.update.mockResolvedValue(toggledTask);

      const result = await repository.toggleComplete(mockTask.id, 'user-123');

      expect(result.isCompleted).toBe(false);
      expect(mockPrismaClient.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { isCompleted: false },
      });
    });

    it('should throw error if task not found', async () => {
      mockPrismaClient.task.findFirst.mockResolvedValue(null);

      await expect(repository.toggleComplete('non-existent', 'user-123'))
        .rejects.toThrow('Task not found');
    });
  });

  describe('count', () => {
    it('should count tasks for a user', async () => {
      mockPrismaClient.task.count.mockResolvedValue(5);

      const result = await repository.count('user-123');

      expect(result).toBe(5);
      expect(mockPrismaClient.task.count).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
    });
  });
});
