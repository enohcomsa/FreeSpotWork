import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['**/dist'],
  },

  ...baseConfig,

  ...nx.configs['flat/angular'],

  ...nx.configs['flat/angular-template'],

  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'free-spot',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'free-spot',
          style: 'kebab-case',
        },
      ],
    },
  },

  {
    files: ['**/*.html'],
    rules: {},
  },
];
