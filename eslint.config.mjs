import nx from '@nx/eslint-plugin';
import globals from 'globals';
import { dependencyBoundaries } from './tools/eslint/dependency-boundaries.mjs';

export default [
  {
    ignores: [
      '**/dist',
      '**/libs/_free-spot-client-api/**',
      '**/vitest.config.*.timestamp*',
    ],
  },

  {
    plugins: {
      '@nx': nx,
    },
  },

  ...nx.configs['flat/typescript'],

  ...nx.configs['flat/javascript'],

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: dependencyBoundaries.allow,
          depConstraints: dependencyBoundaries.depConstraints,
        },
      ],
    },
  },

  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.vitest,
      },
    },
  },
];
