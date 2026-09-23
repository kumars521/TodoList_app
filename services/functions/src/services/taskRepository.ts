import { randomUUID } from 'node:crypto'
import { Pool } from 'pg';
import type { TaskCreateInput, TaskItem, TaskUpdateInput } from '@app/shared';

export interface TaskRepository {
  list(): Promise<TaskItem[]>;
  create(input: TaskCreateInput): Promise<TaskItem>;
  update(id: string, input: TaskUpdateInput): Promise<TaskItem | null>;
  remove(id: string): Promise<boolean>;
}

export class PostgresTaskRepository implements TaskRepository {
  private readonly pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async list(): Promise<TaskItem[]> {
    const result = await this.pool.query<TaskRow>(
      'SELECT id, title, description, project, priority, status, due_date, assignee, created_at, updated_at FROM tasks ORDER BY created_at DESC',
    );
    return result.rows.map(toTaskItem);
  }

  async create(input: TaskCreateInput): Promise<TaskItem> {
    const result = await this.pool.query<TaskRow>(
      `INSERT INTO tasks (id, title, description, project, priority, status, due_date, assignee)
       VALUES ($1, $2, $3, $4, $5, 'Todo', $6, 'Unassigned')
       RETURNING id, title, description, project, priority, status, due_date, assignee, created_at, updated_at`,
      [randomUUID(), input.title, input.description ?? '', input.projectId, input.priority ?? 'Medium', input.dueDate ?? null],
    );
    return toTaskItem(result.rows[0]);
  }

  async update(id: string, input: TaskUpdateInput): Promise<TaskItem | null> {
    const result = await this.pool.query<TaskRow>(
      `UPDATE tasks
       SET status = COALESCE($2, status), assignee = COALESCE($3, assignee), due_date = COALESCE($4, due_date),
           priority = COALESCE($5, priority), updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, title, description, project, priority, status, due_date, assignee, created_at, updated_at`,
      [id, input.status ?? null, input.assignee ?? null, input.dueDate ?? null, input.priority ?? null],
    );
    return result.rows[0] ? toTaskItem(result.rows[0]) : null;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  project: string;
  priority: TaskItem['priority'];
  status: TaskItem['status'];
  due_date: string | null;
  assignee: string | null;
  created_at: Date;
  updated_at: Date;
}

function toTaskItem(row: TaskRow): TaskItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    project: row.project,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date ?? undefined,
    assignee: row.assignee ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
