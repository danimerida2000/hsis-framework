/**
 * Frontend Types
 * Shared types for React components
 */

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: Priority;
}

export interface ToggleResponse {
  id: string;
  isCompleted: boolean;
  updatedAt: string;
}

export type TaskStatus = 'all' | 'active' | 'completed';
export type TaskSort = 'due_date' | 'priority' | undefined;

export interface TaskFilters {
  status: TaskStatus;
  sort: TaskSort;
}
