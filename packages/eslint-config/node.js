import globals from 'globals';
import tseslint from 'typescript-eslint';
import { config as baseConfig } from './base.js';

export const config = tseslint.config(...baseConfig, {
  languageOptions: {
    ecmaVersion: 2023,
    globals: globals.node,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-unsafe-call': 'off',
    'eslint@typescript-eslint/no-unsafe-assignment': 'off',
  },
});
