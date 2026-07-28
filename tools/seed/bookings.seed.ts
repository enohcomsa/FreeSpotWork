import { ObjectId } from 'mongodb';

import { SeedContext } from './context';
import { createBookings } from './bookings.fixtures';

export async function seedBookings(
  context: SeedContext,
  studentId: ObjectId,
): Promise<void> {
  await context.db
    .collection('bookings')
    .insertMany(createBookings(studentId));

  console.log('✓ Seeded bookings');
}
