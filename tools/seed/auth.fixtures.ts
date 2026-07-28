import { ACADEMIC_IDS } from './academic.fixtures';

export const E2E_STUDENT = {
  email: 'student@test.com',
  username: 'student',
  password: 'Password123!',

  firstName: 'Test',
  familyName: 'Student',

  facultyId: ACADEMIC_IDS.faculty,
  programId: ACADEMIC_IDS.program,
  programYearId: ACADEMIC_IDS.year1,
  groupCohortId: ACADEMIC_IDS.group2211,
  semigroupCohortId: ACADEMIC_IDS.semigroup2211A,
} as const;
