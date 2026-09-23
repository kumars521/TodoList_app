import {
  Button,
  Input,
  Select,
  Option,
  Text,
  Title1,
  Title2,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { CheckmarkCircleRegular, DeleteRegular } from '@fluentui/react-icons';
import { useEffect, useMemo, useState } from 'react';
import { api, type Task, type User, type Role, type Priority } from './api';
import './App.css';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
  },
  sidebar: {
    width: '240px',
    background: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: 700,
    fontSize: '18px',
  },
  brandMark: {
    width: '32px',
    height: '32px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '10px',
    background: `linear-gradient(135deg, ${tokens.colorBrandForeground1}, ${tokens.colorPaletteTealForeground2})`,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    justifyContent: 'flex-start',
    borderRadius: '8px',
    padding: '10px 12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
  },
  activeNav: {
    justifyContent: 'flex-start',
    borderRadius: '8px',
    padding: '10px 12px',
    fontWeight: 600,
    background: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  main: {
    flex: 1,
    padding: '20px',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  statCard: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '16px',
    background: tokens.colorNeutralBackground1,
    padding: '16px',
    boxShadow: tokens.shadow4,
  },
  panel: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '16px',
    background: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    padding: '16px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tableWrap: {
    overflow: 'hidden',
    borderRadius: '12px',
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  userCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  userMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontWeight: 700,
  },
  formGrid: {
    display: 'grid',
    gap: '12px',
    paddingTop: '12px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: tokens.colorNeutralForeground3,
    padding: '8px 0 12px',
  },
  errorBanner: {
    background: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '12px',
  },
});

