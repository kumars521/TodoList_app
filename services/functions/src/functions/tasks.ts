import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import type { TaskCreateInput, TaskUpdateInput } from '@app/shared';
import { getServices } from '../services/registry.js';

const createTaskSchema = z.object({
  title: z.string().min(1),
  projectId: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
});

const updateTaskSchema = z.object({
  status: z.enum(['Todo', 'In Progress', 'Review', 'Done']).optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
});

export async function listTasksFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Listing tasks');
  const repo = getServices().taskRepository;
  const items = await repo.list();
  return { status: 200, jsonBody: { items } };
}

export async function createTaskFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Creating task');
  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return {
      status: 422,
      jsonBody: {
        error: {
          code: 'INVALID_INPUT',
          message: 'Task validation failed',
          details: parsed.error.flatten(),
        },
      },
    };
  }

  const repo = getServices().taskRepository;
  const item = await repo.create(parsed.data as TaskCreateInput);

  return { status: 201, jsonBody: item };
}

export async function updateTaskFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Updating task');
  const taskId = request.params.id;
  const body = await request.json();
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return {
      status: 422,
      jsonBody: {
        error: {
          code: 'INVALID_INPUT',
          message: 'Update validation failed',
          details: parsed.error.flatten(),
        },
      },
    };
  }

  const repo = getServices().taskRepository;
  const item = await repo.update(taskId, parsed.data as TaskUpdateInput);
  if (!item) {
    return {
      status: 404,
      jsonBody: {
        error: { code: 'NOT_FOUND', message: `Task ${taskId} not found` },
      },
    };
  }

  return { status: 200, jsonBody: item };
}

export async function deleteTaskFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Deleting task');
  const taskId = request.params.id;
  const removed = await getServices().taskRepository.remove(taskId);

  if (!removed) {
    return {
      status: 404,
      jsonBody: {
        error: { code: 'NOT_FOUND', message: `Task ${taskId} not found` },
      },
    };
  }

  return { status: 200, jsonBody: { deleted: true } };
}

app.http('tasks-list', {
  route: 'tasks',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: listTasksFunction,
});

app.http('tasks-create', {
  route: 'tasks',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: createTaskFunction,
});

app.http('tasks-update', {
  route: 'tasks/{id}',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: updateTaskFunction,
});

app.http('tasks-delete', {
  route: 'tasks/{id}',
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: deleteTaskFunction,
});
