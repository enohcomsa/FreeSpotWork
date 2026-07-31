import { ACADEMIC_IDS } from './academic.fixtures';


const APP_ENV = process.env.APP_ENV;

const isStaging = APP_ENV === 'staging';

export const E2E_STUDENT = {
  email: isStaging
    ? 'student@staging.freespot'
    : 'student@local.e2e',

  username: 'Student',
  password: 'Password123!',

  firstName: 'Student',
  familyName: 'User',

  facultyId: ACADEMIC_IDS.faculty,
  programId: ACADEMIC_IDS.program,
  programYearId: ACADEMIC_IDS.year1,
  groupCohortId: ACADEMIC_IDS.group2211,
  semigroupCohortId: ACADEMIC_IDS.semigroup2211A,
} as const;

