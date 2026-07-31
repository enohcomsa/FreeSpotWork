import { seedAcademic } from './academic.seed';
import { seedActivities } from './activities.seed';
import { seedAuth } from './auth.seed';
import { seedBookings } from './bookings.seed';
import { seedCampus } from './campus.seed';
import { createSeedContext, disposeSeedContext } from './context';
import { resetDatabase } from './reset';
import { resetE2ECollections } from './reset-e2e';
import { seedSystem } from './system.seed';

async function main(): Promise<void> {
  const context = await createSeedContext();
  const isStaging = process.env.APP_ENV === 'staging';

  try {
    console.log(`Seeding database '${context.db.databaseName}'...`);


    if (isStaging) {
      await resetE2ECollections(context);
    } else {
      await resetDatabase(context);
    }

    await seedSystem(context);

    await seedAcademic(context);
    await seedCampus(context);
    await seedActivities(context);
    const studentId = await seedAuth(context);
    await seedBookings(context, studentId);

    console.log('Seed completed.');
  } finally {
    await disposeSeedContext(context);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
