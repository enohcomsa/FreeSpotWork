import { SeedContext } from './context';
import { ACADEMIC_DATA } from './academic.fixtures';

export async function seedAcademic(
  context: SeedContext,
): Promise<void> {
  await context.db
    .collection('subjects')
    .insertMany(ACADEMIC_DATA.subjects);

  await context.db
    .collection('faculties')
    .insertOne(ACADEMIC_DATA.faculty);

  await context.db
    .collection('programs')
    .insertMany(ACADEMIC_DATA.programs);

  await context.db
    .collection('program_years')
    .insertMany(ACADEMIC_DATA.programYears);

  await context.db
    .collection('cohorts')
    .insertMany(ACADEMIC_DATA.cohorts);

  console.log('✓ Seeded academic data');
}
