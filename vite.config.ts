import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { buildCourseIndex, isInsideCourseRoot } from './server/courseIndex';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'af-course-index-api',
      configureServer(server) {
        server.middlewares.use('/api/course-index', async (_req, res) => {
          try {
            const index = await buildCourseIndex();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(index));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: error instanceof Error ? error.message : 'Failed to build course index',
            }));
          }
        });

        server.middlewares.use('/api/course-file', async (req, res) => {
          try {
            const url = new URL(req.url ?? '', 'http://localhost');
            const filePath = url.searchParams.get('path');

            if (!filePath || !isInsideCourseRoot(filePath) || !filePath.toLowerCase().endsWith('.pdf')) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'File is not available for preview.' }));
              return;
            }

            const fileStat = await stat(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', String(fileStat.size));
            res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filePath.split('/').at(-1) ?? 'lecture.pdf')}"`);
            createReadStream(filePath).pipe(res);
          } catch (error) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: error instanceof Error ? error.message : 'File not found.',
            }));
          }
        });
      },
    },
  ],
});
