/**
 * Task Validation Schema Unit Tests
 * Per IMPLEMENTATION_PLAN.md T-007
 */

import { ZodError } from 'zod';
import {
  createTaskSchema,
  updateTaskSchema,
  taskFiltersSchema,
  taskIdSchema,
} from '../../src/validation';
import { Priority } from '../../src/types';

describe('Task Validation Schemas', () => {
  describe('createTaskSchema', () => {
    it('should validate a valid task creation request', () => {
      const validData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-01-25T17:00:00Z',
        priority: 'medium',
      };

      const result = createTaskSchema.parse(validData);

      expect(result.title).toBe('Test Task');
      expect(result.description).toBe('Test Description');
      expect(result.priority).toBe('medium');
    });

    it('should require a title', () => {
      const invalidData = {
        description: 'Test Description',
      };

      expect(() => createTaskSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
      };

      expect(() => createTaskSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject title longer than 255 characters', () => {
      const invalidData = {
        title: 'a'.repeat(256),
      };

      expect(() => createTaskSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should accept maximum length title (255 chars)', () => {
      const validData = {
        title: 'a'.repeat(255),
      };

      const result = createTaskSchema.parse(validData);
      expect(result.title.length).toBe(255);
    });

    it('should default priority to medium', () => {
      const validData = {
        title: 'Test Task',
      };

      const result = createTaskSchema.parse(validData);

      expect(result.priority).toBe(Priority.MEDIUM);
    });

    it('should accept all valid priorities', () => {
      for (const priority of ['low', 'medium', 'high']) {
        const validData = { title: 'Test', priority };
        const result = createTaskSchema.parse(validData);
        expect(result.priority).toBe(priority);
      }
    });

    it('should reject invalid priority', () => {
      const invalidData = {
        title: 'Test Task',
        priority: 'urgent',
      };

      expect(() => createTaskSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should validate ISO 8601 datetime format', () => {
      const validData = {
        title: 'Test Task',
        dueDate: '2024-01-25T17:00:00Z',
      };

      const result = createTaskSchema.parse(validData);
      expect(result.dueDate).toBe('2024-01-25T17:00:00Z');
    });

    it('should accept datetime with offset', () => {
      const validData = {
        title: 'Test Task',
        dueDate: '2024-01-25T17:00:00+05:00',
      };

      const result = createTaskSchema.parse(validData);
      expect(result.dueDate).toBe('2024-01-25T17:00:00+05:00');
    });

    it('should reject invalid datetime format', () => {
      const invalidData = {
        title: 'Test Task',
        dueDate: '2024-01-25',
      };

      expect(() => createTaskSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should allow optional fields to be omitted', () => {
      const validData = {
        title: 'Test Task',
      };

      const result = createTaskSchema.parse(validData);

      expect(result.description).toBeUndefined();
      expect(result.dueDate).toBeUndefined();
    });
  });

  describe('updateTaskSchema', () => {
    it('should validate a valid update request', () => {
      const validData = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'high',
      };

      const result = updateTaskSchema.parse(validData);

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated Description');
      expect(result.priority).toBe('high');
    });

    it('should allow partial updates', () => {
      const validData = {
        title: 'Updated Title',
      };

      const result = updateTaskSchema.parse(validData);

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBeUndefined();
      expect(result.priority).toBeUndefined();
    });

    it('should allow empty update (no fields)', () => {
      const validData = {};

      const result = updateTaskSchema.parse(validData);

      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should reject empty title if provided', () => {
      const invalidData = {
        title: '',
      };

      expect(() => updateTaskSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should allow null dueDate to clear it', () => {
      const validData = {
        dueDate: null,
      };

      const result = updateTaskSchema.parse(validData);
      expect(result.dueDate).toBeNull();
    });

    it('should allow null description to clear it', () => {
      const validData = {
        description: null,
      };

      const result = updateTaskSchema.parse(validData);
      expect(result.description).toBeNull();
    });
  });

  describe('taskFiltersSchema', () => {
    it('should validate all status values', () => {
      for (const status of ['all', 'active', 'completed']) {
        const result = taskFiltersSchema.parse({ status });
        expect(result.status).toBe(status);
      }
    });

    it('should default status to all', () => {
      const result = taskFiltersSchema.parse({});
      expect(result.status).toBe('all');
    });

    it('should reject invalid status', () => {
      const invalidData = { status: 'pending' };
      expect(() => taskFiltersSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should validate sort values', () => {
      for (const sort of ['due_date', 'priority']) {
        const result = taskFiltersSchema.parse({ sort });
        expect(result.sort).toBe(sort);
      }
    });

    it('should allow omitting sort', () => {
      const result = taskFiltersSchema.parse({});
      expect(result.sort).toBeUndefined();
    });

    it('should reject invalid sort value', () => {
      const invalidData = { sort: 'title' };
      expect(() => taskFiltersSchema.parse(invalidData)).toThrow(ZodError);
    });
  });

  describe('taskIdSchema', () => {
    it('should validate a valid UUID', () => {
      const validData = { id: '123e4567-e89b-12d3-a456-426614174000' };
      const result = taskIdSchema.parse(validData);
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should reject invalid UUID format', () => {
      const invalidData = { id: 'not-a-uuid' };
      expect(() => taskIdSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should reject empty string', () => {
      const invalidData = { id: '' };
      expect(() => taskIdSchema.parse(invalidData)).toThrow(ZodError);
    });

    it('should require id field', () => {
      expect(() => taskIdSchema.parse({})).toThrow(ZodError);
    });
  });
});
