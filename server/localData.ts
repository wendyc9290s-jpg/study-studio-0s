import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_ROOT = path.resolve(process.cwd(), 'data');

type DataKind = 'notes' | 'annotations';

function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-_]/g, '-');
}

function safeFileName(fileName: string): string {
  return path.basename(fileName).replace(/[^a-zA-Z0-9-_.]/g, '-');
}

function dataPath(kind: DataKind, lessonId: string): string {
  return path.join(DATA_ROOT, kind, `${safeId(lessonId)}.json`);
}

export function previewPdfPath(lessonId: string): string {
  return path.join(DATA_ROOT, 'previews', `${safeId(lessonId)}.pdf`);
}

export function previewPdfUrl(lessonId: string): string {
  return `/api/preview-file?id=${encodeURIComponent(lessonId)}`;
}

export async function jsonDataExists(kind: DataKind, lessonId: string): Promise<boolean> {
  try {
    await fs.access(dataPath(kind, lessonId));
    return true;
  } catch {
    return false;
  }
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

export async function writeAttachment(
  lessonId: string,
  fileName: string,
  mimeType: string,
  dataUrl: string,
): Promise<{ fileName: string; url: string }> {
  const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/webp' ? 'webp' : 'png';
  const cleanName = `${Date.now().toString(36)}-${safeId(fileName).replace(/-+$/, '') || 'image'}.${extension}`;
  const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '');
  const folderPath = path.join(DATA_ROOT, 'attachments', safeId(lessonId));
  await fs.mkdir(folderPath, { recursive: true });
  await fs.writeFile(path.join(folderPath, cleanName), Buffer.from(base64, 'base64'));
  return {
    fileName: cleanName,
    url: `/api/attachment?lessonId=${encodeURIComponent(lessonId)}&file=${encodeURIComponent(cleanName)}`,
  };
}

export function attachmentPath(lessonId: string, fileName: string): string {
  return path.join(DATA_ROOT, 'attachments', safeId(lessonId), safeFileName(fileName));
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
