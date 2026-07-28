import { SeedContext } from './context';
import { ACTIVITIES_DATA } from './activities.fixtures';

export async function seedActivities(
  context: SeedContext,
): Promise<void> {
  await context.db
    .collection('timetable_activities')
    .insertMany(ACTIVITIES_DATA.timetableActivities);

  console.log('✓ Seeded timetable activities');
}
