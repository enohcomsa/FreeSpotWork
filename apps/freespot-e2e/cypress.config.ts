import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { execSync } from 'child_process';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run freespot:serve:development',
        production: 'nx run freespot:serve:production',
      },
      ciWebServerCommand: 'nx run freespot:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on) {
      on('task', {
        seedDb() {
          execSync('npm run seed:freespot:e2e', {
            stdio: 'inherit',
          });

          return null;
        },
      });
    },
  },
});
