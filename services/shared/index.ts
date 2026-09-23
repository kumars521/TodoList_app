export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  project: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateInput {
  title: string;
  projectId: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
}

export interface TaskUpdateInput {
  status?: TaskStatus;
  assignee?: string;
  dueDate?: string;
  priority?: TaskPriority;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  services: {
    database: 'ok' | 'degraded';
    storage: 'ok' | 'degraded';
  };
}

export interface TaskListResponse {
  items: TaskItem[];
}

export type ApiErrorCode = 'INVALID_INPUT' | 'NOT_FOUND' | 'SERVICE_ERROR';

export interface ApiError {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}
