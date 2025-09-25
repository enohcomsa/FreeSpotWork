import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist'],
  },
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: [
                'scope:lib',
                'scope:service',
                'scope:http-service',
                'scope:ui',
                'scope:util',
                'scope:model',
              ],
            },
            {
              sourceTag: 'scope:lib',
              onlyDependOnLibsWithTags: [
                'scope:module',
                'scope:service',
                'scope:http-service',
                'scope:ui',
                'scope:util',
                'scope:model',
              ],
            },
            {
              sourceTag: 'scope:module',
              onlyDependOnLibsWithTags: ['scope:service', 'scope:ui', 'scope:util', 'scope:model'],
            },
            {
              sourceTag: 'scope:service',
              onlyDependOnLibsWithTags: ['scope:http-service', 'scope:util', 'scope:model'],
            },
            {
              sourceTag: 'scope:http-service',
              onlyDependOnLibsWithTags: ['scope:model'],
            },
            {
              sourceTag: 'scope:ui',
              onlyDependOnLibsWithTags: ['scope:module', 'scope:service', 'scope:ui', 'scope:util', 'scope:model'],
            },
            {
              sourceTag: 'scope:util',
              onlyDependOnLibsWithTags: ['scope:util', 'scope:model'],
            },
            {
              sourceTag: 'scope:model',
              onlyDependOnLibsWithTags: ['scope:model'],
            },
          ],
        },
      ],
    },
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
];
