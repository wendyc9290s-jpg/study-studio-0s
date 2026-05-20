// FILE: src/pages/ResourcePage.tsx
import { useState } from 'react';
import type { LibraryResourceType, LibraryState } from '../types';
import { resourceSeed } from '../data/resourceSeed';
import { useLocalStorage } from '../lib/useLocalStorage';
import { cn } from '../lib/escape';
import styles from './ResourcePage.module.css';

const ALL_TYPES: LibraryResourceType[] = ['youtube', 'bilibili', 'pdf', 'web', 'excel', 'note'];
const TYPE_LABELS: Record<LibraryResourceType, string> = {
  youtube: 'YouTube',
  bilibili: 'Bilibili',
  pdf: 'PDF',
  web: 'Web',
  excel: 'Excel',
  note: 'Note',
};

export function ResourcePage() {
  const [libraryState, setLibraryState] = useLocalStorage<LibraryState>('af-cc:resources:v1', resourceSeed);
  const [typeFilter, setTypeFilter] = useState<LibraryResourceType | 'all'>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [hideCompleted, setHideCompleted] = useState(false);

  const allModules = Array.from(
    new Set(libraryState.resources.flatMap(r => r.modules)),
  ).sort();

  const filtered = libraryState.resources.filter(r => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (moduleFilter !== 'all' && !r.modules.includes(moduleFilter)) return false;
    if (hideCompleted && r.done) return false;
    return true;
  });

  function toggleDone(resourceId: string) {
    setLibraryState(prev => ({
      ...prev,
      resources: prev.resources.map(r =>
        r.id === resourceId ? { ...r, done: !r.done } : r,
      ),
    }));
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Resource Library</h1>
        <p className={styles.subtitle}>
          {filtered.length} resource{filtered.length !== 1 ? 's' : ''} shown
        </p>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <button
            type="button"
            className={cn(styles.filterPill, typeFilter === 'all' ? styles.filterPillActive : undefined)}
            onClick={() => setTypeFilter('all')}
          >
            All types
          </button>
          {ALL_TYPES.map(t => (
            <button
              key={t}
              type="button"
              className={cn(styles.filterPill, styles[`type-${t}` as keyof typeof styles], typeFilter === t ? styles.filterPillActive : undefined)}
              onClick={() => setTypeFilter(t)}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.moduleSelect}
            value={moduleFilter}
            onChange={e => setModuleFilter(e.currentTarget.value)}
          >
            <option value="all">All modules</option>
            {allModules.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={cn(styles.filterPill, hideCompleted ? styles.filterPillActive : undefined)}
          onClick={() => setHideCompleted(h => !h)}
        >
          Hide completed
        </button>
      </div>

      <div className={styles.grid}>
        {filtered.map(resource => (
          <div
            key={resource.id}
            className={cn(styles.card, resource.done ? styles.cardDone : undefined)}
          >
            <div className={styles.cardTop}>
              <span className={cn(styles.typeBadge, styles[`typeBadge-${resource.type}`])}>
                {TYPE_LABELS[resource.type]}
              </span>
              <button
                type="button"
                className={cn(styles.doneBtn, resource.done ? styles.doneBtnActive : undefined)}
                onClick={() => toggleDone(resource.id)}
              >
                {resource.done ? 'Mark undone' : 'Mark done'}
              </button>
            </div>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(styles.resourceTitle, resource.done ? styles.resourceTitleDone : undefined)}
            >
              {resource.title}
            </a>

            {resource.tags.length > 0 && (
              <div className={styles.tags}>
                {resource.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}

            {resource.modules.length > 0 && (
              <p className={styles.modules}>
                {resource.modules.join(', ')}
              </p>
            )}

            {resource.notes && (
              <p className={styles.notes}>{resource.notes}</p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          No resources match the current filters.
        </div>
      )}
    </div>
  );
}
