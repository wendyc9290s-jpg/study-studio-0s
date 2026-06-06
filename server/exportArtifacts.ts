import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { exportFilePath, exportFileUrl } from './localData';

const execFileAsync = promisify(execFile);
const PYTHON = '/Library/Frameworks/Python.framework/Versions/3.14/bin/python3';

interface ExportResult {
  fileName: string;
  filePath: string;
  url: string;
}

interface Annotation {
  id: string;
  type: 'pen' | 'highlight' | 'text';
  color: string;
  points?: Array<{ x: number; y: number }>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
}

function safeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'lesson';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderAnnotationSvg(annotations: Annotation[]): string {
  return annotations.map(annotation => {
    if (annotation.type === 'pen') {
      const points = (annotation.points ?? []).map(point => `${point.x * 100},${point.y * 100}`).join(' ');
      return `<polyline points="${points}" fill="none" stroke="${escapeHtml(annotation.color)}" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.45"></polyline>`;
    }

    if (annotation.type === 'highlight') {
      const x = Math.min(annotation.x ?? 0, (annotation.x ?? 0) + (annotation.width ?? 0));
      const y = Math.min(annotation.y ?? 0, (annotation.y ?? 0) + (annotation.height ?? 0));
      return `<rect x="${x * 100}" y="${y * 100}" width="${Math.abs(annotation.width ?? 0) * 100}" height="${Math.abs(annotation.height ?? 0) * 100}" fill="${escapeHtml(annotation.color)}" opacity="0.28" rx="0.4"></rect>`;
    }

    return `<text x="${(annotation.x ?? 0) * 100}" y="${(annotation.y ?? 0) * 100}" fill="${escapeHtml(annotation.color)}" font-size="2.2" font-weight="700">${escapeHtml(annotation.text ?? '')}</text>`;
  }).join('\n');
}

export async function exportNoteDocx(payload: {
  lessonId: string;
  title: string;
  content: string;
}): Promise<ExportResult> {
  const baseName = `${safeName(payload.lessonId)}-notes`;
  const fileName = `${baseName}.docx`;
  const filePath = exportFilePath(fileName);
  const payloadPath = exportFilePath(`${baseName}.json`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(payloadPath, JSON.stringify({
    title: payload.title,
    content: payload.content,
    attachmentsRoot: path.resolve(process.cwd(), 'data', 'attachments'),
  }), 'utf8');

  await execFileAsync(PYTHON, [
    path.resolve(process.cwd(), 'server', 'scripts', 'export_note_docx.py'),
    payloadPath,
    filePath,
  ], { timeout: 120_000, maxBuffer: 1024 * 1024 });

  return { fileName, filePath, url: exportFileUrl(fileName) };
}

export async function exportAnnotatedHtml(payload: {
  lessonId: string;
  title: string;
  sourceUrl: string;
  annotations: Annotation[];
}): Promise<ExportResult> {
  const fileName = `${safeName(payload.lessonId)}-annotated.html`;
  const filePath = exportFilePath(fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(payload.title)} annotated export</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #111827; color: #111827; }
    .toolbar { position: sticky; top: 0; z-index: 3; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #cbd5e1; }
    .toolbar h1 { margin: 0; font-size: 15px; }
    .toolbar button { border: 1px solid #2563eb; background: #eff6ff; color: #1d4ed8; border-radius: 6px; padding: 8px 12px; font-weight: 700; cursor: pointer; }
    .stage { position: relative; max-width: 1100px; min-height: 900px; margin: 24px auto; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.28); }
    iframe { width: 100%; height: 900px; border: 0; display: block; background: white; }
    svg { position: absolute; inset: 0; width: 100%; height: 900px; pointer-events: none; overflow: visible; }
    @media print {
      body { background: white; }
      .toolbar { display: none; }
      .stage { margin: 0; max-width: none; box-shadow: none; page-break-after: always; }
      iframe, svg { height: 100vh; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>${escapeHtml(payload.title)} annotated export</h1>
    <button onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="stage">
    <iframe src="${escapeHtml(payload.sourceUrl)}"></iframe>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">${renderAnnotationSvg(payload.annotations)}</svg>
  </div>
</body>
</html>`;

  await fs.writeFile(filePath, html, 'utf8');
  return { fileName, filePath, url: exportFileUrl(fileName) };
}
