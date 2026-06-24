/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../../node_modules/.vite/libs/frontend/freespot/shared/ui',
  plugins: [angular(), tsconfigPaths()],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ tsconfigPaths() ],
  // },
  test: {
    name: 'freespot-shared-ui',
    watch: false,
    globals: true,
    passWithNoTests: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../../coverage/libs/frontend/freespot/shared/ui',
      provider: 'v8' as const,
    },
  },
}));
