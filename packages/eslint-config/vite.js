import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { reactRefresh } from "eslint-plugin-react-refresh";
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { config as baseConfig } from './base.js';

export const config = defineConfig(
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    rules: {
      'react/no-unescaped-entities': 'off',
      'react/no-children-prop': [
        'warn',
        {
          allowFunctions: true,
        },
      ],
    },
  },
  {
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
        },
      ],
    },
  },
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite({
    extraHOCs: ["createFileRoute", "createRootRouteWithContext", "createRootRoute", "withForm"],
  }),
);
