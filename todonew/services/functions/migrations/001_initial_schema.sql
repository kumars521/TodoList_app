CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Team Lead', 'Operator', 'Viewer')),
  access TEXT NOT NULL CHECK (access IN ('Full access', 'Task access', 'Read-only'))
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  owner TEXT NOT NULL,
  due_date TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT NOT NULL CHECK (status IN ('planned', 'in-progress', 'review', 'done')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT tasks_owner_fk FOREIGN KEY (owner) REFERENCES users (name) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks (due_date);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks (priority);