function App() {
  const styles = useStyles();
  const [page, setPage] = useState<'dashboard' | 'tasks' | 'users'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: Role } | null>(null);

  useEffect(() => {
    api.getCurrentUser().then((user) => setCurrentUser(user)).catch(() => setError('Unable to load the current user.'));
    api.listTasks().then((result) => setTasks(result.tasks)).catch(() => setError('Unable to load tasks.'));
    api.listUsers().then((result) => setUsers(result.users)).catch(() => setError('Unable to load users.'));
  }, []);

  const filteredTasks = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase())), [tasks, search]);

  const onToggleTask = async (id: string) => {
    const current = tasks.find((task) => task.id === id);
    if (!current) return;

    try {
      setLoading(true);
      const updated = await api.updateTask(id, { completed: !current.completed, priority: current.priority, owner: current.owner });
      setTasks((previous) => previous.map((task) => (task.id === id ? updated.task : task)));
      setError(null);
    } catch {
      setError('Unable to update this task right now.');
    } finally {
      setLoading(false);
    }
  };

  const onDeleteTask = async (id: string) => {
    try {
      setLoading(true);
      await api.deleteTask(id);
      setTasks((previous) => previous.filter((task) => task.id !== id));
      setError(null);
    } catch {
      setError('This task could not be deleted.');
    } finally {
      setLoading(false);
    }
  };

  const onCreateTask = async () => {
    try {
      setLoading(true);
      const result = await api.createTask({ title: 'Design review', owner: currentUser?.name ?? 'Jess', dueDate: 'Thu', priority: 'High' });
      setTasks((previous) => [result.task, ...previous]);
      setError(null);
    } catch {
      setError('Unable to create a task right now.');
    } finally {
      setLoading(false);
    }
  };

  const onRoleChange = async (id: string, role: Role) => {
    try {
      const updated = await api.updateUserRole(id, role);
      setUsers((previous) => previous.map((user) => (user.id === id ? updated.user : user)));
      setError(null);
    } catch {
      setError('Could not update access for that user.');
    }
  };

  const renderPriority = (priority: Priority) => {
    const variants: Record<Priority, { background: string; color: string; label: string }> = {
      High: { background: 'rgba(220, 38, 38, 0.12)', color: '#dc2626', label: 'High' },
      Medium: { background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', label: 'Medium' },
      Low: { background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a', label: 'Low' },
    };
    const variant = variants[priority];
    return <span className={styles.badge} style={{ background: variant.background, color: variant.color }}>{variant.label}</span>;
  };

  const renderStatus = (value: Task['status']) => {
    const variants: Record<Task['status'], { background: string; color: string; label: string }> = {
      planned: { background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a', label: 'Planned' },
      'in-progress': { background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', label: 'In progress' },
      review: { background: 'rgba(47, 111, 237, 0.12)', color: '#2F6FED', label: 'Review' },
      done: { background: 'rgba(47, 111, 237, 0.12)', color: '#2F6FED', label: 'Done' },
    };
    const variant = variants[value];
    return <span className={styles.badge} style={{ background: variant.background, color: variant.color }}>{variant.label}</span>;
  };

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}><CheckmarkCircleRegular /></div>
          <span>TaskFlow</span>
        </div>

        <nav className={styles.nav}>
          <Button appearance={page === 'dashboard' ? 'primary' : 'secondary'} className={page === 'dashboard' ? styles.activeNav : styles.navItem} onClick={() => setPage('dashboard')}>Dashboard</Button>
          <Button appearance={page === 'tasks' ? 'primary' : 'secondary'} className={page === 'tasks' ? styles.activeNav : styles.navItem} onClick={() => setPage('tasks')}>Tasks</Button>
          <Button appearance={page === 'users' ? 'primary' : 'secondary'} className={page === 'users' ? styles.activeNav : styles.navItem} onClick={() => setPage('users')}>User Access</Button>
        </nav>
      </aside>

      <main className={styles.main}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        {page === 'dashboard' && (
          <>
            <header className={styles.topbar}>
              <div>
                <Text className={styles.muted}>Overview</Text>
                <Title1>Dashboard</Title1>
              </div>
              <div className={styles.actionRow}>
                <Button appearance="secondary">Filter</Button>
                <Button appearance="primary" onClick={onCreateTask}>Create task</Button>
              </div>
            </header>

            <section className={styles.kpiGrid}>
              {[
                { label: 'Due today', value: '7', meta: '3 priority items' },
                { label: 'This month', value: '29', meta: '+4 from last month' },
                { label: 'Completed', value: '18', meta: '72% completion' },
                { label: 'At risk', value: '3', meta: '2 need review' },
              ].map((card) => (
                <div className={styles.statCard} key={card.label}>
                  <Text className={styles.muted}>{card.label}</Text>
                  <Title2>{card.value}</Title2>
                  <Text className={styles.muted}>{card.meta}</Text>
                </div>
              ))}
            </section>

            <section className={styles.panel}>
              <div className={styles.toolbar}>
                <Title2>Priority queue</Title2>
                <div className={styles.filterRow}>
                  <span className={styles.badge} style={{ background: 'rgba(220,38,38,0.12)', color: '#dc2626' }}>High</span>
                  <span className={styles.badge} style={{ background: 'rgba(217,119,6,0.12)', color: '#d97706' }}>Medium</span>
                  <span className={styles.badge} style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a' }}>Low</span>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Task</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Owner</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Due</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Priority</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 3).map((task) => (
                      <tr key={task.id}>
                        <td style={{ padding: '12px 16px' }}>{task.title}</td>
                        <td style={{ padding: '12px 16px' }}>{task.owner}</td>
                        <td style={{ padding: '12px 16px' }}>{task.dueDate}</td>
                        <td style={{ padding: '12px 16px' }}>{renderPriority(task.priority)}</td>
                        <td style={{ padding: '12px 16px' }}>{renderStatus(task.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {page === 'tasks' && (
          <>
            <header className={styles.topbar}>
              <div>
                <Text className={styles.muted}>Task list</Text>
                <Title1>Tasks</Title1>
              </div>
              <div className={styles.actionRow}>
                <Button appearance="secondary">Sort</Button>
                <Button appearance="primary" onClick={onCreateTask}>Create task</Button>
              </div>
            </header>

            <section className={styles.panel}>
              <div className={styles.toolbar}>
                <div className={styles.filterRow}>
                  <Button appearance="secondary">All</Button>
                  <Button appearance="secondary">Due today</Button>
                  <Button appearance="secondary">At risk</Button>
                </div>
                <Input aria-label="Search tasks" value={search} onChange={(_, data) => setSearch(data.value)} placeholder="Search tasks" />
              </div>

              {loading && <div className={styles.loading}><span>Loading...</span></div>}

              <div className={styles.tableWrap}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Task</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Owner</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Due date</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Priority</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748B' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr key={task.id}>
                        <td style={{ padding: '12px 16px' }}>{task.title}</td>
                        <td style={{ padding: '12px 16px' }}>{task.owner}</td>
                        <td style={{ padding: '12px 16px' }}>{task.dueDate}</td>
                        <td style={{ padding: '12px 16px' }}>{renderPriority(task.priority)}</td>
                        <td style={{ padding: '12px 16px' }}>{renderStatus(task.status)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div className={styles.actionRow}>
                            <Button appearance="secondary" onClick={() => onToggleTask(task.id)}>{task.completed ? 'Reopen' : 'Done'}</Button>
                            <Button appearance="secondary" icon={<DeleteRegular />} onClick={() => onDeleteTask(task.id)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {page === 'users' && (
          <>
            <header className={styles.topbar}>
              <div>
                <Text className={styles.muted}>Team roles</Text>
                <Title1>User Access</Title1>
              </div>
              <div className={styles.actionRow}>
                <Button appearance="primary">Add user</Button>
              </div>
            </header>

            <section className={styles.panel} style={{ marginBottom: '20px' }}>
              <div className={styles.toolbar}>
                <Title2>Members</Title2>
                <div className={styles.filterRow}>
                  <Button appearance="secondary">Admins</Button>
                  <Button appearance="secondary">Team Leads</Button>
                </div>
              </div>

              {users.map((user) => (
                <div key={user.id} className={styles.userCard}>
                  <div className={styles.userMeta}>
                    <div className={styles.avatar}>{user.name.split(' ').map((name) => name[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{user.name}</div>
                      <div className={styles.muted}>{user.role}</div>
                    </div>
                  </div>
                  <span className={styles.badge} style={{ background: user.access === 'Full access' ? 'rgba(47,111,237,0.12)' : user.access === 'Task access' ? 'rgba(22,163,74,0.12)' : 'rgba(217,119,6,0.12)', color: user.access === 'Full access' ? '#2F6FED' : user.access === 'Task access' ? '#16a34a' : '#d97706' }}>{user.access}</span>
                </div>
              ))}
            </section>

            <section className={styles.panel}>
              <div className={styles.toolbar}>
                <Title2>Role settings</Title2>
              </div>
              <div className={styles.formGrid}>
                <div>
                  <Text block>Role</Text>
                  <Select defaultValue="Team Lead" onChange={(_, data) => { const selected = data.value as Role; if (users[0]) onRoleChange(users[0].id, selected); }}>
                    <Option value="Team Lead">Team Lead</Option>
                    <Option value="Operator">Operator</Option>
                    <Option value="Viewer">Viewer</Option>
                  </Select>
                </div>
                <div>
                  <Text block>Access level</Text>
                  <Select defaultValue="Full access">
                    <Option value="Full access">Full access</Option>
                    <Option value="Task access">Task access</Option>
                    <Option value="Read-only">Read-only</Option>
                  </Select>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
