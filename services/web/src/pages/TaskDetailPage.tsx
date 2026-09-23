import { useEffect, useState } from 'react';
import { Button, Card, makeStyles, tokens } from '@fluentui/react-components';
import { CalendarRegular, DocumentRegular, FolderRegular } from '@fluentui/react-icons';
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
  panel: {
    background: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '16px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
    padding: '16px',
    marginTop: '24px',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '16px',
    marginTop: '16px',
  },
  metaCard: {
    background: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: '12px',
    padding: '12px',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 700,
    background: 'rgba(20,184,166,0.12)',
    color: '#0f766e',
  },
});

function TaskDetailPage() {
  const styles = useStyles();
  const [task, setTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.getTask('task-1')
      .then((next) => {
        if (!active) return;
        setTask(next);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Could not load task');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Card className={styles.panel}>Loading task details…</Card>;
  }

  if (error) {
    return <Card className={styles.panel}>Error: {error}</Card>;
  }

  if (!task) {
    return <Card className={styles.panel}>Task not found.</Card>;
  }

  const current = task;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}><div className={styles.mark}>T</div><span>TodoNew</span></div>
          <nav className={styles.nav} aria-label="Main navigation">
            <span className={styles.navLink}><FolderRegular /> Overview</span>
            <span className={styles.navLink}><DocumentRegular /> Tasks</span>
            <span className={styles.navLink}><CalendarRegular /> Details</span>
          </nav>
          <Button appearance="primary">Save changes</Button>
        </header>

        <section className={styles.panel}>
          <div className={styles.titleRow}>
            <div style={{ fontWeight: 700 }}>{current.title}</div>
            <span className={styles.pill}>{current.status}</span>
          </div>

          <div className={styles.content}>
            <div>
              <p>{current.description}</p>
              <div className={styles.metaCard} style={{ marginTop: '16px' }}>
                <div className={styles.metaRow}><span>Assignee</span><strong>{current.assignee ?? 'Unassigned'}</strong></div>
                <div className={styles.metaRow}><span>Due</span><strong>{current.dueDate ?? '—'}</strong></div>
                <div className={styles.metaRow}><span>Project</span><strong>{current.project}</strong></div>
                <div className={styles.metaRow}><span>Priority</span><strong>{current.priority}</strong></div>
              </div>
            </div>

            <div className={styles.metaCard}>
              <div style={{ fontWeight: 700, marginBottom: '12px' }}>Attachments</div>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: '10px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(37,99,235,0.04)', color: tokens.colorNeutralForeground3 }}>Document</div>
                <div style={{ border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: '10px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,184,166,0.04)', color: tokens.colorNeutralForeground3 }}>Board</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TaskDetailPage;
