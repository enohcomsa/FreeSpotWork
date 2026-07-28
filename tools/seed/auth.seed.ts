/* eslint-disable @nx/enforce-module-boundaries */

import { ObjectId } from 'mongodb';
import { signupToDbRecord } from '../../apps/freespot-backend/src/mappers';
import { hashPassword } from '../../apps/freespot-backend/src/utils/password';

import { E2E_STUDENT } from './auth.fixtures';
import { SeedContext } from './context';

export async function seedAuth(context: SeedContext): Promise<ObjectId> {
  const passwordHash = await hashPassword(E2E_STUDENT.password);

  const record = signupToDbRecord(
    {
      email: E2E_STUDENT.email,
      username: E2E_STUDENT.username,
      password: E2E_STUDENT.password,
    },
    passwordHash,
  );

  record.firstName = E2E_STUDENT.firstName;
  record.familyName = E2E_STUDENT.familyName;

  record.facultyId = E2E_STUDENT.facultyId;
  record.programId = E2E_STUDENT.programId;
  record.programYearId = E2E_STUDENT.programYearId;
  record.groupCohortId = E2E_STUDENT.groupCohortId;
  record.semigroupCohortId = E2E_STUDENT.semigroupCohortId;

  const result = await context.db
    .collection('users')
    .insertOne(record);

  console.log(`✓ Seeded user '${E2E_STUDENT.email}'`);

  return result.insertedId;
}
