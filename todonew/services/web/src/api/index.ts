export type {
  AccessLevel,
  ApiClient,
  LoginRequest,
  LoginResponse,
  Priority,
  Role,
  Task,
  TaskStatus,
  TaskResponse,
  TasksResponse,
  User,
  UserResponse,
  UsersResponse,
} from '@app/shared';
import { liveClient } from './client';

export const api = liveClient;
