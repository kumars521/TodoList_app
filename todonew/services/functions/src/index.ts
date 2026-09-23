import { app } from '@azure/functions';

type JsonBody = Record<string, unknown>;

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: async () => ({
    jsonBody: { status: 'ok', services: ['tasks-api'] }
  })
});

app.http('login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: async (request) => {
    const body = (await request.json()) as JsonBody;
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return {
        status: 401,
        jsonBody: { error: { code: 'INVALID_CREDENTIALS', message: 'Email and password are required.' } }
      };
    }

    return {
      status: 200,
      jsonBody: {
        user: { id: 'u-1', name: 'Priya Shah', email, role: 'Team Lead' },
        token: 'demo-token'
      }
    };
  }
});

app.http('listTasks', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'tasks',
  handler: async () => ({
    status: 200,
    jsonBody: {
      tasks: [
        { id: 't-1', title: 'Launch checklist', owner: 'Priya', dueDate: 'Today', priority: 'High', status: 'in-progress', completed: false },
        { id: 't-2', title: 'QA bug triage', owner: 'Mateo', dueDate: 'Tomorrow', priority: 'Medium', status: 'review', completed: false },
        { id: 't-3', title: 'Sprint retro notes', owner: 'Daria', dueDate: 'Thu', priority: 'Low', status: 'planned', completed: false },
        { id: 't-4', title: 'Design review', owner: 'Jess', dueDate: 'Thu', priority: 'High', status: 'planned', completed: false }
      ],
      total: 4
    }
  })
});

app.http('createTask', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'tasks',
  handler: async (request) => {
    const body = (await request.json()) as JsonBody;
    return {
      status: 201,
      jsonBody: {
        task: {
          id: `task-${Date.now()}`,
          title: String(body.title ?? 'Untitled task'),
          owner: String(body.owner ?? 'Unassigned'),
          dueDate: String(body.dueDate ?? 'Today'),
          priority: (body.priority ?? 'Medium') as 'High' | 'Medium' | 'Low',
          status: 'planned',
          completed: false
        }
      }
    };
  }
});

app.http('updateTask', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'tasks/{id}',
  handler: async (request) => {
    const id = request.params.id ?? 'unknown';
    const body = (await request.json()) as JsonBody;
    return {
      status: 200,
      jsonBody: {
        task: {
          id,
          title: 'Updated task',
          owner: String(body.owner ?? 'Priya'),
          dueDate: 'Today',
          priority: (body.priority ?? 'Medium') as 'High' | 'Medium' | 'Low',
          status: body.completed ? 'done' : 'in-progress',
          completed: Boolean(body.completed)
        }
      }
    };
  }
});

app.http('deleteTask', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'tasks/{id}',
  handler: async (request) => ({
    status: 200,
    jsonBody: { deleted: true, id: request.params.id ?? 'unknown' }
  })
});

app.http('listUsers', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users',
  handler: async () => ({
    status: 200,
    jsonBody: {
      users: [
        { id: 'u-1', name: 'Priya Shah', email: 'priya@taskflow.io', role: 'Team Lead', access: 'Full access' },
        { id: 'u-2', name: 'Mateo Jones', email: 'mateo@taskflow.io', role: 'Operator', access: 'Task access' },
        { id: 'u-3', name: 'Daria Lee', email: 'daria@taskflow.io', role: 'Viewer', access: 'Read-only' }
      ]
    }
  })
});

app.http('updateUserRole', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'users/{id}/role',
  handler: async (request) => {
    const body = (await request.json()) as JsonBody;
    return {
      status: 200,
      jsonBody: {
        user: {
          id: request.params.id ?? 'u-1',
          name: 'Priya Shah',
          email: 'priya@taskflow.io',
          role: String(body.role ?? 'Team Lead'),
          access: 'Full access'
        }
      }
    };
  }
});
