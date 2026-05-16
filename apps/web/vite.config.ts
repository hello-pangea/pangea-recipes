import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import { devtools } from '@tanstack/devtools-vite';
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    devtools({
      consolePiping: {
        enabled: false,
      },
      enhancedLogs: {
        enabled: false,
      },
      injectSource: {
        enabled: false,
      },
    }),
    tanstackStart(),
    nitroV2Plugin({
      config: { preset: 'node-server', compatibilityDate: '2026-04-05' },
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
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
