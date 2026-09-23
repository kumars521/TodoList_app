import type { HealthResponse, TaskCreateInput, TaskItem, TaskUpdateInput } from '@app/shared';

export type { HealthResponse, TaskCreateInput, TaskItem, TaskUpdateInput } from '@app/shared';

export interface ApiClient {
  healthCheck(): Promise<HealthResponse>;
  listTasks(): Promise<TaskItem[]>;
  getTask(id: string): Promise<TaskItem | null>;
  createTask(input: TaskCreateInput): Promise<TaskItem>;
  updateTask(id: string, input: TaskUpdateInput): Promise<TaskItem | null>;
  deleteTask(id: string): Promise<boolean>;
}
