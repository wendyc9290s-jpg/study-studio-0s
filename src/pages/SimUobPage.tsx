import { useRef, useState } from 'react';
import type { CourseStatus } from '../types';
import { useAppState } from '../context/AppStateContext';
import { CourseCard } from '../components/CourseCard';
import styles from './SimUobPage.module.css';

type FilterValue = 'all' | CourseStatus;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'not-started', label: 'Not started' },
  { value: 'previewing', label: 'Previewing' },
  { value: 'studying', label: 'Studying' },
  { value: 'done', label: 'Done' },
];

export function SimUobPage() {
  const { state, replaceState, resetToSeed } = useAppState();
  const [filter, setFilter] = useState<FilterValue>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = state.courses.filter(
    c => filter === 'all' || c.status === filter,
  );
  const year2 = filtered.filter(c => c.year === 'Year 2');
  const year3 = filtered.filter(c => c.year === 'Year 3');

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `af-command-center-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!Array.isArray(data.courses)) throw new Error('Invalid format');
        if (window.confirm('This will replace all current data. Continue?')) {
          replaceState(data);
        }
      } catch {
        alert('Invalid JSON file — could not import.');
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = '';
  }

  function handleReset() {
    if (window.confirm('Reset all data to seed? This cannot be undone.')) {
      resetToSeed();
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>SIM UoB Accounting &amp; Finance</h1>
      <p className={styles.subtitle}>
        {state.programme.name} — {state.programme.structure}
      </p>

      <div className={styles.toolbar}>
        <select
          className={styles.filterSelect}
          value={filter}
          onChange={e => setFilter(e.target.value as FilterValue)}
          aria-label="Filter by status"
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button type="button" className={styles.toolbarBtn} onClick={handleExport}>
          Export JSON
        </button>
        <button type="button" className={styles.toolbarBtn} onClick={handleImportClick}>
          Import JSON
        </button>
        <button type="button" className={styles.toolbarBtn} onClick={handleReset}>
          Reset to seed
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <section className={styles.yearSection}>
        <h2 className={styles.yearHeading}>Year 2</h2>
        {year2.length > 0 ? (
          <div className={styles.grid}>
            {year2.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No courses match the current filter.</p>
        )}
      </section>

      <section className={styles.yearSection}>
        <h2 className={styles.yearHeading}>Year 3</h2>
        {year3.length > 0 ? (
          <div className={styles.grid}>
            {year3.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No courses match the current filter.</p>
        )}
      </section>
    </div>
  );
}
