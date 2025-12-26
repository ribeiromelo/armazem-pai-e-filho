import { defineConfig } from 'vite';
import pages from '@hono/vite-cloudflare-pages';

export default defineConfig({
  plugins: [pages()],
  build: {
    outDir: 'dist',
    minify: false // DESATIVAR MINIFICAÇÃO para debug
  }
});