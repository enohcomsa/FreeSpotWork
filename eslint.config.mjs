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
              sourceTag: 'platform:frontend',
              notDependOnLibsWithTags: ['platform:backend'],
            },
            {
              sourceTag: 'platform:backend',
              notDependOnLibsWithTags: ['platform:frontend'],
            },

            {
              sourceTag: 'scope:freespot',
              onlyDependOnLibsWithTags: ['scope:freespot', 'scope:shared', 'scope:core', 'scope:api'],
              notDependOnLibsWithTags: ['scope:meal-plan'],
            },
            {
              sourceTag: 'scope:meal-plan',
              onlyDependOnLibsWithTags: ['scope:meal-plan', 'scope:shared', 'scope:core', 'scope:api'],
              notDependOnLibsWithTags: ['scope:freespot'],
            },
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared', 'scope:api'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:api'],
            },
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: ['scope:api', 'scope:shared'],
            },

            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:util', 'type:infra', 'type:generated'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:domain', 'type:ui', 'type:util', 'type:infra', 'type:generated'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:domain', 'type:util', 'type:infra', 'type:generated'],
            },
            {
              sourceTag: 'type:domain',
              onlyDependOnLibsWithTags: ['type:domain', 'type:util', 'type:generated'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:domain', 'type:util', 'type:generated'],
              notDependOnLibsWithTags: ['type:data-access'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:generated',
              onlyDependOnLibsWithTags: ['type:generated', 'type:util'],
            },
            {
              sourceTag: 'type:infra',
              onlyDependOnLibsWithTags: ['type:infra', 'type:util', 'type:domain', 'type:generated'],
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
