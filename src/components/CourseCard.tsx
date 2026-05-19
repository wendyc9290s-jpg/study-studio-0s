import { useEffect, useState } from 'react';
import type { Course, CourseStatus, ExamRelevance, ResourceType } from '../types';
import { useAppState } from '../context/useAppState';
import { Badge } from './Badge';
import { StarRating } from './StarRating';
import { ProgressBar } from './ProgressBar';
import { cn } from '../lib/escape';
import styles from './CourseCard.module.css';

const STATUS_OPTIONS: { value: CourseStatus; label: string }[] = [
  { value: 'not-started', label: 'Not started' },
  { value: 'previewing',  label: 'Previewing'  },
  { value: 'studying',    label: 'Studying'    },
  { value: 'done',        label: 'Done'        },
];

const RELEVANCE_OPTIONS: { value: ExamRelevance; label: string }[] = [
  { value: 'low',    label: 'Low'    },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High'   },
];

const RESOURCE_TYPES: ResourceType[] = ['youtube', 'bilibili', 'pdf', 'web', 'note'];

interface AddResourceFormProps { courseId: string }

function AddResourceForm({ courseId }: AddResourceFormProps) {
  const { addResource } = useAppState();
  const [title, setTitle] = useState('');
  const [url,   setUrl]   = useState('');
  const [type,  setType]  = useState<ResourceType>('youtube');

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    const t = title.trim(), u = url.trim();
    if (!t || !u) return;
    addResource(courseId, { title: t, url: u, type });
    setTitle(''); setUrl(''); setType('youtube');
  }

  return (
    <div className={styles.addResourceForm} onClick={e => e.stopPropagation()}>
      <input className={styles.formInput} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input className={styles.formInput} placeholder="URL"   value={url}   onChange={e => setUrl(e.target.value)}   />
      <select
        className={styles.formSelect}
        value={type}
        onChange={e => setType(e.target.value as ResourceType)}
        onClick={e => e.stopPropagation()}
      >
        {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <button type="button" className={styles.addBtn} onClick={handleAdd}>+ Add</button>
    </div>
  );
}

interface TopicRowProps {
  topic: { id: string; text: string; done: boolean };
  onCheck: (done: boolean) => void;
  onDelete: () => void;
  onBlur:   (text: string) => void;
}

function TopicRow({ topic, onCheck, onDelete, onBlur }: TopicRowProps) {
  const [localText, setLocalText] = useState(topic.text);
  const [focused,   setFocused]   = useState(false);

  useEffect(() => {
    if (!focused) setLocalText(topic.text);
  }, [topic.text, focused]);

  return (
    <li className={styles.topicRow}>
      <input
        type="checkbox"
        className={styles.topicCheckbox}
        checked={topic.done}
        onChange={e => { e.stopPropagation(); onCheck(e.target.checked); }}
        onClick={e => e.stopPropagation()}
      />
      <input
        type="text"
        className={styles.topicInput}
        value={localText}
        onChange={e => setLocalText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); if (localText !== topic.text) onBlur(localText); }}
        onClick={e => e.stopPropagation()}
      />
      <button type="button" className={styles.deleteBtn} onClick={e => { e.stopPropagation(); onDelete(); }}>
        ×
      </button>
    </li>
  );
}

interface CourseCardProps { course: Course }

export function CourseCard({ course }: CourseCardProps) {
  const { updateCourse, addKeyTopic, updateKeyTopic, deleteKeyTopic, deleteResource } = useAppState();
  const [expanded,    setExpanded]    = useState(false);
  const [localNotes,  setLocalNotes]  = useState(course.notes);
  const [notesFocused, setNotesFocused] = useState(false);

  useEffect(() => {
    if (!notesFocused) setLocalNotes(course.notes);
  }, [course.notes, notesFocused]);

  function toggle(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button, input, textarea, select, a')) return;
    setExpanded(o => !o);
  }

  const doneTopics  = course.keyTopics.filter(t => t.done).length;
  const totalTopics = course.keyTopics.length;

  return (
    <article
      className={styles.card}
      data-status={course.status}
      onClick={toggle}
      aria-expanded={expanded}
    >
      <div className={styles.inner}>
        <h3 className={styles.title}>{course.name}</h3>
        <p className={styles.blurb}>{course.blurb}</p>
        <div className={styles.badges}>
          <Badge label={course.status}       variant={course.status} />
          <Badge label={course.examRelevance} variant={course.examRelevance} />
          <StarRating value={course.confidence} readOnly />
        </div>
        {totalTopics > 0 && (
          <div className={styles.topicsProgress}>
            <ProgressBar value={doneTopics} max={totalTopics} size="sm" label={`${doneTopics}/${totalTopics} topics`} />
          </div>
        )}
      </div>

      {expanded && (
        <div className={styles.expanded}>
          {/* Status */}
          <p className={styles.sectionLabel}>Status</p>
          <div className={styles.buttonGroup}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={cn(styles.groupBtn, course.status === opt.value ? styles.groupBtnActive : undefined)}
                onClick={e => { e.stopPropagation(); updateCourse(course.id, { status: opt.value }); }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Exam relevance */}
          <p className={styles.sectionLabel}>Exam relevance</p>
          <div className={styles.buttonGroup}>
            {RELEVANCE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={cn(styles.groupBtn, course.examRelevance === opt.value ? styles.groupBtnActive : undefined)}
                onClick={e => { e.stopPropagation(); updateCourse(course.id, { examRelevance: opt.value }); }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Confidence */}
          <p className={styles.sectionLabel}>Confidence</p>
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <StarRating
              value={course.confidence}
              onChange={v => updateCourse(course.id, { confidence: v })}
            />
          </div>

          {/* Key topics */}
          <p className={styles.sectionLabel}>Key topics</p>
          <ul className={styles.topicsList}>
            {course.keyTopics.map(topic => (
              <TopicRow
                key={topic.id}
                topic={topic}
                onCheck={done => updateKeyTopic(course.id, topic.id, { done })}
                onDelete={() => deleteKeyTopic(course.id, topic.id)}
                onBlur={text => updateKeyTopic(course.id, topic.id, { text })}
              />
            ))}
          </ul>
          <button
            type="button"
            className={styles.addBtn}
            onClick={e => { e.stopPropagation(); addKeyTopic(course.id); }}
          >
            + Add topic
          </button>

          {/* Resources */}
          <p className={styles.sectionLabel}>Resources</p>
          {course.resources.length > 0 && (
            <ul className={styles.resourceList}>
              {course.resources.map(resource => (
                <li key={resource.id} className={styles.resourceRow}>
                  <a
                    className={styles.resourceLink}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    {resource.title}
                  </a>
                  <Badge label={resource.type} variant={resource.type} />
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={e => { e.stopPropagation(); deleteResource(course.id, resource.id); }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <AddResourceForm courseId={course.id} />

          {/* Notes */}
          <p className={styles.sectionLabel}>Notes</p>
          <textarea
            className={styles.notesTextarea}
            value={localNotes}
            onClick={e => e.stopPropagation()}
            onChange={e => setLocalNotes(e.target.value)}
            onFocus={() => setNotesFocused(true)}
            onBlur={() => {
              setNotesFocused(false);
              if (localNotes !== course.notes) updateCourse(course.id, { notes: localNotes });
            }}
            placeholder="Add notes..."
          />
        </div>
      )}
    </article>
  );
}
