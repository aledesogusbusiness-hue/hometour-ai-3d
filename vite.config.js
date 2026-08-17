import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.spz', '**/*.ply'],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});

