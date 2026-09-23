import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import { getServices } from '../services/registry.js';
import type { HealthResponse } from '@app/shared';

const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  services: z.object({
    database: z.enum(['ok', 'degraded']),
    storage: z.enum(['ok', 'degraded']),
  }),
});

export async function healthFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Health check triggered');

  const services = getServices();
  const database: HealthResponse['services']['database'] = await services.taskRepository
    .list()
    .then(() => 'ok' as const)
    .catch(() => 'degraded' as const);
  const storage: HealthResponse['services']['storage'] = await services.blobStorage
    .listFiles()
    .then(() => 'ok' as const)
    .catch(() => 'degraded' as const);

  const payload: HealthResponse = {
    status: database === 'ok' && storage === 'ok' ? 'ok' : 'degraded',
    services: {
      database,
      storage,
    },
  };

  const parsed = healthResponseSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: 500,
      jsonBody: {
        error: {
          code: 'SERVICE_ERROR',
          message: 'Health payload invalid',
          details: parsed.error.flatten(),
        },
      },
    };
  }

  return {
    status: payload.status === 'ok' ? 200 : 503,
    jsonBody: payload,
  };
}

app.http('health', {
  route: 'health',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: healthFunction,
});
