/**
 * Task Routes
 * Per ARCHITECTURE.md Section 5 - API Contracts
 * Implements all task-related HTTP endpoints
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ITaskService } from '../services';
import {
  createTaskSchema,
  updateTaskSchema,
  taskFiltersSchema,
  taskIdSchema,
} from '../validation';

// Async handler wrapper to handle promise rejections
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction): void => {
  fn(req, res, next).catch(next);
};

/**
 * Create task routes with dependency injection
 */
export function createTaskRoutes(taskService: ITaskService): Router {
  const router = Router();

  /**
   * GET /tasks
   * Get all tasks for authenticated user
   * Per FR-002, FR-006, FR-007
   */
  router.get('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as AuthenticatedRequest;

      // Validate and parse query parameters
      const filters = taskFiltersSchema.parse({
        status: req.query.status,
        sort: req.query.sort,
      });

      const result = await taskService.getTasks(user.userId, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }));

  /**
   * POST /tasks
   * Create a new task
   * Per FR-001
   */
  router.post('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as AuthenticatedRequest;

      // Validate request body
      const data = createTaskSchema.parse(req.body);

      const result = await taskService.createTask(user.userId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }));

  /**
   * PUT /tasks/:id
   * Update an existing task
   * Per FR-003
   */
  router.put('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as AuthenticatedRequest;

      // Validate task ID
      const { id } = taskIdSchema.parse({ id: req.params.id });

      // Validate request body
      const data = updateTaskSchema.parse(req.body);

      const result = await taskService.updateTask(user.userId, id, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }));

  /**
   * PATCH /tasks/:id/toggle
   * Toggle task completion status
   * Per FR-004
   */
  router.patch('/:id/toggle', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as AuthenticatedRequest;

      // Validate task ID
      const { id } = taskIdSchema.parse({ id: req.params.id });

      const result = await taskService.toggleTaskComplete(user.userId, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }));

  /**
   * DELETE /tasks/:id
   * Delete a task
   * Per FR-005
   */
  router.delete('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req as AuthenticatedRequest;

      // Validate task ID
      const { id } = taskIdSchema.parse({ id: req.params.id });

      await taskService.deleteTask(user.userId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }));

  return router;
}
