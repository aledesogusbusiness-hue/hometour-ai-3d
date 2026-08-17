import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.spz', '**/*.worker.js'],
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
});
