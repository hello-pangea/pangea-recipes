import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tanstackStart(), nitro(), react(), babel({ presets: [reactCompilerPreset()] })],
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
