/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../../node_modules/.vite/libs/frontend/freespot/academic-schedule/data-access',
  plugins: [angular(), tsconfigPaths()],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ tsconfigPaths() ],
  // },
  test: {
    name: 'freespot-academic-schedule-data-access',
    watch: false,
    globals: true,
    passWithNoTests: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      reportsDirectory: '../../../../../coverage/libs/frontend/freespot/academic-schedule/data-access',
      provider: 'v8' as const,
    },
  },
}));
