import { type ChangeEvent, type ClipboardEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
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

type AnnotationTool = 'select' | 'pen' | 'highlight' | 'text';
type SaveState = 'idle' | 'loading' | 'saving' | 'saved' | 'error';
type PptxPreviewState =
  | { status: 'idle' | 'missing' | 'converting' }
  | { status: 'ready'; url: string; method?: string }
  | { status: 'error'; message: string };

interface Point {
  x: number;
  y: number;
}

interface PenAnnotation {
  id: string;
  type: 'pen';
  color: string;
  points: Point[];
}

interface HighlightAnnotation {
  id: string;
  type: 'highlight';
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TextAnnotation {
  id: string;
  type: 'text';
  color: string;
  x: number;
  y: number;
  text: string;
}

type Annotation = PenAnnotation | HighlightAnnotation | TextAnnotation;

function fileBadge(type: string): string {
  return type.toUpperCase();
}

function previewUrl(filePath: string): string {
  return `/api/course-file?path=${encodeURIComponent(filePath)}`;
}

function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function saveLabel(state: SaveState): string {
  if (state === 'loading') return 'Loading';
  if (state === 'saving') return 'Saving';
  if (state === 'saved') return 'Saved';
  if (state === 'error') return 'Save error';
  return 'Ready';
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function CourseCenterPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteSaveState, setNoteSaveState] = useState<SaveState>('idle');
  const [noteDirty, setNoteDirty] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotationSaveState, setAnnotationSaveState] = useState<SaveState>('idle');
  const [annotationDirty, setAnnotationDirty] = useState(false);
  const [annotationTool, setAnnotationTool] = useState<AnnotationTool>('select');
  const [annotationColor, setAnnotationColor] = useState('#f59e0b');
  const [noteColor, setNoteColor] = useState('#f59e0b');
  const [noteHighlight, setNoteHighlight] = useState('#fde68a');
  const [pptxPreview, setPptxPreview] = useState<PptxPreviewState>({ status: 'idle' });
  const [draftAnnotation, setDraftAnnotation] = useState<Annotation | null>(null);
  const annotationSurfaceRef = useRef<HTMLDivElement>(null);
  const noteEditorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!selectedLesson) return;
    const lessonId = selectedLesson.id;
    const noteSourcePath = selectedLesson.notes?.path;
    let cancelled = false;
    setNoteSaveState('loading');
    setNoteDirty(false);

    async function loadNote() {
      try {
        const params = new URLSearchParams({ id: lessonId });
        if (noteSourcePath) params.set('sourcePath', noteSourcePath);
        const response = await fetch(`/api/lesson-note?${params.toString()}`);
        if (!response.ok) throw new Error('Could not load note');
        const note = (await response.json()) as { content?: string };
        if (!cancelled) {
          const content = note.content ?? '';
          setNoteContent(content);
          window.requestAnimationFrame(() => {
            if (noteEditorRef.current) noteEditorRef.current.innerHTML = content;
          });
          setNoteSaveState('saved');
        }
      } catch {
        if (!cancelled) setNoteSaveState('error');
      }
    }

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [selectedLesson]);

  useEffect(() => {
    if (selectedLesson?.material?.type !== 'pptx') {
      setPptxPreview({ status: 'idle' });
      return;
    }

    const lessonId = selectedLesson.id;
    let cancelled = false;
    setPptxPreview({ status: 'idle' });

    async function loadPreviewStatus() {
      try {
        const response = await fetch(`/api/pptx-preview?id=${encodeURIComponent(lessonId)}`);
        if (!response.ok) throw new Error('Could not load PPTX preview status');
        const payload = (await response.json()) as { status: 'ready' | 'missing'; url?: string; method?: string };
        if (cancelled) return;
        if (payload.status === 'ready' && payload.url) {
          setPptxPreview({ status: 'ready', url: payload.url, method: payload.method });
        } else {
          setPptxPreview({ status: 'missing' });
        }
      } catch {
        if (!cancelled) setPptxPreview({ status: 'error', message: 'Could not check PPTX preview.' });
      }
    }

    loadPreviewStatus();

    return () => {
      cancelled = true;
    };
  }, [selectedLesson]);

  useEffect(() => {
    if (!selectedLesson || !noteDirty) return;
    const timer = window.setTimeout(async () => {
      setNoteSaveState('saving');
      try {
        await fetch('/api/lesson-note', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: selectedLesson.id, content: noteContent }),
        });
        setNoteDirty(false);
        setNoteSaveState('saved');
      } catch {
        setNoteSaveState('error');
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [noteContent, noteDirty, selectedLesson]);

  useEffect(() => {
    if (!selectedLesson) return;
    const lessonId = selectedLesson.id;
    let cancelled = false;
    setAnnotationSaveState('loading');
    setAnnotationDirty(false);
    setDraftAnnotation(null);

    async function loadAnnotations() {
      try {
        const response = await fetch(`/api/annotations?id=${encodeURIComponent(lessonId)}`);
        if (!response.ok) throw new Error('Could not load annotations');
        const payload = (await response.json()) as { items?: Annotation[] };
        if (!cancelled) {
          setAnnotations(Array.isArray(payload.items) ? payload.items : []);
          setAnnotationSaveState('saved');
        }
      } catch {
        if (!cancelled) setAnnotationSaveState('error');
      }
    }

    loadAnnotations();

    return () => {
      cancelled = true;
    };
  }, [selectedLesson]);

  useEffect(() => {
    if (!selectedLesson || !annotationDirty) return;
    const timer = window.setTimeout(async () => {
      setAnnotationSaveState('saving');
      try {
        await fetch('/api/annotations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: selectedLesson.id, items: annotations }),
        });
        setAnnotationDirty(false);
        setAnnotationSaveState('saved');
      } catch {
        setAnnotationSaveState('error');
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [annotationDirty, annotations, selectedLesson]);

  function pointFromEvent(event: PointerEvent<HTMLElement>): Point {
    const rect = annotationSurfaceRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
    };
  }

  function handleAnnotationDown(event: PointerEvent<HTMLDivElement>) {
    if (annotationTool === 'select') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);

    if (annotationTool === 'text') {
      const text = window.prompt('Annotation text');
      if (!text?.trim()) return;
      setAnnotations(items => [
        ...items,
        { id: newId(), type: 'text', color: annotationColor, x: point.x, y: point.y, text: text.trim() },
      ]);
      setAnnotationDirty(true);
      return;
    }

    if (annotationTool === 'pen') {
      setDraftAnnotation({ id: newId(), type: 'pen', color: annotationColor, points: [point] });
      return;
    }

    setDraftAnnotation({
      id: newId(),
      type: 'highlight',
      color: annotationColor,
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    });
  }

  function handleAnnotationMove(event: PointerEvent<HTMLDivElement>) {
    if (!draftAnnotation) return;
    const point = pointFromEvent(event);

    if (draftAnnotation.type === 'pen') {
      setDraftAnnotation({
        ...draftAnnotation,
        points: [...draftAnnotation.points, point],
      });
      return;
    }

    if (draftAnnotation.type === 'highlight') {
      setDraftAnnotation({
        ...draftAnnotation,
        width: point.x - draftAnnotation.x,
        height: point.y - draftAnnotation.y,
      });
    }
  }

  function commitDraftAnnotation() {
    if (!draftAnnotation) return;
    setAnnotations(items => [...items, draftAnnotation]);
    setDraftAnnotation(null);
    setAnnotationDirty(true);
  }

  function undoAnnotation() {
    setAnnotations(items => items.slice(0, -1));
    setAnnotationDirty(true);
  }

  function clearAnnotations() {
    if (!window.confirm('Clear all annotations for this lesson?')) return;
    setAnnotations([]);
    setAnnotationDirty(true);
  }

  function syncEditorContent() {
    setNoteContent(noteEditorRef.current?.innerHTML ?? '');
    setNoteDirty(true);
  }

  function runEditorCommand(command: string, value?: string) {
    noteEditorRef.current?.focus();
    document.execCommand(command, false, value);
    syncEditorContent();
  }

  function formatBlock(tagName: 'p' | 'h2' | 'h3') {
    runEditorCommand('formatBlock', tagName);
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Could not read image.'));
      };
      reader.onerror = () => reject(reader.error ?? new Error('Could not read image.'));
      reader.readAsDataURL(file);
    });
  }

  async function uploadAndInsertImage(file: File) {
    if (!selectedLesson) return;
    setNoteSaveState('saving');
    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch('/api/attachment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          fileName: file.name,
          mimeType: file.type || 'image/png',
          dataUrl,
        }),
      });
      if (!response.ok) throw new Error('Image upload failed.');
      const attachment = (await response.json()) as { url: string };
      runEditorCommand('insertHTML', `<img src="${attachment.url}" alt="">`);
    } catch {
      setNoteSaveState('error');
    }
  }

  function handleImageInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (file) uploadAndInsertImage(file);
  }

  function handleNotePaste(event: ClipboardEvent<HTMLDivElement>) {
    const image = Array.from(event.clipboardData.files).find(file => file.type.startsWith('image/'));
    if (!image) return;
    event.preventDefault();
    uploadAndInsertImage(image);
  }

  async function convertSelectedPptx() {
    if (selectedLesson?.material?.type !== 'pptx') return;
    setPptxPreview({ status: 'converting' });
    try {
      const response = await fetch('/api/pptx-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          sourcePath: selectedLesson.material.path,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'PPTX conversion failed.');
      }
      const payload = (await response.json()) as { url: string; method?: string };
      setPptxPreview({ status: 'ready', url: payload.url, method: payload.method });
    } catch (error) {
      setPptxPreview({
        status: 'error',
        message: error instanceof Error ? error.message : 'PPTX conversion failed.',
      });
    }
  }

  function renderAnnotation(annotation: Annotation) {
    if (annotation.type === 'pen') {
      return (
        <polyline
          key={annotation.id}
          points={annotation.points.map(point => `${point.x * 100},${point.y * 100}`).join(' ')}
          fill="none"
          stroke={annotation.color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0.45"
        />
      );
    }

    if (annotation.type === 'highlight') {
      const x = Math.min(annotation.x, annotation.x + annotation.width);
      const y = Math.min(annotation.y, annotation.y + annotation.height);
      return (
        <rect
          key={annotation.id}
          x={x * 100}
          y={y * 100}
          width={Math.abs(annotation.width) * 100}
          height={Math.abs(annotation.height) * 100}
          fill={annotation.color}
          opacity="0.28"
          rx="0.4"
        />
      );
    }

    return (
      <text
        key={annotation.id}
        x={annotation.x * 100}
        y={annotation.y * 100}
        fill={annotation.color}
        fontSize="2.2"
        fontWeight="700"
      >
        {annotation.text}
      </text>
    );
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

        <section className={styles.workspace}>
          {selectedCourse && selectedLesson ? (
            <>
              <div className={styles.workspaceHeader}>
                <div>
                  <p className={styles.kicker}>{selectedCourse.title}</p>
                  <h2 className={styles.lessonHeading}>{selectedLesson.title}</h2>
                </div>
                <div className={styles.headerActions}>
                  <span className={styles.orderBadge}>Lesson {selectedLesson.order}</span>
                  <span className={styles.orderBadge}>
                    {selectedLesson.material ? fileBadge(selectedLesson.material.type) : 'No slides'} / {selectedLesson.notes ? 'DOCX' : 'No notes'}
                  </span>
                </div>
              </div>

              <div className={styles.splitWorkspace}>
                <section className={styles.viewerPane} aria-label="Lecture material preview">
                  <div className={styles.paneToolbar}>
                    <div>
                      <span className={styles.assetLabel}>Lecture Material</span>
                      <p className={styles.assetName}>{selectedLesson.material?.fileName ?? 'No matched material'}</p>
                    </div>
                    <div className={styles.toolbarRight}>
                      <span className={styles.saveState}>{saveLabel(annotationSaveState)}</span>
                      <span className={styles.assetType}>{selectedLesson.material ? fileBadge(selectedLesson.material.type) : 'Missing'}</span>
                    </div>
                  </div>

                  {(selectedLesson.material?.type === 'pdf' || (selectedLesson.material?.type === 'pptx' && pptxPreview.status === 'ready')) && (
                    <>
                      <div className={styles.annotationToolbar} aria-label="PDF annotation tools">
                        {(['select', 'pen', 'highlight', 'text'] as const).map(tool => (
                          <button
                            key={tool}
                            type="button"
                            className={cn(styles.toolButton, annotationTool === tool ? styles.toolButtonActive : undefined)}
                            onClick={() => setAnnotationTool(tool)}
                          >
                            {tool}
                          </button>
                        ))}
                        <input
                          className={styles.colorInput}
                          type="color"
                          value={annotationColor}
                          onChange={event => setAnnotationColor(event.currentTarget.value)}
                          aria-label="Annotation color"
                        />
                        <button type="button" className={styles.toolButton} onClick={undoAnnotation} disabled={annotations.length === 0}>
                          undo
                        </button>
                        <button type="button" className={styles.toolButton} onClick={clearAnnotations} disabled={annotations.length === 0}>
                          clear
                        </button>
                      </div>

                      <div
                        ref={annotationSurfaceRef}
                        className={cn(styles.pdfStage, annotationTool !== 'select' ? styles.pdfStageAnnotating : undefined)}
                        onPointerDown={handleAnnotationDown}
                        onPointerMove={handleAnnotationMove}
                        onPointerUp={commitDraftAnnotation}
                        onPointerCancel={() => setDraftAnnotation(null)}
                      >
                        <iframe
                          className={styles.pdfFrame}
                          title={`${selectedLesson.title} PDF preview`}
                          src={selectedLesson.material.type === 'pdf' ? previewUrl(selectedLesson.material.path) : pptxPreview.status === 'ready' ? pptxPreview.url : ''}
                        />
                        <svg className={styles.annotationLayer} viewBox="0 0 100 100" preserveAspectRatio="none">
                          {annotations.map(renderAnnotation)}
                          {draftAnnotation && renderAnnotation(draftAnnotation)}
                        </svg>
                      </div>
                    </>
                  )}

                  {selectedLesson.material?.type === 'pptx' && pptxPreview.status !== 'ready' && (
                    <div className={styles.previewPlaceholder}>
                      <div className={styles.placeholderTitle}>
                        {pptxPreview.status === 'converting' ? 'Converting PPTX' : 'PPTX preview pending'}
                      </div>
                      <p>{pptxPreview.status === 'error'
                        ? pptxPreview.message
                        : 'Convert this PowerPoint into a local PDF preview under data/previews, then use the same PDF annotation tools.'}
                      </p>
                      <p className={styles.pathText}>{selectedLesson.material.path}</p>
                      <button
                        type="button"
                        className={styles.convertButton}
                        onClick={convertSelectedPptx}
                        disabled={pptxPreview.status === 'converting'}
                      >
                        {pptxPreview.status === 'converting' ? 'Converting...' : 'Convert to PDF preview'}
                      </button>
                    </div>
                  )}

                  {!selectedLesson.material && (
                    <div className={styles.previewPlaceholder}>
                      <div className={styles.placeholderTitle}>No lecture material</div>
                      <p>No lecture material matched this lesson.</p>
                    </div>
                  )}
                </section>

                <section className={styles.notesPane} aria-label="Lesson notes">
                  <div className={styles.paneToolbar}>
                    <div>
                      <span className={styles.assetLabel}>Notes</span>
                      <p className={styles.assetName}>{selectedLesson.notes?.fileName ?? 'No matched notes'}</p>
                    </div>
                    <div className={styles.toolbarRight}>
                      <span className={styles.saveState}>{saveLabel(noteSaveState)}</span>
                      <span className={styles.assetType}>{selectedLesson.notes ? 'DOCX' : 'Missing'}</span>
                    </div>
                  </div>

                  {selectedLesson.notes ? (
                    <>
                      <div className={styles.noteToolbar} aria-label="Notes formatting tools">
                        <button type="button" className={styles.toolButton} onMouseDown={event => event.preventDefault()} onClick={() => formatBlock('h2')}>H2</button>
                        <button type="button" className={styles.toolButton} onMouseDown={event => event.preventDefault()} onClick={() => formatBlock('h3')}>H3</button>
                        <button type="button" className={styles.toolButton} onMouseDown={event => event.preventDefault()} onClick={() => formatBlock('p')}>P</button>
                        <button type="button" className={styles.toolButton} onMouseDown={event => event.preventDefault()} onClick={() => runEditorCommand('bold')}>B</button>
                        <button type="button" className={styles.toolButton} onMouseDown={event => event.preventDefault()} onClick={() => runEditorCommand('italic')}>I</button>
                        <button type="button" className={styles.toolButton} onMouseDown={event => event.preventDefault()} onClick={() => runEditorCommand('insertUnorderedList')}>List</button>
                        <button type="button" className={styles.toolButton} onMouseDown={event => event.preventDefault()} onClick={() => runEditorCommand('insertOrderedList')}>1.</button>
                        <label className={styles.colorTool}>
                          <span>Text</span>
                          <input
                            className={styles.colorInput}
                            type="color"
                            value={noteColor}
                            onChange={event => {
                              setNoteColor(event.currentTarget.value);
                              runEditorCommand('foreColor', event.currentTarget.value);
                            }}
                          />
                        </label>
                        <label className={styles.colorTool}>
                          <span>Highlight</span>
                          <input
                            className={styles.colorInput}
                            type="color"
                            value={noteHighlight}
                            onChange={event => {
                              setNoteHighlight(event.currentTarget.value);
                              runEditorCommand('hiliteColor', event.currentTarget.value);
                            }}
                          />
                        </label>
                        <button type="button" className={styles.toolButton} onClick={() => imageInputRef.current?.click()}>Image</button>
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className={styles.hiddenInput}
                          onChange={handleImageInput}
                        />
                      </div>

                      <div
                        ref={noteEditorRef}
                        className={styles.noteEditor}
                        contentEditable
                        role="textbox"
                        aria-multiline="true"
                        data-placeholder="Write lesson notes here. Paste screenshots or use Image to insert pictures."
                        onInput={syncEditorContent}
                        onPaste={handleNotePaste}
                      />
                      <div className={styles.noteSource}>
                        Source DOCX: <span>{selectedLesson.notes.path}</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.notesPlaceholder}>
                      <div className={styles.placeholderTitle}>No notes document</div>
                      <p>No notes document matched this lesson.</p>
                    </div>
                  )}
                </section>
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
