import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_ROOT = path.resolve(process.cwd(), 'data');

type DataKind = 'notes' | 'annotations';

function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-_]/g, '-');
}

function dataPath(kind: DataKind, lessonId: string): string {
  return path.join(DATA_ROOT, kind, `${safeId(lessonId)}.json`);
}

export async function readJsonData<T>(kind: DataKind, lessonId: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(dataPath(kind, lessonId), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonData<T>(kind: DataKind, lessonId: string, value: T): Promise<void> {
  const filePath = dataPath(kind, lessonId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
}

export async function ensureDataDirs(): Promise<void> {
  await Promise.all([
    fs.mkdir(path.join(DATA_ROOT, 'notes'), { recursive: true }),
    fs.mkdir(path.join(DATA_ROOT, 'annotations'), { recursive: true }),
    fs.mkdir(path.join(DATA_ROOT, 'attachments'), { recursive: true }),
    fs.mkdir(path.join(DATA_ROOT, 'previews'), { recursive: true }),
    fs.mkdir(path.join(DATA_ROOT, 'exports'), { recursive: true }),
  ]);
}
