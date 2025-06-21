import { sentryVitePlugin } from '@sentry/vite-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackRouter(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    sentryVitePlugin({
      org: process.env['SENTRY_ORG'],
      project: process.env['SENTRY_PROJECT'],
      authToken: process.env['SENTRY_AUTH_TOKEN'],
      bundleSizeOptimizations: {
        excludeReplayIframe: true,
        excludeReplayShadowDom: true,
        excludeReplayWorker: true,
      },
      telemetry: false,
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
});
