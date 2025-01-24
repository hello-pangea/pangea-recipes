import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), viteReact()],
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
