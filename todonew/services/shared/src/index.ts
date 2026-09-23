export type Priority = 'High' | 'Medium' | 'Low';
export type AccessLevel = 'Full access' | 'Task access' | 'Read-only';
export type Role = 'Team Lead' | 'Operator' | 'Viewer';
export type TaskStatus = 'planned' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  access: AccessLevel;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateTaskRequest {
  title: string;
  owner: string;
  dueDate: string;
  priority: Priority;
}

export interface UpdateTaskRequest {
  completed?: boolean;
  priority?: Priority;
  owner?: string;
}

export interface RoleUpdateRequest {
  role: Role;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface TaskResponse {
  task: Task;
}

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface ApiClient {
  getCurrentUser: () => Promise<AuthUser>;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  listTasks: () => Promise<TasksResponse>;
  createTask: (task: CreateTaskRequest) => Promise<TaskResponse>;
  updateTask: (id: string, input: UpdateTaskRequest) => Promise<TaskResponse>;
  deleteTask: (id: string) => Promise<{ deleted: true; id: string }>;
  listUsers: () => Promise<UsersResponse>;
  updateUserRole: (id: string, role: Role) => Promise<UserResponse>;
}
