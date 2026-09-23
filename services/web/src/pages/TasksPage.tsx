import { useEffect, useState } from 'react';
import { Button, Card, makeStyles, tokens } from '@fluentui/react-components';
import { DocumentRegular, FolderRegular, TableRegular } from '@fluentui/react-icons';
import { api } from '../api';
import type { TaskItem } from '../api/types';

const useStyles = makeStyles({
  page: {
    minHeight: '100vh',
    background: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  shell: {
    maxWidth: '1320px',
    margin: '0 auto',
    padding: '0 24px 56px',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: 700,
  },
  mark: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  nav: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  navLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: tokens.colorNeutralForeground3,
    fontWeight: 600,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '260px minmax(0, 1fr)',
    gap: '24px',
    paddingTop: '24px',
  },
  sidebar: {
    background: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '16px',
    padding: '14px',
  },
  sideItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    color: tokens.colorNeutralForeground1,
    fontWeight: 600,
    marginBottom: '4px',
  },
  active: {
    background: 'rgba(37, 99, 235, 0.08)',
    color: tokens.colorBrandForeground1,
  },
  panel: {
    background: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '16px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
    padding: '16px',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
  },
  stateBar: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    marginBottom: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 8px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  td: {
    padding: '12px 8px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 700,
  },
});

function TasksPage() {
  const styles = useStyles();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.listTasks()
      .then((next) => {
        if (!active) return;
        setTasks(next);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Could not load tasks');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const renderStatus = (status: TaskItem['status']) => {
    const stylesMap: Record<TaskItem['status'], { background: string; color: string }> = {
      Todo: { background: 'rgba(37,99,235,0.08)', color: '#2563eb' },
      'In Progress': { background: 'rgba(20,184,166,0.12)', color: '#0f766e' },
      Review: { background: 'rgba(245,158,11,0.14)', color: '#b45309' },
      Done: { background: 'rgba(22,163,74,0.12)', color: '#15803d' },
    };
    const pill = stylesMap[status];
    return <span className={styles.pill} style={{ background: pill.background, color: pill.color }}>{status}</span>;
  };

  if (loading) {
    return <Card className={styles.panel}>Loading tasks…</Card>;
  }

  if (error) {
    return <Card className={styles.panel}>Error: {error}</Card>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}><div className={styles.mark}><TableRegular /></div><span>TodoNew</span></div>
          <nav className={styles.nav} aria-label="Main navigation">
            <span className={styles.navLink}><FolderRegular /> Overview</span>
            <span className={styles.navLink}><DocumentRegular /> Tasks</span>
          </nav>
          <Button appearance="primary">New item</Button>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label="Sidebar navigation">
            <div className={styles.sideItem}><FolderRegular /> Dashboard</div>
            <div className={styles.sideItem + ' ' + styles.active}><DocumentRegular /> Tasks</div>
          </aside>

          <main>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}><DocumentRegular /> Active tasks</div>
                <Button appearance="secondary">Filter</Button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Title</th>
                    <th className={styles.th}>Priority</th>
                    <th className={styles.th}>Owner</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr><td colSpan={4} className={styles.td}>No tasks available.</td></tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task.id}>
                        <td className={styles.td}>{task.title}</td>
                        <td className={styles.td}>{task.priority}</td>
                        <td className={styles.td}>{task.assignee ?? 'Unassigned'}</td>
                        <td className={styles.td}>{renderStatus(task.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
