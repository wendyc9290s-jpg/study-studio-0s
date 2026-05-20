// FILE: src/pages/StudyModesPage.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppState } from '../context/useAppState';
import type { KeyTopic } from '../types';
import { cn } from '../lib/escape';
import styles from './StudyModesPage.module.css';

type Mode = 'browse' | 'flashcard' | 'weak' | 'timer';

const MODE_LABELS: Record<Mode, string> = {
  browse: 'Browse',
  flashcard: 'Flashcard',
  weak: 'Weak Topics',
  timer: 'Focus Timer',
};

const MODES: Mode[] = ['browse', 'flashcard', 'weak', 'timer'];

// ── Shared types ──────────────────────────────────────────────

interface FlatTopic {
  courseName: string;
  topic: KeyTopic;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Browse Mode ───────────────────────────────────────────────

function BrowseMode() {
  const { state } = useAppState();
  const [openCourses, setOpenCourses] = useState<Set<string>>(new Set());

  function toggleCourse(id: string) {
    setOpenCourses(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.browseList}>
      {state.courses.map(course => {
        const isOpen = openCourses.has(course.id);
        return (
          <div key={course.id} className={styles.browseSection}>
            <button
              type="button"
              className={styles.browseSectionHeader}
              onClick={() => toggleCourse(course.id)}
              aria-expanded={isOpen}
            >
              <span className={styles.browseSectionName}>{course.name}</span>
              <span className={styles.browseSectionMeta}>
                {course.keyTopics.filter(t => t.done).length}/{course.keyTopics.length} done
              </span>
              <span className={styles.expandIcon}>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className={styles.browseTopics}>
                {course.keyTopics.map(topic => (
                  <div key={topic.id} className={styles.browseTopicRow}>
                    <span className={cn(styles.doneIndicator, topic.done ? styles.doneIndicatorOn : undefined)} />
                    <span className={cn(styles.browseTopicText, topic.done ? styles.browseTopicDone : undefined)}>
                      {topic.text}
                    </span>
                    <div className={styles.confidenceDots}>
                      {([0, 1, 2, 3, 4] as const).map(i => (
                        <span
                          key={i}
                          className={cn(
                            styles.dot,
                            (topic.topicConfidence ?? 0) > i ? styles.dotFilled : undefined,
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Flashcard Mode ────────────────────────────────────────────

function FlashcardMode() {
  const { state } = useAppState();

  const buildDeck = useCallback((): FlatTopic[] => {
    const flat: FlatTopic[] = state.courses.flatMap(course =>
      course.keyTopics.map(topic => ({ courseName: course.name, topic })),
    );
    return shuffle(flat);
  }, [state.courses]);

  const [deck, setDeck] = useState<FlatTopic[]>(() => buildDeck());
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = deck[cardIndex];

  function handleGotIt() {
    setFlipped(false);
    setCardIndex(i => Math.min(i + 1, deck.length - 1));
  }

  function handleNotYet() {
    setFlipped(false);
    setCardIndex(i => Math.min(i + 1, deck.length - 1));
  }

  function handleRestart() {
    setDeck(buildDeck());
    setCardIndex(0);
    setFlipped(false);
  }

  if (!current) {
    return (
      <div className={styles.flashDone}>
        <p className={styles.flashDoneText}>All cards reviewed!</p>
        <button type="button" className={styles.restartBtn} onClick={handleRestart}>
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className={styles.flashContainer}>
      <div className={styles.flashProgress}>
        Card {cardIndex + 1} of {deck.length}
      </div>

      <div
        className={cn(styles.flashCard, flipped ? styles.flashCardFlipped : undefined)}
        onClick={() => !flipped && setFlipped(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !flipped) setFlipped(true); }}
        aria-label={flipped ? 'Card answer' : 'Card question — click to reveal'}
      >
        <div className={styles.flashCardInner}>
          <div className={styles.flashCardFront}>
            <p className={styles.flashCardSide}>Question</p>
            <p className={styles.flashCardText}>{current.topic.text}</p>
          </div>
          <div className={styles.flashCardBack}>
            <p className={styles.flashCardSide}>Answer</p>
            <p className={styles.flashCardCourse}>{current.courseName}</p>
            {current.topic.notes && (
              <p className={styles.flashCardNotes}>{current.topic.notes}</p>
            )}
          </div>
        </div>
      </div>

      {!flipped ? (
        <button type="button" className={styles.showAnswerBtn} onClick={() => setFlipped(true)}>
          Show Answer
        </button>
      ) : (
        <div className={styles.flashControls}>
          <button type="button" className={styles.gotItBtn} onClick={handleGotIt}>
            Got it ✓
          </button>
          <button type="button" className={styles.notYetBtn} onClick={handleNotYet}>
            Not yet ✗
          </button>
        </div>
      )}

      <button type="button" className={styles.restartBtn} onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
}

// ── Weak Topics Mode ──────────────────────────────────────────

function WeakTopicsMode() {
  const { state } = useAppState();

  const groups = state.courses
    .map(course => ({
      courseName: course.name,
      topics: course.keyTopics.filter(t => !t.done),
    }))
    .filter(g => g.topics.length > 0);

  const totalWeak = groups.reduce((acc, g) => acc + g.topics.length, 0);

  return (
    <div className={styles.weakContainer}>
      <p className={styles.weakCount}>{totalWeak} topic{totalWeak !== 1 ? 's' : ''} remaining</p>
      {groups.length === 0 ? (
        <p className={styles.weakEmpty}>All topics are marked done. Great work!</p>
      ) : (
        <div className={styles.browseList}>
          {groups.map(g => (
            <div key={g.courseName} className={styles.browseSection}>
              <div className={styles.weakSectionHeader}>
                <span className={styles.browseSectionName}>{g.courseName}</span>
                <span className={styles.browseSectionMeta}>{g.topics.length} remaining</span>
              </div>
              <div className={styles.browseTopics}>
                {g.topics.map(topic => (
                  <div key={topic.id} className={styles.browseTopicRow}>
                    <span className={styles.doneIndicator} />
                    <span className={styles.browseTopicText}>{topic.text}</span>
                    <div className={styles.confidenceDots}>
                      {([0, 1, 2, 3, 4] as const).map(i => (
                        <span
                          key={i}
                          className={cn(
                            styles.dot,
                            (topic.topicConfidence ?? 0) > i ? styles.dotFilled : undefined,
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Focus Timer Mode ──────────────────────────────────────────

type TimerPhase = 'study' | 'break';

const STUDY_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function FocusTimerMode() {
  const [phase, setPhase] = useState<TimerPhase>('study');
  const [secondsLeft, setSecondsLeft] = useState(STUDY_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setPhase(p => {
              const next: TimerPhase = p === 'study' ? 'break' : 'study';
              setSecondsLeft(next === 'study' ? STUDY_SECONDS : BREAK_SECONDS);
              return next;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  function handleReset() {
    setRunning(false);
    setPhase('study');
    setSecondsLeft(STUDY_SECONDS);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className={styles.timerContainer}>
      <div className={cn(styles.timerPhaseLabel, phase === 'study' ? styles.timerPhaseStudy : styles.timerPhaseBreak)}>
        {phase === 'study' ? 'Study' : 'Break'}
      </div>
      <div className={styles.timerDisplay}>{display}</div>
      <div className={styles.timerControls}>
        <button
          type="button"
          className={styles.timerBtn}
          onClick={() => setRunning(r => !r)}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          className={cn(styles.timerBtn, styles.timerBtnSecondary)}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <p className={styles.timerHint}>
        {phase === 'study'
          ? 'Focus — stay away from distractions.'
          : 'Take a short break. Stretch and breathe.'}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export function StudyModesPage() {
  const [mode, setMode] = useState<Mode>('browse');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Study Modes</h1>
      </div>

      <div className={styles.modeBar}>
        {MODES.map(m => (
          <button
            key={m}
            type="button"
            className={cn(styles.modeBtn, mode === m ? styles.modeBtnActive : undefined)}
            onClick={() => setMode(m)}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className={styles.modeContent}>
        {mode === 'browse' && <BrowseMode />}
        {mode === 'flashcard' && <FlashcardMode />}
        {mode === 'weak' && <WeakTopicsMode />}
        {mode === 'timer' && <FocusTimerMode />}
      </div>
    </div>
  );
}
