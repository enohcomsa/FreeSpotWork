import { ObjectId } from 'mongodb';

import { ACADEMIC_IDS } from './academic.fixtures';
import { ACTIVITY_IDS } from './activities.fixtures';

export const BOOKING_IDS = {
  programmingLab: new ObjectId('000000000000000000003001'),
};

export function createBookings(studentId: ObjectId) {
  return [
    {
      _id: BOOKING_IDS.programmingLab,

      activityId: ACTIVITY_IDS.programmingLabOriginal,
      userId: studentId,

      facultyId: ACADEMIC_IDS.faculty,
      programId: ACADEMIC_IDS.program,
      programYearId: ACADEMIC_IDS.year1,
      groupCohortId: ACADEMIC_IDS.group2211,
      semigroupCohortId: ACADEMIC_IDS.semigroup2211A,

      subjectId: ACADEMIC_IDS.subjectProgramming,
      activityType: 'LABORATORY',

      status: 'CONFIRMED',

      originalActivityId: null,
      isRescheduled: false,
      rescheduledAt: null,

      createdAt: new Date(),
      updatedAt: null,
    },
  ] as const;
}
