import { SeedContext } from './context';
import { CAMPUS_DATA } from './campus.fixtures';

export async function seedCampus(
  context: SeedContext,
): Promise<void> {
  await context.db
    .collection('buildings')
    .insertMany(CAMPUS_DATA.buildings);

  await context.db
    .collection('floors')
    .insertMany(CAMPUS_DATA.floors);

  await context.db
    .collection('rooms')
    .insertMany(CAMPUS_DATA.rooms);

  console.log('✓ Seeded campus data');
}
