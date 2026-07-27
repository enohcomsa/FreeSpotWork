import { seedAuth } from './auth.seed';
import { createSeedContext, disposeSeedContext } from './context';
import { resetDatabase } from './reset';
import { seedSystem } from './system.seed';

async function main(): Promise<void> {
  const context = await createSeedContext();

  try {
    console.log(`Seeding database '${context.db.databaseName}'...`);

    await resetDatabase(context);

    await seedSystem(context);
    await seedAuth(context);

    console.log('Seed completed.');
  } finally {
    await disposeSeedContext(context);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
