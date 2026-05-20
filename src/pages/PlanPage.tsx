// FILE: src/pages/PlanPage.tsx
import { planSeed } from '../data/planSeed';
import { useLocalStorage } from '../lib/useLocalStorage';
import { ProgressBar } from '../components/ProgressBar';
import { cn } from '../lib/escape';
import type { PlanState } from '../types';
import styles from './PlanPage.module.css';

const PHASE_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Phase 1 — Accounting Foundation',
  2: 'Phase 2 — Finance + Excel Skills',
  3: 'Phase 3 — Audit & Tax Preview',
  4: 'Phase 4 — Revision & Project Preparation',
};

const PHASES = [1, 2, 3, 4] as const;

export function PlanPage() {
  const [planState, setPlanState] = useLocalStorage<PlanState>('af-cc:plan:v1', planSeed);

  function toggleTask(weekId: string, taskId: string) {
    setPlanState(prev => ({
      ...prev,
      weeks: prev.weeks.map(w => {
        if (w.id !== weekId) return w;
        return {
          ...w,
          tasks: w.tasks.map(t => (t.id === taskId ? { ...t, done: !t.done } : t)),
        };
      }),
    }));
  }

  const phaseStats = PHASES.map(phase => {
    const weeks = planState.weeks.filter(w => w.phase === phase);
    const total = weeks.reduce((acc, w) => acc + w.tasks.length, 0);
    const done = weeks.reduce((acc, w) => acc + w.tasks.filter(t => t.done).length, 0);
    return { phase, total, done };
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>4-Month Study Plan</h1>
        <p className={styles.subtitle}>16-week phased programme</p>
      </div>

      <div className={styles.phasePills}>
        {phaseStats.map(({ phase, total, done }) => (
          <div key={phase} className={styles.phasePill} data-phase={phase}>
            <span className={styles.phasePillLabel}>Phase {phase}</span>
            <span className={styles.phasePillCount}>{done}/{total}</span>
            <div className={styles.phasePillTrack}>
              <div
                className={styles.phasePillFill}
                style={{ width: `${total === 0 ? 0 : Math.round((done / total) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {PHASES.map(phase => {
        const phaseWeeks = planState.weeks.filter(w => w.phase === phase);
        if (phaseWeeks.length === 0) return null;

        return (
          <div key={phase} className={styles.phaseSection}>
            <div className={styles.phaseHeader} data-phase={phase}>
              <h2 className={styles.phaseTitle}>{PHASE_LABELS[phase]}</h2>
            </div>

            <div className={styles.weekList}>
              {phaseWeeks.map(week => {
                const tasksDone = week.tasks.filter(t => t.done).length;
                const tasksTotal = week.tasks.length;

                return (
                  <div key={week.id} className={styles.weekCard}>
                    <div className={styles.weekCardHeader}>
                      <span className={styles.weekBadge}>Week {week.weekNumber}</span>
                      <h3 className={styles.weekTitle}>{week.title}</h3>
                      <span className={styles.phaseTag}>Phase {week.phase}</span>
                    </div>

                    <div className={styles.weekProgress}>
                      <ProgressBar
                        value={tasksDone}
                        max={tasksTotal}
                        color={tasksDone === tasksTotal && tasksTotal > 0 ? 'green' : 'accent'}
                        size="sm"
                        showValue
                      />
                    </div>

                    {week.goals.length > 0 && (
                      <div className={styles.goalsList}>
                        <p className={styles.goalsLabel}>Goals</p>
                        <ul className={styles.goals}>
                          {week.goals.map((goal, idx) => (
                            <li key={idx} className={styles.goal}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className={styles.taskList}>
                      {week.tasks.map(task => (
                        <label key={task.id} className={styles.taskRow}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={task.done}
                            onChange={() => toggleTask(week.id, task.id)}
                          />
                          <span className={cn(styles.taskText, task.done ? styles.taskDone : undefined)}>
                            {task.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
