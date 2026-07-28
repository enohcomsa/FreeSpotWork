import { SeedContext } from './context';

export async function resetDatabase(context: SeedContext): Promise<void> {
  console.log('Dropping database...');

  await context.db.dropDatabase();

  console.log('Database dropped.');
}
