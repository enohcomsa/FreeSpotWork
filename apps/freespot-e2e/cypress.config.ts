import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { execSync } from 'child_process';

import { defineConfig } from 'cypress';

const target = process.env['CYPRESS_TARGET'] ?? 'local-e2e';

const environments = {
  'local-e2e': {
    baseUrl: 'http://localhost:4200',
    seedCommand: 'npm run seed:freespot:local-e2e',
    webServerCommand: 'nx run freespot:serve:local-e2e',
  },
  staging: {
    baseUrl: 'https://freespot-staging.netlify.app',
    seedCommand: 'npm run seed:freespot:staging',
    webServerCommand: undefined,
  },
} as const;

type Target = keyof typeof environments;

if (!(target in environments)) {
  throw new Error(`Unsupported Cypress target: ${target}`);
}

const environment = environments[target as Target];

console.log(`Running Cypress against ${target}`);

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run freespot:serve:local-e2e',
        production: 'nx run freespot:serve:production',
      },
      ciWebServerCommand: 'nx run freespot:serve-static',
    }),
    baseUrl: environment.baseUrl,
    setupNodeEvents(on) {
      on('task', {
        seedDb() {
          execSync(environment.seedCommand, {
            stdio: 'inherit',
          });

          return null;
        },
      });
    },
  },
});
