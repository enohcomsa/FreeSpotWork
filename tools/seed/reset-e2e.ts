import { E2E_STUDENT } from './auth.fixtures';
import { SeedContext } from './context';

export async function resetE2ECollections(
  context: SeedContext,
): Promise<void> {
  console.log('Resetting E2E collections...');

  // Remove the seeded E2E user
  await context.db.collection('users').deleteMany({
    email: E2E_STUDENT.email,
  });

  // Remove seeded bookings
  await context.db.collection('bookings').deleteMany({});

  // Remove seeded timetable activities
  await context.db
    .collection('timetable_activities')
    .deleteMany({});

  // Remove seeded campus data
  await context.db.collection('rooms').deleteMany({});
  await context.db.collection('floors').deleteMany({});
  await context.db.collection('buildings').deleteMany({});

  // Remove seeded academic data
  await context.db.collection('subjects').deleteMany({});
  await context.db.collection('cohorts').deleteMany({});
  await context.db.collection('program_years').deleteMany({});
  await context.db.collection('programs').deleteMany({});
  await context.db.collection('faculties').deleteMany({});
  await context.db.collection('timetable_activity_rollover_jobs').deleteMany({});

  console.log('✓ Reset E2E collections');
}
