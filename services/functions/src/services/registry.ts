import { env, isDevelopmentMode } from '../config.js';
import { BlobStorageService, type BlobStorageClient } from './blobStorageService.js';
import { PostgresTaskRepository, type TaskRepository } from './taskRepository.js';

export interface AppServices {
  taskRepository: TaskRepository;
  blobStorage: BlobStorageClient;
}

let services: AppServices | null = null;

export function initializeServices(): AppServices {
  const useDevelopment = isDevelopmentMode();

  const taskRepository = new PostgresTaskRepository(env.databaseUrl);
  const blobStorage = new BlobStorageService(env.storageConnectionString, useDevelopment);

  return {
    taskRepository,
    blobStorage,
  };
}

export function getServices(): AppServices {
  if (!services) {
    services = initializeServices();
  }

  return services;
}
