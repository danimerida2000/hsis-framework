/**
 * Task Repository
 * Per IMPLEMENTATION_PLAN.md T-005 and ARCHITECTURE.md Component Responsibilities
 * Handles all database operations for tasks using Prisma ORM (ADR-001)
 */

import { PrismaClient, Task as PrismaTask, Prisma } from '@prisma/client';
import { Task, TaskFilters, CreateTaskDto, UpdateTaskDto, Priority } from '../types';

/**
 * Maps Prisma Task to domain Task
 */
function mapPrismaTaskToDomain(prismaTask: PrismaTask): Task {
  return {
    id: prismaTask.id,
    userId: prismaTask.userId,
    title: prismaTask.title,
    description: prismaTask.description,
    dueDate: prismaTask.dueDate,
    priority: prismaTask.priority.toLowerCase() as Priority,
    isCompleted: prismaTask.isCompleted,
    createdAt: prismaTask.createdAt,
    updatedAt: prismaTask.updatedAt,
  };
}

/**
 * Task Repository Interface
 * Per IMPLEMENTATION_PLAN.md Section 3
 */
export interface ITaskRepository {
  findByUserId(userId: string, filters?: TaskFilters): Promise<Task[]>;
  findById(id: string, userId: string): Promise<Task | null>;
  create(userId: string, data: CreateTaskDto): Promise<Task>;
  update(id: string, userId: string, data: UpdateTaskDto): Promise<Task>;
  delete(id: string, userId: string): Promise<void>;
  toggleComplete(id: string, userId: string): Promise<Task>;
  count(userId: string): Promise<number>;
}

/**
 * Prisma-based Task Repository implementation
 */
export class TaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find all tasks for a user with optional filters
   * Per FR-002, FR-006, FR-007
   */
  async findByUserId(userId: string, filters?: TaskFilters): Promise<Task[]> {
    const where: Prisma.TaskWhereInput = { userId };

    // Apply status filter (FR-006)
    if (filters?.status === 'active') {
      where.isCompleted = false;
    } else if (filters?.status === 'completed') {
      where.isCompleted = true;
    }

    // Build order by clause (FR-007)
    let orderBy: Prisma.TaskOrderByWithRelationInput[] = [];

    if (filters?.sort === 'due_date') {
      orderBy = [{ dueDate: 'asc' }];
    } else if (filters?.sort === 'priority') {
      // Priority ordering handled in application layer
      // Prisma doesn't support custom enum ordering directly
      orderBy = [{ priority: 'asc' }];
    } else {
      orderBy = [{ createdAt: 'desc' }];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy,
      take: 100, // Default limit per NFR-002
    });

    let result = tasks.map(mapPrismaTaskToDomain);

    // Sort by priority if requested (high > medium > low)
    if (filters?.sort === 'priority') {
      const priorityOrder: Record<Priority, number> = {
        [Priority.HIGH]: 1,
        [Priority.MEDIUM]: 2,
        [Priority.LOW]: 3,
      };
      result = result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return result;
  }

  /**
   * Find a single task by ID
   * Enforces user isolation (NFR-004)
   */
  async findById(id: string, userId: string): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId, // Enforce user isolation
      },
    });

    return task ? mapPrismaTaskToDomain(task) : null;
  }

  /**
   * Create a new task
   * Per FR-001
   */
  async create(userId: string, data: CreateTaskDto): Promise<Task> {
    const priorityEnum = this.mapPriorityToEnum(data.priority || Priority.MEDIUM);

    const task = await this.prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: priorityEnum,
        isCompleted: false,
      },
    });

    return mapPrismaTaskToDomain(task);
  }

  /**
   * Update an existing task
   * Per FR-003
   */
  async update(id: string, userId: string, data: UpdateTaskDto): Promise<Task> {
    // First check if task exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Task not found');
    }

    const updateData: Prisma.TaskUpdateInput = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.priority !== undefined) {
      updateData.priority = this.mapPriorityToEnum(data.priority);
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: updateData,
    });

    return mapPrismaTaskToDomain(task);
  }

  /**
   * Delete a task
   * Per FR-005
   */
  async delete(id: string, userId: string): Promise<void> {
    // First check if task exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Task not found');
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }

  /**
   * Toggle task completion status
   * Per FR-004
   */
  async toggleComplete(id: string, userId: string): Promise<Task> {
    // First check if task exists and belongs to user
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Task not found');
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        isCompleted: !existing.isCompleted,
      },
    });

    return mapPrismaTaskToDomain(task);
  }

  /**
   * Count tasks for a user
   */
  async count(userId: string): Promise<number> {
    return this.prisma.task.count({
      where: { userId },
    });
  }

  /**
   * Map Priority enum to Prisma enum
   */
  private mapPriorityToEnum(priority: Priority): Prisma.EnumPriorityFieldUpdateOperationsInput['set'] {
    const mapping = {
      [Priority.LOW]: 'LOW',
      [Priority.MEDIUM]: 'MEDIUM',
      [Priority.HIGH]: 'HIGH',
    } as const;
    return mapping[priority] as 'LOW' | 'MEDIUM' | 'HIGH';
  }
}
