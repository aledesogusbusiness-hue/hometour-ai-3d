import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'three',
        'three/examples/jsm/controls/OrbitControls.js',
        '@sparkjsdev/spark'
      ]
    }
  }
});

