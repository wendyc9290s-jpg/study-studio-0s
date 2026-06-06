import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { buildCourseIndex } from './server/courseIndex';

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
      },
    },
  ],
});
