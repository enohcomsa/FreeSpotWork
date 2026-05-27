import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

const slices = [
  'academic-schedule',
  'activity-bookings',
  'activity-rescheduling',
  'admin-academic-structure',
  'admin-events',
  'admin-timetabling',
  'admin-university-map',
  'admin-user-access',
  'event-registration',
  'events-catalog',
  'my-events',
  'university-map',
  'user-setup',
];

const sharedDomainAccessBySlice = {
  'admin-university-map': ['shared-domain:university-map'],
  'university-map': ['shared-domain:university-map'],
};

const sliceAccess = slices.map((slice) => ({
  sourceTag: `slice:${slice}`,
  onlyDependOnLibsWithTags: [
    `slice:${slice}`,
    'slice:core',
    'slice:shared',
    'scope:shared',
    'scope:api',
    ...(sharedDomainAccessBySlice[slice] ?? []),
  ],
}));

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
              allSourceTags: ['shared-domain:university-map'],
              onlyDependOnLibsWithTags: ['shared-domain:university-map', 'slice:shared', 'scope:shared'],
            },

            ...sliceAccess,

            {
              sourceTag: 'slice:core',
              onlyDependOnLibsWithTags: ['slice:core', 'slice:shared', 'scope:shared', 'scope:api'],
            },
            {
              sourceTag: 'slice:shared',
              onlyDependOnLibsWithTags: ['slice:shared'],
            },

            {
              sourceTag: 'role:composition',
              onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:util', 'slice:core', 'slice:shared', 'scope:shared'],
            },

            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:feature', 'type:domain', 'type:data-access', 'type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:domain', 'type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:domain', 'type:util', 'type:api-client'],
            },
            {
              sourceTag: 'type:domain',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:domain', 'type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:api-client',
              onlyDependOnLibsWithTags: ['type:api-client'],
            },

            {
              sourceTag: 'scope:freespot',
              onlyDependOnLibsWithTags: ['scope:freespot', 'scope:shared', 'scope:api'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: ['scope:api'],
            },

            {
              sourceTag: 'platform:frontend',
              notDependOnLibsWithTags: ['platform:backend'],
            },
            {
              sourceTag: 'platform:backend',
              notDependOnLibsWithTags: ['platform:frontend'],
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
