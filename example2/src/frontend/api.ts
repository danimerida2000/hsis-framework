/**
 * API Client
 * Per ARCHITECTURE.md Section 5 - API Contracts
 */

import {
  Task,
  TaskListResponse,
  CreateTaskInput,
  UpdateTaskInput,
  ToggleResponse,
  TaskFilters,
} from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

interface ApiError {
  code: string;
  message: string;
  detail?: string;
  trace_id: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: object
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      throw new Error(error.message);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  async getTasks(filters?: TaskFilters): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.sort) {
      params.append('sort', filters.sort);
    }
    const query = params.toString();
    return this.request<TaskListResponse>('GET', `/tasks${query ? `?${query}` : ''}`);
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    return this.request<Task>('POST', '/tasks', data);
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    return this.request<Task>('PUT', `/tasks/${id}`, data);
  }

  async toggleTask(id: string): Promise<ToggleResponse> {
    return this.request<ToggleResponse>('PATCH', `/tasks/${id}/toggle`);
  }

  async deleteTask(id: string): Promise<void> {
    return this.request<void>('DELETE', `/tasks/${id}`);
  }
}

export const apiClient = new ApiClient();
