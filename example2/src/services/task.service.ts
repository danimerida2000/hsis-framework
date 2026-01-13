/**
 * Task Service
 * Per IMPLEMENTATION_PLAN.md T-006 and ARCHITECTURE.md Component Responsibilities
 * Implements business logic for task operations
 */

import { ITaskRepository } from '../repository';
import {
  Task,
  TaskFilters,
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponse,
  TaskListResponse,
  ToggleResponse,
  AppError,
} from '../types';
import { logger } from '../utils';

/**
 * Task Service Interface
 * Per IMPLEMENTATION_PLAN.md Section 3
 */
export interface ITaskService {
  getTasks(userId: string, filters?: TaskFilters): Promise<TaskListResponse>;
  createTask(userId: string, data: CreateTaskDto): Promise<TaskResponse>;
  updateTask(userId: string, taskId: string, data: UpdateTaskDto): Promise<TaskResponse>;
  deleteTask(userId: string, taskId: string): Promise<void>;
  toggleTaskComplete(userId: string, taskId: string): Promise<ToggleResponse>;
}

/**
 * Map domain Task to API response format
 */
function mapTaskToResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    priority: task.priority,
    isCompleted: task.isCompleted,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

/**
 * Task Service implementation
 */
export class TaskService implements ITaskService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  /**
   * Get all tasks for a user
   * Per FR-002
   */
  async getTasks(userId: string, filters?: TaskFilters): Promise<TaskListResponse> {
    const startTime = Date.now();

    const tasks = await this.taskRepository.findByUserId(userId, filters);
    const total = tasks.length;

    const duration = Date.now() - startTime;
    logger.info('task.list.viewed', { userId, duration });

    return {
      tasks: tasks.map(mapTaskToResponse),
      total,
    };
  }

  /**
   * Create a new task
   * Per FR-001
   */
  async createTask(userId: string, data: CreateTaskDto): Promise<TaskResponse> {
    const startTime = Date.now();

    const task = await this.taskRepository.create(userId, data);

    const duration = Date.now() - startTime;
    logger.info('task.created', { userId, taskId: task.id, duration });

    return mapTaskToResponse(task);
  }

  /**
   * Update an existing task
   * Per FR-003
   */
  async updateTask(userId: string, taskId: string, data: UpdateTaskDto): Promise<TaskResponse> {
    const startTime = Date.now();

    // Check if task exists and belongs to user
    const existing = await this.taskRepository.findById(taskId, userId);
    if (!existing) {
      throw AppError.notFound('Task not found');
    }

    const task = await this.taskRepository.update(taskId, userId, data);

    const duration = Date.now() - startTime;
    logger.info('task.updated', { userId, taskId, duration });

    return mapTaskToResponse(task);
  }

  /**
   * Delete a task
   * Per FR-005
   */
  async deleteTask(userId: string, taskId: string): Promise<void> {
    const startTime = Date.now();

    // Check if task exists and belongs to user
    const existing = await this.taskRepository.findById(taskId, userId);
    if (!existing) {
      throw AppError.notFound('Task not found');
    }

    await this.taskRepository.delete(taskId, userId);

    const duration = Date.now() - startTime;
    logger.info('task.deleted', { userId, taskId, duration });
  }

  /**
   * Toggle task completion status
   * Per FR-004
   */
  async toggleTaskComplete(userId: string, taskId: string): Promise<ToggleResponse> {
    const startTime = Date.now();

    // Check if task exists and belongs to user
    const existing = await this.taskRepository.findById(taskId, userId);
    if (!existing) {
      throw AppError.notFound('Task not found');
    }

    const task = await this.taskRepository.toggleComplete(taskId, userId);

    const duration = Date.now() - startTime;
    logger.info('task.completed', { userId, taskId, duration });

    return {
      id: task.id,
      isCompleted: task.isCompleted,
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
