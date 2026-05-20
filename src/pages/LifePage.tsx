import { useState, useRef, KeyboardEvent } from 'react';
import type { LifeArea, LifeEntry, LifeState } from '../lib/life';
import { createEntry } from '../lib/life';
import { useLocalStorage } from '../lib/useLocalStorage';
import styles from './LifePage.module.css';

const AREA_CONFIG: Record<LifeArea, { label: string; icon: string; placeholder: string }> = {
  mind:  { label: "What's on your mind?", icon: '◌', placeholder: 'A stray thought, a worry, something to figure out…' },
  dream: { label: 'Dream List',           icon: '◇', placeholder: 'Something you want to do, become, or experience…' },
  joy:   { label: 'Joy Box',              icon: '◎', placeholder: 'Something that made you smile, feel alive, or grateful…' },
};

const AREAS: LifeArea[] = ['mind', 'dream', 'joy'];

function EntryCard({
  entry,
  onToggleFavorite,
  onToggleDone,
  onDelete,
}: {
  entry: LifeEntry;
  onToggleFavorite: () => void;
  onToggleDone: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={styles.entryCard}
      data-status={entry.status}
      data-energy={entry.energy}
    >
      <p className={styles.entryText}>{entry.rawText}</p>
      {entry.gentleSuggestion && (
        <p className={styles.entrySuggestion}>{entry.gentleSuggestion}</p>
      )}
      <div className={styles.entryFooter}>
        <span className={styles.entryTime}>
          {new Date(entry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
        <div className={styles.entryActions}>
          <button
            type="button"
            className={styles.actionBtn}
            data-active={entry.favorite ? 'true' : undefined}
            onClick={onToggleFavorite}
            aria-label="Favourite"
          >♡</button>
          <button
            type="button"
            className={styles.actionBtn}
            data-active={entry.status === 'done' ? 'true' : undefined}
            onClick={onToggleDone}
            aria-label="Mark done"
          >✓</button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={onDelete}
            aria-label="Delete"
          >×</button>
        </div>
      </div>
    </div>
  );
}

function AreaColumn({
  area,
  entries,
  onAdd,
  onToggleFavorite,
  onToggleDone,
  onDelete,
}: {
  area: LifeArea;
  entries: LifeEntry[];
  onAdd: (text: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cfg = AREA_CONFIG[area];

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
    textareaRef.current?.focus();
  }

  const visible = entries.filter(e => !e.archived).sort((a, b) => {
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className={styles.column} data-area={area}>
      <div className={styles.columnHeader}>
        <span className={styles.columnIcon} aria-hidden>{cfg.icon}</span>
        <h2 className={styles.columnTitle}>{cfg.label}</h2>
        {visible.length > 0 && (
          <span className={styles.columnCount}>{visible.length}</span>
        )}
      </div>

      <div className={styles.inputCard}>
        <textarea
          ref={textareaRef}
          className={styles.inputArea}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={cfg.placeholder}
          rows={3}
        />
        <div className={styles.inputFooter}>
          <span className={styles.inputHint}>⌘ Enter to add</span>
          <button
            type="button"
            className={styles.addBtn}
            onClick={submit}
            disabled={!text.trim()}
          >Add</button>
        </div>
      </div>

      <div className={styles.entries}>
        {visible.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onToggleFavorite={() => onToggleFavorite(entry.id)}
            onToggleDone={() => onToggleDone(entry.id)}
            onDelete={() => onDelete(entry.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function LifePage() {
  const [state, setState] = useLocalStorage<LifeState>('af-command-center:life:v1', { entries: [] });

  function addEntry(area: LifeArea, text: string) {
    const entry = createEntry(text);
    entry.area = area;
    setState(prev => ({ entries: [entry, ...prev.entries] }));
  }

  function toggleFavorite(id: string) {
    setState(prev => ({
      entries: prev.entries.map(e => e.id === id ? { ...e, favorite: !e.favorite, updatedAt: new Date().toISOString() } : e),
    }));
  }

  function toggleDone(id: string) {
    setState(prev => ({
      entries: prev.entries.map(e =>
        e.id === id
          ? { ...e, status: e.status === 'done' ? 'inbox' : 'done', updatedAt: new Date().toISOString() }
          : e,
      ),
    }));
  }

  function deleteEntry(id: string) {
    setState(prev => ({ entries: prev.entries.filter(e => e.id !== id) }));
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Life</h1>
        <p className={styles.pageSubtitle}>Capture everything — thoughts, dreams, little joys. No judgement.</p>
      </div>

      <div className={styles.grid}>
        {AREAS.map(area => (
          <AreaColumn
            key={area}
            area={area}
            entries={state.entries.filter(e => e.area === area)}
            onAdd={text => addEntry(area, text)}
            onToggleFavorite={toggleFavorite}
            onToggleDone={toggleDone}
            onDelete={deleteEntry}
          />
        ))}
      </div>
    </div>
  );
}
