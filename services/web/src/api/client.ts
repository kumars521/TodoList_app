import type { ApiClient, HealthResponse, TaskCreateInput, TaskItem, TaskUpdateInput } from './types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    throw new Error(body?.error?.message ?? `Request failed with status ${response.status}`);
  }

  return await response.json() as T;
}

export const liveClient: ApiClient = {
  async healthCheck(): Promise<HealthResponse> {
    return request<HealthResponse>('/health');
  },

  async listTasks(): Promise<TaskItem[]> {
    const response = await request<{ items: TaskItem[] }>('/tasks');
    return response.items;
  },

  async getTask(id: string): Promise<TaskItem | null> {
    const tasks = await this.listTasks();
    return tasks.find((task) => task.id === id) ?? null;
  },

  async createTask(input: TaskCreateInput): Promise<TaskItem> {
    return request<TaskItem>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateTask(id: string, input: TaskUpdateInput): Promise<TaskItem | null> {
    if (!input) return null;
    try {
      return await request<TaskItem>(`/tasks/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) return null;
      throw error;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      await request<{ deleted: boolean }>(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) return false;
      throw error;
    }
  },
};