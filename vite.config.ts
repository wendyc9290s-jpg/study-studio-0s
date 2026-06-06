import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { buildCourseIndex, isInsideCourseRoot } from './server/courseIndex';
import { importDocxAsHtml } from './server/docxImport';
import {
  attachmentPath,
  ensureDataDirs,
  jsonDataExists,
  readJsonData,
  writeAttachment,
  writeJsonData,
} from './server/localData';

async function readRequestJson<T>(req: import('node:http').IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as T;
}

function sendJson(res: import('node:http').ServerResponse, statusCode: number, value: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(value));
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'af-course-index-api',
      configureServer(server) {
        ensureDataDirs();

        server.middlewares.use('/api/course-index', async (_req, res) => {
          try {
            const index = await buildCourseIndex();
            sendJson(res, 200, index);
          } catch (error) {
            sendJson(res, 500, {
              error: error instanceof Error ? error.message : 'Failed to build course index',
            });
          }
        });

        server.middlewares.use('/api/course-file', async (req, res) => {
          try {
            const url = new URL(req.url ?? '', 'http://localhost');
            const filePath = url.searchParams.get('path');

            if (!filePath || !isInsideCourseRoot(filePath) || !filePath.toLowerCase().endsWith('.pdf')) {
              sendJson(res, 403, { error: 'File is not available for preview.' });
              return;
            }

            const fileStat = await stat(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', String(fileStat.size));
            res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filePath.split('/').at(-1) ?? 'lecture.pdf')}"`);
            createReadStream(filePath).pipe(res);
          } catch (error) {
            sendJson(res, 404, {
              error: error instanceof Error ? error.message : 'File not found.',
            });
          }
        });

        server.middlewares.use('/api/lesson-note', async (req, res) => {
          try {
            if (req.method === 'GET') {
              const url = new URL(req.url ?? '', 'http://localhost');
              const lessonId = url.searchParams.get('id');
              const sourcePath = url.searchParams.get('sourcePath');
              if (!lessonId) {
                sendJson(res, 400, { error: 'Missing lesson id.' });
                return;
              }

              const hasLocalNote = await jsonDataExists('notes', lessonId);
              if (!hasLocalNote && sourcePath && isInsideCourseRoot(sourcePath) && sourcePath.toLowerCase().endsWith('.docx')) {
                const importedHtml = await importDocxAsHtml(sourcePath);
                const importedNote = {
                  lessonId,
                  content: importedHtml,
                  importedFrom: sourcePath,
                  updatedAt: new Date().toISOString(),
                };
                await writeJsonData('notes', lessonId, importedNote);
                sendJson(res, 200, importedNote);
                return;
              }

              const note = await readJsonData('notes', lessonId, { lessonId, content: '', importedFrom: null, updatedAt: null });
              sendJson(res, 200, note);
              return;
            }

            if (req.method === 'PUT') {
              const body = await readRequestJson<{ lessonId?: string; content?: string }>(req);
              if (!body.lessonId) {
                sendJson(res, 400, { error: 'Missing lesson id.' });
                return;
              }
              const note = {
                lessonId: body.lessonId,
                content: body.content ?? '',
                updatedAt: new Date().toISOString(),
              };
              await writeJsonData('notes', body.lessonId, note);
              sendJson(res, 200, note);
              return;
            }

            sendJson(res, 405, { error: 'Method not allowed.' });
          } catch (error) {
            sendJson(res, 500, {
              error: error instanceof Error ? error.message : 'Failed to save note.',
            });
          }
        });

        server.middlewares.use('/api/annotations', async (req, res) => {
          try {
            if (req.method === 'GET') {
              const url = new URL(req.url ?? '', 'http://localhost');
              const lessonId = url.searchParams.get('id');
              if (!lessonId) {
                sendJson(res, 400, { error: 'Missing lesson id.' });
                return;
              }
              const annotations = await readJsonData('annotations', lessonId, { lessonId, items: [], updatedAt: null });
              sendJson(res, 200, annotations);
              return;
            }

            if (req.method === 'PUT') {
              const body = await readRequestJson<{ lessonId?: string; items?: unknown[] }>(req);
              if (!body.lessonId) {
                sendJson(res, 400, { error: 'Missing lesson id.' });
                return;
              }
              const annotations = {
                lessonId: body.lessonId,
                items: Array.isArray(body.items) ? body.items : [],
                updatedAt: new Date().toISOString(),
              };
              await writeJsonData('annotations', body.lessonId, annotations);
              sendJson(res, 200, annotations);
              return;
            }

            sendJson(res, 405, { error: 'Method not allowed.' });
          } catch (error) {
            sendJson(res, 500, {
              error: error instanceof Error ? error.message : 'Failed to save annotations.',
            });
          }
        });

        server.middlewares.use('/api/attachment', async (req, res) => {
          try {
            if (req.method === 'GET') {
              const url = new URL(req.url ?? '', 'http://localhost');
              const lessonId = url.searchParams.get('lessonId');
              const file = url.searchParams.get('file');
              if (!lessonId || !file) {
                sendJson(res, 400, { error: 'Missing attachment id.' });
                return;
              }
              const filePath = attachmentPath(lessonId, file);
              const fileStat = await stat(filePath);
              const lower = file.toLowerCase();
              const contentType = lower.endsWith('.jpg') || lower.endsWith('.jpeg')
                ? 'image/jpeg'
                : lower.endsWith('.webp')
                  ? 'image/webp'
                  : 'image/png';
              res.statusCode = 200;
              res.setHeader('Content-Type', contentType);
              res.setHeader('Content-Length', String(fileStat.size));
              createReadStream(filePath).pipe(res);
              return;
            }

            if (req.method === 'POST') {
              const body = await readRequestJson<{
                lessonId?: string;
                fileName?: string;
                mimeType?: string;
                dataUrl?: string;
              }>(req);
              if (!body.lessonId || !body.dataUrl || !body.mimeType?.startsWith('image/')) {
                sendJson(res, 400, { error: 'Invalid attachment payload.' });
                return;
              }
              const attachment = await writeAttachment(
                body.lessonId,
                body.fileName ?? 'image',
                body.mimeType,
                body.dataUrl,
              );
              sendJson(res, 200, attachment);
              return;
            }

            sendJson(res, 405, { error: 'Method not allowed.' });
          } catch (error) {
            sendJson(res, 500, {
              error: error instanceof Error ? error.message : 'Failed to handle attachment.',
            });
          }
        });
      },
    },
  ],
});
