/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../../node_modules/.vite/libs/frontend/freespot/admin-user-access/data-access',
  plugins: [angular(), tsconfigPaths()],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ tsconfigPaths() ],
  // },
  test: {
    name: 'freespot-admin-user-access-data-access',
    watch: false,
    globals: true,
    passWithNoTests: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../../coverage/libs/frontend/freespot/admin-user-access/data-access',
      provider: 'v8' as const,
    },
  },
}));
