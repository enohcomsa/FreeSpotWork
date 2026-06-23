import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../../../node_modules/.vite/libs/frontend/freespot/admin-university-map/domain',
  plugins: [tsconfigPaths()],
  test: {
    name: 'freespot-admin-university-map-domain',
    watch: false,
    globals: true,
    passWithNoTests: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../../../coverage/libs/frontend/freespot/admin-university-map/domain',
      provider: 'v8' as const,
    },
  },
}));
