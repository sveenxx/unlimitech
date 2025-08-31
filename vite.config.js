import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  server: {
    open: true,
    watch: {
        usePolling: true,
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});


