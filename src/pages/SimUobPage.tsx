import { useRef, useState } from 'react';
import type { CourseStatus } from '../types';
import { useAppState } from '../context/useAppState';
import { CourseCard } from '../components/CourseCard';
import styles from './SimUobPage.module.css';

type FilterValue = 'all' | CourseStatus;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all',         label: 'All statuses' },
  { value: 'not-started', label: 'Not started'  },
  { value: 'previewing',  label: 'Previewing'   },
  { value: 'studying',    label: 'Studying'      },
  { value: 'done',        label: 'Done'          },
];

export function SimUobPage() {
  const { state, replaceState, resetToSeed } = useAppState();
  const [filter, setFilter] = useState<FilterValue>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = state.courses.filter(c => filter === 'all' || c.status === filter);
  const year2    = filtered.filter(c => c.year === 'Year 2');
  const year3    = filtered.filter(c => c.year === 'Year 3');

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `af-command-center-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!Array.isArray(data.courses)) throw new Error();
        if (window.confirm('This will replace all current data. Continue?')) replaceState(data);
      } catch {
        alert('Invalid JSON file — could not import.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleReset() {
    if (window.confirm('Reset all data to seed? This cannot be undone.')) resetToSeed();
  }

  const y2All = state.courses.filter(c => c.year === 'Year 2');
  const y3All = state.courses.filter(c => c.year === 'Year 3');

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>SIM UoB &mdash; A&amp;F Tracker</h1>
        <p className={styles.subtitle}>
          {state.programme.name} &mdash; {state.programme.structure}
        </p>
      </div>

      <div className={styles.toolbar}>
        <select
          className={styles.filterSelect}
          value={filter}
          onChange={e => setFilter(e.target.value as FilterValue)}
          aria-label="Filter by status"
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button type="button" className={styles.toolbarBtn} onClick={handleExport}>export json</button>
        <button type="button" className={styles.toolbarBtn} onClick={() => fileInputRef.current?.click()}>import json</button>
        <button type="button" className={styles.toolbarBtn} onClick={handleReset}>reset seed</button>
        <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      <section className={styles.yearSection}>
        <div className={styles.yearHeader}>
          <span className={styles.yearTitle}>Year 2</span>
          <span className={styles.yearMeta}>{y2All.filter(c => c.status === 'done').length}/{y2All.length} done</span>
          <span className={styles.yearHr} />
        </div>
        {year2.length > 0
          ? <div className={styles.grid}>{year2.map(c => <CourseCard key={c.id} course={c} />)}</div>
          : <p className={styles.empty}>No courses match this filter.</p>
        }
      </section>

      <section className={styles.yearSection}>
        <div className={styles.yearHeader}>
          <span className={styles.yearTitle}>Year 3</span>
          <span className={styles.yearMeta}>{y3All.filter(c => c.status === 'done').length}/{y3All.length} done</span>
          <span className={styles.yearHr} />
        </div>
        {year3.length > 0
          ? <div className={styles.grid}>{year3.map(c => <CourseCard key={c.id} course={c} />)}</div>
          : <p className={styles.empty}>No courses match this filter.</p>
        }
      </section>
    </div>
  );
}
