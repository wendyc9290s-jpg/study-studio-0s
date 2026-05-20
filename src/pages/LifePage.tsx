import { useMemo, useState } from 'react';
import { classifyLifeEntry, type LifeArea, type LifeEntry, type LifeType } from '../lib/life';
import styles from './LifePage.module.css';

const STORAGE_KEY = 'af-command-center:life:v1';

const areaLabels: Record<LifeArea, string> = {
  mind: "What's on your mind?",
  dream: 'Dream List',
  joy: 'Joy Box',
};

function loadEntries(): LifeEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as LifeEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: LifeEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function LifePage() {
  const [entries, setEntries] = useState<LifeEntry[]>(() => loadEntries());
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const updateEntries = (next: LifeEntry[]) => {
    setEntries(next);
    saveEntries(next);
  };

  const addEntry = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const base = classifyLifeEntry(trimmed);
    const now = new Date().toISOString();
    const entry: LifeEntry = {
      id: `life-${Date.now()}`,
      ...base,
      favorite: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    updateEntries([entry, ...entries]);
    setInput('');
  };

  const filtered = useMemo(() => entries.filter((entry) => !entry.archived && `${entry.title} ${entry.rawText}`.toLowerCase().includes(query.toLowerCase())), [entries, query]);

  const updateEntry = (id: string, patch: Partial<LifeEntry>) => {
    updateEntries(entries.map((entry) => (entry.id === id ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry)));
  };

  const areas: LifeArea[] = ['mind', 'dream', 'joy'];
  const typeOptions: LifeType[] = ['want_to_learn', 'creator_idea', 'money_idea', 'dream', 'joy', 'random_thought'];

  return (
    <div className={styles.wrap}>
      <div className={styles.inputCard}>
        <h1>Life</h1>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="What's on your mind?"
        />
        <div className={styles.actions}>
          <button onClick={addEntry}>Add</button>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
        </div>
      </div>

      {areas.map((area) => (
        <section key={area} className={styles.section}>
          <h2>{areaLabels[area]}</h2>
          <div className={styles.grid}>
            {filtered.filter((entry) => entry.area === area).map((entry) => (
              <article key={entry.id} className={styles.card}>
                <header>
                  <strong>{entry.title}</strong>
                </header>
                <p>{entry.rawText}</p>
                <div className={styles.badges}>
                  <span>{entry.area}</span>
                  <span>{entry.type}</span>
                  <span>energy: {entry.energy}</span>
                  <span>status: {entry.status}</span>
                </div>
                {entry.gentleSuggestion ? <p className={styles.suggest}>{entry.gentleSuggestion}</p> : null}
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
                <div className={styles.controls}>
                  <button onClick={() => updateEntry(entry.id, { favorite: !entry.favorite })}>{entry.favorite ? 'Unfavorite' : 'Favorite'}</button>
                  <button onClick={() => updateEntry(entry.id, { archived: true })}>Archive</button>
                  <button onClick={() => updateEntry(entry.id, { status: 'done' })}>Mark done</button>
                  <button onClick={() => updateEntries(entries.filter((item) => item.id !== entry.id))}>Delete</button>
                </div>
                <div className={styles.editRow}>
                  <select value={entry.area} onChange={(event) => updateEntry(entry.id, { area: event.target.value as LifeArea })}>
                    <option value="mind">mind</option>
                    <option value="dream">dream</option>
                    <option value="joy">joy</option>
                  </select>
                  <select value={entry.type} onChange={(event) => updateEntry(entry.id, { type: event.target.value as LifeType })}>
                    {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
