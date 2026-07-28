// tools/seed/system.seed.ts

import { SeedContext } from './context';

const TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID = 'timetable-activity-rollover' as const;

export async function seedSystem(context: SeedContext): Promise<void> {
  const now = new Date();

  await context.db.collection('timetable_activity_rollover_jobs').insertOne({
    _id: TIMETABLE_ACTIVITY_ROLLOVER_JOB_ID,
    lastSuccessfulRunAt: null,
    lastProcessedRolloverAt: null,
    status: 'IDLE',
    createdAt: now,
    updatedAt: now,
  });

  console.log('✓ Seeded timetable rollover job');
}
