/**
 * Express Application Setup
 * Per ARCHITECTURE.md Section 2 - Architecture Diagram
 */

import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, errorMiddleware } from './middleware';
import { createTaskRoutes } from './routes';
import { TaskService } from './services';
import { TaskRepository } from './repository';

/**
 * Create and configure Express application
 */
export function createApp(prisma: PrismaClient): Application {
  const app = express();

  // Built-in middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint (no auth required)
  app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // API routes - all require authentication
  const taskRepository = new TaskRepository(prisma);
  const taskService = new TaskService(taskRepository);
  const taskRoutes = createTaskRoutes(taskService);

  // Mount task routes with auth middleware
  app.use('/api/v1/tasks', authMiddleware, taskRoutes);

  // Global error handler
  app.use(errorMiddleware);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      code: 'ERR_NOT_FOUND',
      message: 'Endpoint not found',
      trace_id: 'unknown',
    });
  });

  return app;
}
