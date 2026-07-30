import 'dotenv/config';
import { withDb } from './helpers';
import { run as init } from './000-init';
import { run as dropFloorCounters } from './001-drop-floor-counters';

const dbName = process.env.MONGODB_DB;
if (!dbName) {
  throw new Error('Missing MONGODB_DB');
}

const appEnv = process.env.APP_ENV;
if (!appEnv) {
  throw new Error('Missing APP_ENV');
}

let uri: string;

switch (appEnv) {
  case 'local-dev':
  case 'local-e2e': {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(`Missing MONGODB_URI for APP_ENV=${appEnv}`);
    }

    uri = mongoUri;
    break;
  }

  case 'dev-atlas':
  case 'staging':
  case 'production': {
    const adminUri = process.env.MONGODB_ADMIN_URI;

    if (!adminUri) {
      throw new Error(`Missing MONGODB_ADMIN_URI for APP_ENV=${appEnv}`);
    }

    uri = adminUri;
    break;
  }

  default:
    throw new Error(`Unsupported APP_ENV: ${appEnv}`);
}

async function main() {
  await withDb(
    uri,
    async (db) => {
      await init(db);
      await dropFloorCounters(db);
    },
    dbName,
  );

  console.log(`✅ Migrations applied (env=${appEnv}, db=${dbName})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
