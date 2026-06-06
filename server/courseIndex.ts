import { promises as fs } from 'node:fs';
import path from 'node:path';

export const COURSE_ROOT = process.env.AF_COURSE_ROOT ?? '/Users/wendy/Desktop/UOB AF';

type MaterialType = 'pdf' | 'pptx';
type NoteType = 'docx';

export interface CourseLesson {
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
    type: NoteType;
  } | null;
}

export interface CourseEntry {
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

export interface CourseIndex {
  root: string;
  generatedAt: string;
  courses: CourseEntry[];
}

interface FileEntry {
  fileName: string;
  fullPath: string;
}

const COURSE_CONFIG = [
  {
    id: 'corporate-finance',
    title: 'Corporate Finance',
    folder: 'corporate finance',
    notesFolder: 'af-corporate finance notes',
    materialType: 'pdf' as const,
    match: 'lecture-number' as const,
  },
  {
    id: 'management-accounting',
    title: 'Management Accounting',
    folder: 'managemant accounting',
    notesFolder: 'af-mac-notes',
    materialType: 'pdf' as const,
    match: 'title' as const,
  },
  {
    id: 'business-law',
    title: 'Business Law',
    folder: 'business law',
    notesFolder: 'af-law-notes',
    materialType: 'pptx' as const,
    match: 'lecture-number' as const,
  },
];

const MANAGEMENT_ACCOUNTING_ORDER = [
  'Introduction to MA and Budgeting',
  'Budgeting',
  'Standard Costing and Variance Analysis',
  'The Role of MA in Decision Making',
  'Pricing Decisions Target Costing and Consumer Profitability Analysis',
  'Capital Investment Appraisal Methods',
  'Performance Measurement',
  'Environmental Management Accounting and Life Cycle Costing',
  'Theory of Constraints and Throughput Accounting',
];

async function listFiles(folderPath: string): Promise<FileEntry[]> {
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isFile() && !entry.name.startsWith('.') && entry.name !== 'build_af_law_notes.py')
      .map(entry => ({
        fileName: entry.name,
        fullPath: path.join(folderPath, entry.name),
      }));
  } catch {
    return [];
  }
}

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function lectureNumber(fileName: string): number | null {
  const match = fileName.match(/lecture\s+(\d+)/i);
  return match ? Number(match[1]) : null;
}

function titleFromLectureFile(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, '');
  const cleaned = withoutExt.replace(/^af-law-/, '').replace(/\s+notes\b/i, '');
  const withLectureLabel = cleaned.replace(/^lecture\s+(\d+)\s*/i, 'Lecture $1 - ');
  return withLectureLabel.replace(/\s+-\s*$/, '').trim();
}

function normalizeManagementTitle(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '').trim();
}

function byOrderThenTitle(a: CourseLesson, b: CourseLesson): number {
  if (a.order !== b.order) return a.order - b.order;
  return a.title.localeCompare(b.title);
}

export async function buildCourseIndex(): Promise<CourseIndex> {
  const courses: CourseEntry[] = [];

  for (const config of COURSE_CONFIG) {
    const sourceFolder = path.join(COURSE_ROOT, config.folder);
    const notesFolder = path.join(sourceFolder, config.notesFolder);
    const sourceFiles = await listFiles(sourceFolder);
    const noteFiles = (await listFiles(notesFolder)).filter(file => file.fileName.toLowerCase().endsWith('.docx'));
    const materials = sourceFiles.filter(file => file.fileName.toLowerCase().endsWith(`.${config.materialType}`));
    const notesByLecture = new Map<number, FileEntry>();
    const notesByTitle = new Map<string, FileEntry>();

    for (const note of noteFiles) {
      const number = lectureNumber(note.fileName);
      if (number !== null) notesByLecture.set(number, note);
      notesByTitle.set(slug(normalizeManagementTitle(note.fileName)), note);
    }

    const lessons: CourseLesson[] = [];
    const extras: CourseEntry['extras'] = [];

    for (const material of materials) {
      if (config.id === 'business-law' && !lectureNumber(material.fileName)) {
        extras.push({
          title: material.fileName.replace(/\.[^.]+$/, ''),
          path: material.fullPath,
          fileName: material.fileName,
          type: config.materialType,
        });
        continue;
      }

      if (config.match === 'lecture-number') {
        const number = lectureNumber(material.fileName);
        if (number === null) continue;
        const note = notesByLecture.get(number) ?? null;
        lessons.push({
          id: `${config.id}-lecture-${number}`,
          title: titleFromLectureFile(material.fileName),
          order: number,
          material: {
            path: material.fullPath,
            fileName: material.fileName,
            type: config.materialType,
          },
          notes: note
            ? {
                path: note.fullPath,
                fileName: note.fileName,
                type: 'docx',
              }
            : null,
        });
      } else {
        const title = normalizeManagementTitle(material.fileName);
        const note = notesByTitle.get(slug(title)) ?? null;
        const configuredOrder = MANAGEMENT_ACCOUNTING_ORDER.findIndex(item => item === title);
        lessons.push({
          id: `${config.id}-${slug(title)}`,
          title,
          order: configuredOrder >= 0 ? configuredOrder + 1 : MANAGEMENT_ACCOUNTING_ORDER.length + lessons.length + 1,
          material: {
            path: material.fullPath,
            fileName: material.fileName,
            type: config.materialType,
          },
          notes: note
            ? {
                path: note.fullPath,
                fileName: note.fileName,
                type: 'docx',
              }
            : null,
        });
      }
    }

    courses.push({
      id: config.id,
      title: config.title,
      sourceFolder,
      lessons: lessons.sort(byOrderThenTitle),
      extras: extras.sort((a, b) => a.title.localeCompare(b.title)),
    });
  }

  return {
    root: COURSE_ROOT,
    generatedAt: new Date().toISOString(),
    courses,
  };
}

export function isInsideCourseRoot(filePath: string): boolean {
  const resolvedRoot = path.resolve(COURSE_ROOT);
  const resolvedFile = path.resolve(filePath);
  return resolvedFile === resolvedRoot || resolvedFile.startsWith(`${resolvedRoot}${path.sep}`);
}
