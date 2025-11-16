import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro(),
    viteReact({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '#src': path.resolve(__dirname, '/src'),
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
