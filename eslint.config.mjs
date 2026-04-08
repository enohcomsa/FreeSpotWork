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
    ignores: ['**/dist', '**/libs/_free-spot-client-api/**'],
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
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:page',
                'type:presentation',
                'type:service',
                'type:http',
                'type:ui',
                'type:domain',
                'type:shared',
                'type:util',
                'type:api-client',
              ],
            },
            {
              sourceTag: 'type:page',
              onlyDependOnLibsWithTags: [
                'type:presentation',
                'type:service',
                'type:ui',
                'type:domain',
                'type:shared',
                'type:util',
              ],
            },
            {
              sourceTag: 'type:presentation',
              onlyDependOnLibsWithTags: ['type:domain'],
            },
            {
              sourceTag: 'type:service',
              onlyDependOnLibsWithTags: ['type:http', 'type:domain', 'type:shared', 'type:util', 'type:presentation'],
            },
            {
              sourceTag: 'type:http',
              onlyDependOnLibsWithTags: ['type:http', 'type:shared', 'type:util', 'type:api-client', 'type:presentation', 'type:domain'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:shared', 'type:util', 'type:domain', 'type:service', 'type:presentation'],
            },
            {
              sourceTag: 'type:domain',
              onlyDependOnLibsWithTags: ['type:domain', 'type:shared', 'type:util'],
            },
            {
              sourceTag: 'type:shared',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
          ]
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
