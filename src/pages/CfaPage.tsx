// FILE: src/pages/CfaPage.tsx
import { useState } from 'react';
import type { CfaLevel, CfaState, CourseStatus } from '../types';
import { cfaSeed } from '../data/cfaSeed';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { StarRating } from '../components/StarRating';
import { cn } from '../lib/escape';
import styles from './CfaPage.module.css';

const LEVELS: CfaLevel[] = ['I', 'II', 'III'];
const LEVEL_LABELS: Record<CfaLevel, string> = { I: 'Level I', II: 'Level II', III: 'Level III' };

const STATUS_ORDER: CourseStatus[] = ['not-started', 'previewing', 'studying', 'done'];
const STATUS_LABELS: Record<CourseStatus, string> = {
  'not-started': 'Not Started',
  previewing: 'Previewing',
  studying: 'Studying',
  done: 'Done',
};

function statusVariant(s: CourseStatus): string {
  return s === 'not-started' ? 'notStarted' : s;
}

export function CfaPage() {
  const [cfaState, setCfaState] = useLocalStorage<CfaState>('af-cc:cfa:v1', cfaSeed);
  const [activeLevel, setActiveLevel] = useState<CfaLevel>('I');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const levelTopics = cfaState.topics.filter(t => t.level === activeLevel);

  const totalItems = levelTopics.reduce((acc, t) => acc + t.items.length, 0);
  const doneItems = levelTopics.reduce((acc, t) => acc + t.items.filter(i => i.done).length, 0);
  const avgConfidence =
    levelTopics.length === 0
      ? 0
      : Math.round(levelTopics.reduce((acc, t) => acc + t.confidence, 0) / levelTopics.length);

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateConfidence(topicId: string, val: 0 | 1 | 2 | 3 | 4 | 5) {
    setCfaState(prev => ({
      ...prev,
      topics: prev.topics.map(t => (t.id === topicId ? { ...t, confidence: val } : t)),
    }));
  }

  function toggleItem(topicId: string, itemId: string) {
    setCfaState(prev => ({
      ...prev,
      topics: prev.topics.map(t => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          items: t.items.map(i => (i.id === itemId ? { ...i, done: !i.done } : i)),
        };
      }),
    }));
  }

  function updateNotes(topicId: string, notes: string) {
    setCfaState(prev => ({
      ...prev,
      topics: prev.topics.map(t => (t.id === topicId ? { ...t, notes } : t)),
    }));
  }

  function setStatus(topicId: string, status: CourseStatus) {
    setCfaState(prev => ({
      ...prev,
      topics: prev.topics.map(t => (t.id === topicId ? { ...t, status } : t)),
    }));
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>CFA Qualification</h1>
        <p className={styles.subtitle}>Chartered Financial Analyst — CFA Institute</p>
      </div>

      <div className={styles.tabBar}>
        {LEVELS.map(level => (
          <button
            key={level}
            type="button"
            className={cn(styles.tab, activeLevel === level ? styles.tabActive : undefined)}
            onClick={() => setActiveLevel(level)}
          >
            {LEVEL_LABELS[level]}
          </button>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Items done</span>
          <span className={styles.summaryValue}>
            {doneItems}/{totalItems}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Avg confidence</span>
          <span className={styles.summaryValue}>{avgConfidence}/5</span>
        </div>
        <div className={styles.summaryBar}>
          <ProgressBar value={doneItems} max={totalItems} color="accent" size="sm" showValue />
        </div>
      </div>

      <div className={styles.topicList}>
        {levelTopics.map(topic => {
          const isExpanded = expandedIds.has(topic.id);
          const itemsDone = topic.items.filter(i => i.done).length;

          return (
            <div
              key={topic.id}
              className={styles.topicCard}
              data-status={topic.status}
            >
              <button
                type="button"
                className={styles.topicHeader}
                onClick={() => toggleExpand(topic.id)}
                aria-expanded={isExpanded}
              >
                <div className={styles.topicHeaderLeft}>
                  <span className={styles.topicName}>{topic.name}</span>
                  <span className={styles.examWeight}>
                    {topic.examWeightMin}–{topic.examWeightMax}%
                  </span>
                </div>
                <div className={styles.topicHeaderRight}>
                  <Badge label={STATUS_LABELS[topic.status]} variant={statusVariant(topic.status)} />
                  <span onClick={e => e.stopPropagation()}>
                    <StarRating
                      value={topic.confidence}
                      onChange={v => updateConfidence(topic.id, v as 0 | 1 | 2 | 3 | 4 | 5)}
                    />
                  </span>
                  <span className={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              <div className={styles.topicMeta}>
                <ProgressBar value={itemsDone} max={topic.items.length} size="sm" showValue />
                {topic.uobOverlap.length > 0 && (
                  <div className={styles.tags}>
                    {topic.uobOverlap.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className={styles.expandedPanel}>
                  <div className={styles.statusGroup}>
                    {STATUS_ORDER.map(s => (
                      <button
                        key={s}
                        type="button"
                        className={cn(
                          styles.statusBtn,
                          topic.status === s ? styles.statusBtnActive : undefined,
                        )}
                        data-status={s}
                        onClick={() => setStatus(topic.id, s)}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>

                  <div className={styles.itemList}>
                    {topic.items.map(item => (
                      <label key={item.id} className={styles.itemRow}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={item.done}
                          onChange={() => toggleItem(topic.id, item.id)}
                        />
                        <span className={cn(styles.itemText, item.done ? styles.itemDone : undefined)}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>

                  <textarea
                    className={styles.notes}
                    defaultValue={topic.notes}
                    placeholder="Add notes…"
                    rows={3}
                    onBlur={e => updateNotes(topic.id, e.currentTarget.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
