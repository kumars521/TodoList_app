import type {
  ApiClient,
  LoginRequest,
  LoginResponse,
  Role,
  TaskResponse,
  TasksResponse,
  UserResponse,
  UsersResponse,
} from '@app/shared';

const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export const liveClient: ApiClient = {
  getCurrentUser: async () => {
    const result = await request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'priya@taskflow.io', password: 'session' }),
    });
    return result.user;
  },
  login: (data: LoginRequest) => request<LoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  listTasks: () => request<TasksResponse>('/api/tasks'),
  createTask: (task) => request<TaskResponse>('/api/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id, input) => request<TaskResponse>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  deleteTask: (id) => request<{ deleted: true; id: string }>(`/api/tasks/${id}`, { method: 'DELETE' }),
  listUsers: () => request<UsersResponse>('/api/users'),
  updateUserRole: (id: string, role: Role) => request<UserResponse>(`/api/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
};