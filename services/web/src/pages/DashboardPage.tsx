import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  makeStyles,
  Text,
  Title1,
  tokens,
} from '@fluentui/react-components';
import {
  ArrowRightRegular,
  CalendarRegular,
  CheckmarkCircleRegular,
  DataTrendingRegular,
  DocumentRegular,
  FolderRegular,
  SearchRegular,
  TableRegular,
} from '@fluentui/react-icons';
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
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(8px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
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
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
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
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
    height: 'fit-content',
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
  sideItemActive: {
    background: 'rgba(37, 99, 235, 0.08)',
    color: tokens.colorBrandForeground1,
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  hero: {
    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(20, 184, 166, 0.08))',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
  },
  heroTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  eyebrow: {
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: tokens.colorNeutralForeground3,
    fontWeight: 700,
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '16px',
  },
  metricCard: {
    background: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '16px',
    padding: '18px 16px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
  },
  metricLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    marginBottom: '8px',
  },
  metricValue: {
    fontSize: '26px',
    fontWeight: 800,
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

function DashboardPage() {
  const styles = useStyles();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api.listTasks()
      .then((response) => {
        if (!active) return;
        setTasks(response);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Could not load tasks');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const done = tasks.filter((task) => task.status === 'Done').length;
    const review = tasks.filter((task) => task.status === 'Review').length;
    const active = tasks.filter((task) => task.status === 'In Progress').length;
    return {
      due: tasks.length,
      done,
      review,
      completion: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
      active,
    };
  }, [tasks]);

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
    return (
      <div className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.topbar}>
            <div className={styles.brand}><div className={styles.mark}>T</div><span>TodoNew</span></div>
            <div className={styles.nav}><Button appearance="primary">Create task</Button></div>
          </div>
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <div className={styles.sideItem + ' ' + styles.sideItemActive}><FolderRegular /> Dashboard</div>
            </aside>
            <main className={styles.mainColumn}><Card>Loading tasks…</Card></main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.topbar}>
            <div className={styles.brand}><div className={styles.mark}>T</div><span>TodoNew</span></div>
            <div className={styles.nav}><Button appearance="primary">Create task</Button></div>
          </div>
          <Card className={styles.panel}><Text>Error loading dashboard: {error}</Text><Button onClick={() => window.location.reload()}>Retry</Button></Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.mark} aria-hidden="true"><TableRegular /></div>
            <span>TodoNew</span>
          </div>
          <nav className={styles.nav} aria-label="Main navigation">
            <span className={styles.navLink}><SearchRegular /> Overview</span>
            <span className={styles.navLink}><DocumentRegular /> Tasks</span>
            <span className={styles.navLink}><CalendarRegular /> Details</span>
          </nav>
          <div>
            <Button appearance="primary">Create task</Button>
          </div>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label="Sidebar navigation">
            <div className={styles.sideItem + ' ' + styles.sideItemActive}><FolderRegular /> Dashboard</div>
            <div className={styles.sideItem}><DocumentRegular /> Projects</div>
            <div className={styles.sideItem}><CalendarRegular /> Calendar</div>
          </aside>

          <main className={styles.mainColumn}>
            <section className={styles.hero}>
              <div className={styles.heroTop}>
                <div>
                  <div className={styles.eyebrow}>Today</div>
                  <Title1>Focus on the next right move</Title1>
                </div>
                <Button appearance="secondary">Review plan</Button>
              </div>
            </section>

            <section className={styles.metrics} aria-label="Key metrics">
              <div className={styles.metricCard}>
                <div className={styles.metricLabel}><CheckmarkCircleRegular /> Tasks due</div>
                <div className={styles.metricValue}>{metrics.due}</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricLabel}><CheckmarkCircleRegular /> Done</div>
                <div className={styles.metricValue}>{metrics.done}</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricLabel}><DataTrendingRegular /> In review</div>
                <div className={styles.metricValue}>{metrics.review}</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricLabel}><ArrowRightRegular /> Completion</div>
                <div className={styles.metricValue}>{metrics.completion}%</div>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}><DocumentRegular /> Tasks</div>
                <Button appearance="secondary">View all</Button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Task</th>
                    <th className={styles.th}>Project</th>
                    <th className={styles.th}>Due</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr><td colSpan={4} className={styles.td}>No tasks available.</td></tr>
                  ) : (
                    tasks.slice(0, 4).map((task) => (
                      <tr key={task.id}>
                        <td className={styles.td}>{task.title}</td>
                        <td className={styles.td}>{task.project}</td>
                        <td className={styles.td}>{task.dueDate ?? '—'}</td>
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

export default DashboardPage;
