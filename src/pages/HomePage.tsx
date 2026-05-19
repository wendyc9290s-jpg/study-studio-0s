import { Link } from 'react-router-dom';
import { useAppState } from '../context/useAppState';
import { ProgressBar } from '../components/ProgressBar';
import styles from './HomePage.module.css';
import { cn } from '../lib/escape';
import type { CourseStatus } from '../types';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const STATUS_META: Record<CourseStatus, { label: string; colorClass: string }> = {
  'not-started': { label: 'Not started', colorClass: 'not-started' },
  'previewing':  { label: 'Previewing',  colorClass: 'previewing'  },
  'studying':    { label: 'Studying',    colorClass: 'studying'    },
  'done':        { label: 'Done',        colorClass: 'done'        },
};

export function HomePage() {
  const { state } = useAppState();
  const { courses, programme } = state;

  const year2 = courses.filter(c => c.year === 'Year 2');
  const year3 = courses.filter(c => c.year === 'Year 3');

  const totalTopics    = courses.reduce((n, c) => n + c.keyTopics.length, 0);
  const doneTopics     = courses.reduce((n, c) => n + c.keyTopics.filter(t => t.done).length, 0);
  const totalResources = courses.reduce((n, c) => n + c.resources.length, 0);
  const studyingCourses = courses.filter(c => c.status === 'studying');
  const doneCourses    = courses.filter(c => c.status === 'done');

  const y2Topics     = year2.reduce((n, c) => n + c.keyTopics.length, 0);
  const y2DoneTopics = year2.reduce((n, c) => n + c.keyTopics.filter(t => t.done).length, 0);
  const y2Resources  = year2.reduce((n, c) => n + c.resources.length, 0);
  const y2Done       = year2.filter(c => c.status === 'done').length;

  const y3Topics     = year3.reduce((n, c) => n + c.keyTopics.length, 0);
  const y3DoneTopics = year3.reduce((n, c) => n + c.keyTopics.filter(t => t.done).length, 0);
  const y3Resources  = year3.reduce((n, c) => n + c.resources.length, 0);
  const y3Done       = year3.filter(c => c.status === 'done').length;

  const statusCounts = (['not-started', 'previewing', 'studying', 'done'] as CourseStatus[]).map(
    s => ({ status: s, count: courses.filter(c => c.status === s).length }),
  );

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.greeting}>
          {getGreeting()},{' '}
          <span className={styles.greetingAccent}>Scholar.</span>
        </h1>
        <p className={styles.subline}>
          {programme.name} &mdash; {programme.partner}
        </p>
      </div>

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={cn(styles.statValue, styles.accent)}>{studyingCourses.length}</div>
          <div className={styles.statLabel}>Modules Active</div>
          <div className={styles.statSub}>currently studying</div>
        </div>
        <div className={styles.statCard}>
          <div className={cn(styles.statValue, styles.green)}>{doneTopics}</div>
          <div className={styles.statLabel}>Topics Mastered</div>
          <div className={styles.statSub}>of {totalTopics} total</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalResources}</div>
          <div className={styles.statLabel}>Resources Saved</div>
          <div className={styles.statSub}>across all modules</div>
        </div>
        <div className={styles.statCard}>
          <div className={cn(styles.statValue, styles.amber)}>{doneCourses.length}</div>
          <div className={styles.statLabel}>Modules Done</div>
          <div className={styles.statSub}>of {courses.length} total</div>
        </div>
      </div>

      {/* Continue studying */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Continue Studying</span>
        <span className={styles.sectionHr} />
      </div>

      {studyingCourses.length > 0 ? (
        <div className={styles.continueGrid}>
          {studyingCourses.map(course => {
            const done  = course.keyTopics.filter(t => t.done).length;
            const total = course.keyTopics.length;
            return (
              <Link key={course.id} to="/study/sim-uob" className={styles.continueCard}>
                <div className={styles.continueCardName}>{course.name}</div>
                <div className={styles.continueCardMeta}>
                  <span>{done}/{total} topics</span>
                  <span>confidence {'★'.repeat(course.confidence)}{'☆'.repeat(5 - course.confidence)}</span>
                </div>
                <ProgressBar value={done} max={total} color="accent" size="sm" />
              </Link>
            );
          })}
        </div>
      ) : (
        <p className={styles.emptyNote}>No modules actively being studied yet. Mark a module as &ldquo;Studying&rdquo; to see it here.</p>
      )}

      {/* Year progress */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Year Progress</span>
        <span className={styles.sectionHr} />
      </div>

      <div className={styles.yearProgressGrid}>
        <div className={styles.yearCard}>
          <div className={styles.yearCardTitle}>
            Year 2
            <span className={styles.yearCardBadge}>{y2Done}/{year2.length} modules &bull; {y2Resources} resources</span>
          </div>
          <div className={styles.yearProgressRows}>
            <ProgressBar value={y2DoneTopics} max={y2Topics} label="Topics completed" showValue color="accent" size="md" />
            <ProgressBar value={y2Done} max={year2.length} label="Modules done" showValue color="green" size="md" />
          </div>
        </div>
        <div className={styles.yearCard}>
          <div className={styles.yearCardTitle}>
            Year 3
            <span className={styles.yearCardBadge}>{y3Done}/{year3.length} modules &bull; {y3Resources} resources</span>
          </div>
          <div className={styles.yearProgressRows}>
            <ProgressBar value={y3DoneTopics} max={y3Topics} label="Topics completed" showValue color="accent" size="md" />
            <ProgressBar value={y3Done} max={year3.length} label="Modules done" showValue color="green" size="md" />
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Status Overview</span>
        <span className={styles.sectionHr} />
      </div>
      <div className={styles.statusRow}>
        {statusCounts.map(({ status, count }) => (
          <div key={status} className={styles.statusPill}>
            <span className={cn(styles.statusDot, styles[status])} />
            <span className={styles.statusCount}>{count}</span>
            <span>{STATUS_META[status].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
