import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackStart({
      target: 'vercel',
      react: {
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      },
    }),
  ],
  server: {
    port: 3000,
  },
  clearScreen: false,
  resolve: {
    alias: {
      '#src': '/src',
    },
  },
  ssr: {
    noExternal: ['@atlaskit/pragmatic-drag-and-drop'],
  },
});
