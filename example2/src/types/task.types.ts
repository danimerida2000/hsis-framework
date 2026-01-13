/**
 * Task Entity Types
 * Per ARCHITECTURE.md Section 4 - Data Models
 */

/**
 * Priority enum matching database enum
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Task entity interface
 * Represents a task in the system
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: Priority;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new task
 * Per ARCHITECTURE.md Section 5 - POST /tasks
 */
export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
}

/**
 * DTO for updating an existing task
 * Per ARCHITECTURE.md Section 5 - PUT /tasks/:id
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: Priority;
}

/**
 * Filter parameters for task queries
 * Per ARCHITECTURE.md Section 5 - GET /tasks
 */
export interface TaskFilters {
  status?: 'all' | 'active' | 'completed';
  sort?: 'due_date' | 'priority';
}

/**
 * Task response for API
 */
export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task list response for API
 */
export interface TaskListResponse {
  tasks: TaskResponse[];
  total: number;
}

/**
 * Toggle completion response
 */
export interface ToggleResponse {
  id: string;
  isCompleted: boolean;
  updatedAt: string;
}
