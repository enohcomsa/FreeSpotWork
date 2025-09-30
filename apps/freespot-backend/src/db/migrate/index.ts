import 'dotenv/config';
import { withDb } from './helpers';
import { run as init } from './000-init';

async function main() {
  const uri = process.env.MONGODB_ADMIN_URI;
  if (!uri) throw new Error('Missing MONGODB_ADMIN_URI');
  await withDb(uri, init);
  console.log('✅ Migrations applied');
}
main().catch((e) => { console.error(e); process.exit(1); });
