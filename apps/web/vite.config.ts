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
    noExternal: [
      // https://github.com/atlassian/pragmatic-drag-and-drop/issues/27#issuecomment-2615335498
      '@atlaskit/pragmatic-drag-and-drop',
      '@atlaskit/pragmatic-drag-and-drop-auto-scroll',
      '@atlaskit/pragmatic-drag-and-drop-hitbox',
      '@mui/*',
    ],
  },
});
