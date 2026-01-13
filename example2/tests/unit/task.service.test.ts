/**
 * Task Service Unit Tests
 * Per IMPLEMENTATION_PLAN.md T-006
 */

import { TaskService, ITaskService } from '../../src/services';
import { ITaskRepository } from '../../src/repository';
import { Priority, Task, CreateTaskDto, UpdateTaskDto, TaskFilters, AppError } from '../../src/types';

describe('TaskService', () => {
  let service: ITaskService;
  let mockRepository: jest.Mocked<ITaskRepository>;

  const mockTask: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-123',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date('2024-01-25T17:00:00Z'),
    priority: Priority.MEDIUM,
    isCompleted: false,
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z'),
  };

  beforeEach(() => {
    mockRepository = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      toggleComplete: jest.fn(),
      count: jest.fn(),
    };
    service = new TaskService(mockRepository);
  });

  describe('getTasks', () => {
    it('should return tasks for a user', async () => {
      mockRepository.findByUserId.mockResolvedValue([mockTask]);

      const result = await service.getTasks('user-123');

      expect(result.tasks).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.tasks[0].id).toBe(mockTask.id);
    });

    it('should pass filters to repository', async () => {
      mockRepository.findByUserId.mockResolvedValue([]);

      const filters: TaskFilters = { status: 'active', sort: 'due_date' };
      await service.getTasks('user-123', filters);

      expect(mockRepository.findByUserId).toHaveBeenCalledWith('user-123', filters);
    });

    it('should convert dates to ISO strings', async () => {
      mockRepository.findByUserId.mockResolvedValue([mockTask]);

      const result = await service.getTasks('user-123');

      expect(result.tasks[0].dueDate).toBe('2024-01-25T17:00:00.000Z');
      expect(result.tasks[0].createdAt).toBe('2024-01-20T10:00:00.000Z');
    });

    it('should handle tasks without dueDate', async () => {
      const taskWithoutDueDate = { ...mockTask, dueDate: null };
      mockRepository.findByUserId.mockResolvedValue([taskWithoutDueDate]);

      const result = await service.getTasks('user-123');

      expect(result.tasks[0].dueDate).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      mockRepository.create.mockResolvedValue(mockTask);

      const data: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-01-25T17:00:00Z',
        priority: Priority.MEDIUM,
      };

      const result = await service.createTask('user-123', data);

      expect(result.id).toBe(mockTask.id);
      expect(result.title).toBe('Test Task');
      expect(mockRepository.create).toHaveBeenCalledWith('user-123', data);
    });

    it('should return task with ISO date strings', async () => {
      mockRepository.create.mockResolvedValue(mockTask);

      const data: CreateTaskDto = { title: 'Test Task' };
      const result = await service.createTask('user-123', data);

      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      mockRepository.findById.mockResolvedValue(mockTask);
      const updatedTask = { ...mockTask, title: 'Updated Title' };
      mockRepository.update.mockResolvedValue(updatedTask);

      const data: UpdateTaskDto = { title: 'Updated Title' };
      const result = await service.updateTask('user-123', mockTask.id, data);

      expect(result.title).toBe('Updated Title');
      expect(mockRepository.update).toHaveBeenCalledWith(mockTask.id, 'user-123', data);
    });

    it('should throw NotFound if task does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const data: UpdateTaskDto = { title: 'Updated Title' };

      await expect(service.updateTask('user-123', 'non-existent', data))
        .rejects.toThrow(AppError);

      try {
        await service.updateTask('user-123', 'non-existent', data);
      } catch (error) {
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).message).toBe('Task not found');
      }
    });

    it('should throw NotFound if task belongs to different user', async () => {
      mockRepository.findById.mockResolvedValue(null); // Repository enforces user isolation

      const data: UpdateTaskDto = { title: 'Updated Title' };

      await expect(service.updateTask('different-user', mockTask.id, data))
        .rejects.toThrow(AppError);
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      mockRepository.findById.mockResolvedValue(mockTask);
      mockRepository.delete.mockResolvedValue();

      await service.deleteTask('user-123', mockTask.id);

      expect(mockRepository.delete).toHaveBeenCalledWith(mockTask.id, 'user-123');
    });

    it('should throw NotFound if task does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.deleteTask('user-123', 'non-existent'))
        .rejects.toThrow(AppError);
    });
  });

  describe('toggleTaskComplete', () => {
    it('should toggle task completion status', async () => {
      mockRepository.findById.mockResolvedValue(mockTask);
      const toggledTask = { ...mockTask, isCompleted: true };
      mockRepository.toggleComplete.mockResolvedValue(toggledTask);

      const result = await service.toggleTaskComplete('user-123', mockTask.id);

      expect(result.id).toBe(mockTask.id);
      expect(result.isCompleted).toBe(true);
      expect(typeof result.updatedAt).toBe('string');
    });

    it('should throw NotFound if task does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.toggleTaskComplete('user-123', 'non-existent'))
        .rejects.toThrow(AppError);
    });

    it('should return correct toggle response format', async () => {
      mockRepository.findById.mockResolvedValue(mockTask);
      mockRepository.toggleComplete.mockResolvedValue({ ...mockTask, isCompleted: true });

      const result = await service.toggleTaskComplete('user-123', mockTask.id);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('isCompleted');
      expect(result).toHaveProperty('updatedAt');
      expect(Object.keys(result)).toHaveLength(3);
    });
  });
});
