import { useMemo, useState } from 'react';
import { studySeed, type StudyState, type Course } from '../data/studySeed';
import styles from './SimUobPage.module.css';

const STORAGE_KEY = 'af-command-center:v1';

function isValidStudyState(data: unknown): data is StudyState {
  if (!data || typeof data !== 'object') return false;
  const parsed = data as StudyState;
  if (!parsed.programme || typeof parsed.programme.name !== 'string') return false;
  return Array.isArray(parsed.courses);
}

function loadState(): StudyState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studySeed));
    return studySeed;
  }
  try {
    const parsed = JSON.parse(raw);
    return isValidStudyState(parsed) ? parsed : studySeed;
  } catch {
    return studySeed;
  }
}

export function SimUobPage() {
  const [state, setState] = useState<StudyState>(() => loadState());
  const [filter, setFilter] = useState<Course['status'] | 'all'>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const persist = (next: StudyState): void => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const courses = useMemo(() => state.courses.filter((course) => filter === 'all' || course.status === filter), [state.courses, filter]);

  const toggle = (id: string): void => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className={styles.wrap}>
      <h1>SIM UoB Accounting & Finance</h1>
      <p className={styles.sub}>BSc (Hons) — Year 2 (25%) + Year 3 (75%)</p>
      <div className={styles.toolbar}>
        <select value={filter} onChange={(event) => setFilter(event.target.value as Course['status'] | 'all')}>
          <option value="all">all</option>
          <option value="not-started">not-started</option>
          <option value="previewing">previewing</option>
          <option value="studying">studying</option>
          <option value="done">done</option>
        </select>
      </div>
      <div className={styles.grid}>
        {courses.map((course) => (
          <article key={course.id} className={styles.card} role="button" tabIndex={0} onClick={() => toggle(course.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(course.id); } }}>
            <h3>{course.name}</h3>
            <p>{course.blurb}</p>
            <div className={styles.badges}><span>{course.status}</span><span>{course.examRelevance}</span><span>{course.confidence}/5</span></div>
            {expanded[course.id] ? (
              <div className={styles.expanded} onClick={(event) => event.stopPropagation()}>
                <textarea value={course.notes} onChange={(event) => persist({ ...state, courses: state.courses.map((item) => item.id === course.id ? { ...item, notes: event.target.value } : item) })} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
