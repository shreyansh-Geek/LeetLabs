import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import eslint from 'vite-plugin-eslint';
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: './tailwind.config.js',
    }),
    eslint({
      failOnError: false, // <-- Don't crash on error
      emitWarning: true,
      emitError: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  assetsInclude: ['**/*.woff', '**/*.woff2'],
});