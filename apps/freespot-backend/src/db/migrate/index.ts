import 'dotenv/config';
import { withDb } from './helpers';
import { run as init } from './000-init';
import { run as dropFloorCounters } from "./001-drop-floor-counters";

const dbName = process.env.MONGODB_DB;

async function main() {
  const uri = process.env.MONGODB_ADMIN_URI;
  if (!uri) throw new Error('Missing MONGODB_ADMIN_URI');
  await withDb(uri, async (db) => {
    await init(db);               // creates/updates collections as they are now
    await dropFloorCounters(db);  // unsets fields, then reapplies updated floorsSpec
  }, dbName);
  console.log('✅ Migrations applied');
}
main().catch((e) => { console.error(e); process.exit(1); });
