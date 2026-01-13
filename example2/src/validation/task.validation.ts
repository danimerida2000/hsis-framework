/**
 * Task Validation Schemas
 * Per ARCHITECTURE.md Section 6 - Input Validation
 */

import { z } from 'zod';
import { Priority } from '../types';

/**
 * Schema for creating a new task
 * Per ARCHITECTURE.md Section 5 - POST /tasks
 */
export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less'),
  description: z.string().optional(),
  dueDate: z.string().datetime({ offset: true }).optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
});

/**
 * Schema for updating an existing task
 * Per ARCHITECTURE.md Section 5 - PUT /tasks/:id
 */
export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must be 255 characters or less')
    .optional(),
  description: z.string().nullable().optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
  priority: z.nativeEnum(Priority).optional(),
});

/**
 * Schema for task filters query parameters
 * Per ARCHITECTURE.md Section 5 - GET /tasks
 */
export const taskFiltersSchema = z.object({
  status: z.enum(['all', 'active', 'completed']).default('all'),
  sort: z.enum(['due_date', 'priority']).optional(),
});

/**
 * Schema for task ID parameter
 */
export const taskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID format'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>;
