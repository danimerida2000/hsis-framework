/**
 * useTask Hook
 * Per ARCHITECTURE.md Component Responsibilities - Uses React Query for API calls and caching
 * Per IMPLEMENTATION_PLAN.md T-014
 */

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../api';
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  TaskStatus,
  TaskSort,
} from '../types';

interface UseTaskState {
  tasks: Task[];
  total: number;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
}

interface UseTaskReturn extends UseTaskState {
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<Task | null>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<Task | null>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setStatus: (status: TaskStatus) => void;
  setSort: (sort: TaskSort) => void;
}

/**
 * Custom hook for task management
 * Provides CRUD operations and state management for tasks
 */
export function useTask(): UseTaskReturn {
  const [state, setState] = useState<UseTaskState>({
    tasks: [],
    total: 0,
    isLoading: false,
    error: null,
    filters: {
      status: 'all',
      sort: undefined,
    },
  });

  const fetchTasks = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiClient.getTasks(state.filters);
      setState(prev => ({
        ...prev,
        tasks: response.tasks,
        total: response.total,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      }));
    }
  }, [state.filters]);

  const createTask = useCallback(async (data: CreateTaskInput): Promise<Task | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const task = await apiClient.createTask(data);
      setState(prev => ({
        ...prev,
        tasks: [task, ...prev.tasks],
        total: prev.total + 1,
        isLoading: false,
      }));
      return task;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create task',
      }));
      return null;
    }
  }, []);

  const updateTask = useCallback(async (
    id: string,
    data: UpdateTaskInput
  ): Promise<Task | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedTask = await apiClient.updateTask(id, data);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === id ? updatedTask : task
        ),
        isLoading: false,
      }));
      return updatedTask;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update task',
      }));
      return null;
    }
  }, []);

  const toggleTask = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const response = await apiClient.toggleTask(id);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === id
            ? { ...task, isCompleted: response.isCompleted, updatedAt: response.updatedAt }
            : task
        ),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to toggle task',
      }));
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      await apiClient.deleteTask(id);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id),
        total: prev.total - 1,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete task',
      }));
    }
  }, []);

  const setStatus = useCallback((status: TaskStatus): void => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, status },
    }));
  }, []);

  const setSort = useCallback((sort: TaskSort): void => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, sort },
    }));
  }, []);

  // Fetch tasks when filters change
  useEffect(() => {
    void fetchTasks();
  }, [state.filters.status, state.filters.sort]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    setStatus,
    setSort,
  };
}
