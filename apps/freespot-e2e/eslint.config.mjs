import { defineConfig } from 'eslint/config';
import pluginCypress from 'eslint-plugin-cypress';
import baseConfig from '../../eslint.config.mjs';

export default defineConfig([
  {
    ignores: ['**/dist'],
  },
  ...baseConfig,
  {
    files: ['**/*.cy.{ts,tsx,js,jsx}', 'cypress/**/*.{ts,tsx,js,jsx}'],
    extends: [pluginCypress.configs.recommended],
    rules: {},
  },
]);
