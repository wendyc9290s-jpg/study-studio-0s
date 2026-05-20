// FILE: src/pages/AccaPage.tsx
import { useState } from 'react';
import type { AccaGroup, AccaPaper, AccaState, CourseStatus } from '../types';
import { accaSeed } from '../data/accaSeed';
import { useLocalStorage } from '../lib/useLocalStorage';
import { Badge } from '../components/Badge';
import { cn } from '../lib/escape';
import styles from './AccaPage.module.css';

const GROUPS: AccaGroup[] = [
  'Applied Knowledge',
  'Applied Skills',
  'Strategic Professional',
  'Strategic Professional Optional',
];

const STATUS_ORDER: CourseStatus[] = ['not-started', 'previewing', 'studying', 'done'];
const STATUS_LABELS: Record<CourseStatus, string> = {
  'not-started': 'Not Started',
  previewing: 'Previewing',
  studying: 'Studying',
  done: 'Done',
};

const PRIORITY_LABELS: Record<AccaPaper['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function statusVariant(s: CourseStatus): string {
  return s === 'not-started' ? 'notStarted' : s;
}

function cycleStatus(current: CourseStatus): CourseStatus {
  const idx = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
}

export function AccaPage() {
  const [accaState, setAccaState] = useLocalStorage<AccaState>('af-cc:acca:v1', accaSeed);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const papers = accaState.papers;
  const totalPapers = papers.length;
  const donePapers = papers.filter(p => p.status === 'done').length;
  const studyingPapers = papers.filter(p => p.status === 'studying').length;

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function cyclePaperStatus(paperId: string) {
    setAccaState(prev => ({
      ...prev,
      papers: prev.papers.map(p =>
        p.id === paperId ? { ...p, status: cycleStatus(p.status) } : p,
      ),
    }));
  }

  function setStatus(paperId: string, status: CourseStatus) {
    setAccaState(prev => ({
      ...prev,
      papers: prev.papers.map(p => (p.id === paperId ? { ...p, status } : p)),
    }));
  }

  function updateNotes(paperId: string, notes: string) {
    setAccaState(prev => ({
      ...prev,
      papers: prev.papers.map(p => (p.id === paperId ? { ...p, notes } : p)),
    }));
  }

  function updateExamDate(paperId: string, examDate: string) {
    setAccaState(prev => ({
      ...prev,
      papers: prev.papers.map(p => (p.id === paperId ? { ...p, examDate } : p)),
    }));
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>ACCA Qualification</h1>
        <p className={styles.subtitle}>Association of Chartered Certified Accountants</p>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Completed</span>
          <span className={styles.summaryValue}>{donePapers}/{totalPapers}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Studying</span>
          <span className={styles.summaryValue}>{studyingPapers}</span>
        </div>
        <div className={styles.summaryProgress}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${totalPapers === 0 ? 0 : Math.round((donePapers / totalPapers) * 100)}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {totalPapers === 0 ? 0 : Math.round((donePapers / totalPapers) * 100)}% complete
          </span>
        </div>
      </div>

      {GROUPS.map(group => {
        const groupPapers = papers.filter(p => p.group === group);
        if (groupPapers.length === 0) return null;

        return (
          <div key={group} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{group}</h2>
              <span className={styles.sectionCount}>{groupPapers.length} papers</span>
            </div>

            <div className={styles.table}>
              {groupPapers.map(paper => {
                const isExpanded = expandedIds.has(paper.id);

                return (
                  <div key={paper.id} className={styles.paperWrapper}>
                    <button
                      type="button"
                      className={styles.paperRow}
                      onClick={() => toggleExpand(paper.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className={styles.paperCode}>
                        <Badge label={paper.code} variant="code" />
                      </div>
                      <div className={styles.paperName}>{paper.name}</div>
                      <div className={styles.paperStatus}>
                        <span
                          role="button"
                          tabIndex={0}
                          className={styles.statusClickable}
                          onClick={e => {
                            e.stopPropagation();
                            cyclePaperStatus(paper.id);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              cyclePaperStatus(paper.id);
                            }
                          }}
                        >
                          <Badge label={STATUS_LABELS[paper.status]} variant={statusVariant(paper.status)} />
                        </span>
                      </div>
                      <div className={styles.paperPriority}>
                        <Badge label={PRIORITY_LABELS[paper.priority]} variant={paper.priority} />
                      </div>
                      <div className={styles.paperOverlap}>
                        {paper.uobOverlap.map(tag => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                      <span className={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
                    </button>

                    {isExpanded && (
                      <div className={styles.expandedPanel}>
                        <div className={styles.statusGroup}>
                          {STATUS_ORDER.map(s => (
                            <button
                              key={s}
                              type="button"
                              className={cn(
                                styles.statusBtn,
                                paper.status === s ? styles.statusBtnActive : undefined,
                              )}
                              data-status={s}
                              onClick={() => setStatus(paper.id, s)}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>

                        <div className={styles.detailRow}>
                          <div className={styles.detailField}>
                            <label className={styles.detailLabel}>Exam Date</label>
                            <input
                              type="date"
                              className={styles.dateInput}
                              defaultValue={paper.examDate}
                              onBlur={e => updateExamDate(paper.id, e.currentTarget.value)}
                            />
                          </div>
                        </div>

                        <textarea
                          className={styles.notes}
                          defaultValue={paper.notes}
                          placeholder="Add notes…"
                          rows={3}
                          onBlur={e => updateNotes(paper.id, e.currentTarget.value)}
                        />
                      </div>
                    )}
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
