import { useEffect, useMemo, useState } from 'react';
import { cn } from '../lib/escape';
import styles from './CourseCenterPage.module.css';

type MaterialType = 'pdf' | 'pptx';

interface CourseLesson {
  id: string;
  title: string;
  order: number;
  material: {
    path: string;
    fileName: string;
    type: MaterialType;
  } | null;
  notes: {
    path: string;
    fileName: string;
    type: 'docx';
  } | null;
}

interface CourseEntry {
  id: string;
  title: string;
  sourceFolder: string;
  lessons: CourseLesson[];
  extras: Array<{
    title: string;
    path: string;
    fileName: string;
    type: MaterialType;
  }>;
}

interface CourseIndex {
  root: string;
  generatedAt: string;
  courses: CourseEntry[];
}

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; index: CourseIndex }
  | { status: 'error'; message: string };

function fileBadge(type: string): string {
  return type.toUpperCase();
}

export function CourseCenterPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      try {
        const response = await fetch('/api/course-index');
        if (!response.ok) throw new Error(`Course index failed with ${response.status}`);
        const index = (await response.json()) as CourseIndex;
        if (!cancelled) {
          setLoadState({ status: 'ready', index });
          setSelectedCourseId(index.courses[0]?.id ?? null);
          setSelectedLessonId(index.courses[0]?.lessons[0]?.id ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Could not load course index.',
          });
        }
      }
    }

    loadIndex();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCourse = useMemo(() => {
    if (loadState.status !== 'ready') return null;
    return loadState.index.courses.find(course => course.id === selectedCourseId) ?? loadState.index.courses[0] ?? null;
  }, [loadState, selectedCourseId]);

  const selectedLesson = useMemo(() => {
    if (!selectedCourse) return null;
    return selectedCourse.lessons.find(lesson => lesson.id === selectedLessonId) ?? selectedCourse.lessons[0] ?? null;
  }, [selectedCourse, selectedLessonId]);

  function selectCourse(course: CourseEntry) {
    setSelectedCourseId(course.id);
    setSelectedLessonId(course.lessons[0]?.id ?? null);
  }

  if (loadState.status === 'loading') {
    return (
      <div className={styles.page}>
        <div className={styles.stateBox}>Loading course index...</div>
      </div>
    );
  }

  if (loadState.status === 'error') {
    return (
      <div className={styles.page}>
        <div className={cn(styles.stateBox, styles.errorBox)}>{loadState.message}</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Course Center</h1>
          <p className={styles.subtitle}>{loadState.index.root}</p>
        </div>
        <div className={styles.summary}>
          {loadState.index.courses.length} courses
        </div>
      </header>

      <div className={styles.shell}>
        <aside className={styles.courseNav} aria-label="Course lessons">
          {loadState.index.courses.map(course => (
            <section key={course.id} className={styles.courseGroup}>
              <button
                type="button"
                className={cn(styles.courseButton, selectedCourse?.id === course.id ? styles.courseButtonActive : undefined)}
                onClick={() => selectCourse(course)}
              >
                <span>{course.title}</span>
                <span className={styles.count}>{course.lessons.length}</span>
              </button>

              {selectedCourse?.id === course.id && (
                <div className={styles.lessonList}>
                  {course.lessons.map(lesson => (
                    <button
                      key={lesson.id}
                      type="button"
                      className={cn(styles.lessonButton, selectedLesson?.id === lesson.id ? styles.lessonButtonActive : undefined)}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <span className={styles.lessonTitle}>{lesson.title}</span>
                      <span className={styles.lessonMeta}>
                        {lesson.material ? fileBadge(lesson.material.type) : 'No slides'} / {lesson.notes ? 'DOCX' : 'No notes'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          ))}
        </aside>

        <section className={styles.detail}>
          {selectedCourse && selectedLesson ? (
            <>
              <div className={styles.detailHeader}>
                <div>
                  <p className={styles.kicker}>{selectedCourse.title}</p>
                  <h2 className={styles.lessonHeading}>{selectedLesson.title}</h2>
                </div>
                <span className={styles.orderBadge}>Lesson {selectedLesson.order}</span>
              </div>

              <div className={styles.pairGrid}>
                <div className={styles.assetPanel}>
                  <div className={styles.assetTop}>
                    <span className={styles.assetLabel}>Lecture Material</span>
                    <span className={styles.assetType}>{selectedLesson.material ? fileBadge(selectedLesson.material.type) : 'Missing'}</span>
                  </div>
                  {selectedLesson.material ? (
                    <>
                      <p className={styles.assetName}>{selectedLesson.material.fileName}</p>
                      <p className={styles.pathText}>{selectedLesson.material.path}</p>
                    </>
                  ) : (
                    <p className={styles.emptyText}>No lecture material matched this lesson.</p>
                  )}
                </div>

                <div className={styles.assetPanel}>
                  <div className={styles.assetTop}>
                    <span className={styles.assetLabel}>Notes</span>
                    <span className={styles.assetType}>{selectedLesson.notes ? 'DOCX' : 'Missing'}</span>
                  </div>
                  {selectedLesson.notes ? (
                    <>
                      <p className={styles.assetName}>{selectedLesson.notes.fileName}</p>
                      <p className={styles.pathText}>{selectedLesson.notes.path}</p>
                    </>
                  ) : (
                    <p className={styles.emptyText}>No notes document matched this lesson.</p>
                  )}
                </div>
              </div>

              {selectedCourse.extras.length > 0 && (
                <div className={styles.extraPanel}>
                  <div className={styles.assetLabel}>Course Extras</div>
                  {selectedCourse.extras.map(extra => (
                    <div key={extra.path} className={styles.extraRow}>
                      <span>{extra.title}</span>
                      <span className={styles.assetType}>{fileBadge(extra.type)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.stateBox}>No lessons found.</div>
          )}
        </section>
      </div>
    </div>
  );
}
