import { ObjectId } from 'mongodb';

import { ACADEMIC_IDS } from './academic.fixtures';
import { CAMPUS_IDS } from './campus.fixtures';
import { activityDate, activityWeekDay } from './date-utils';

export const ACTIVITY_IDS = {
  programmingLabOriginal: new ObjectId('000000000000000000002001'),
  programmingLabOption1: new ObjectId('000000000000000000002002'),
  programmingLabOption2: new ObjectId('000000000000000000002003'),

  databasesCourse: new ObjectId('000000000000000000002004'),
};

export const ACTIVITIES_DATA = {
  timetableActivities: [
    {
      _id: ACTIVITY_IDS.programmingLabOriginal,
      roomId: CAMPUS_IDS.roomP03,
      subjectId: ACADEMIC_IDS.subjectProgramming,

      date: activityDate(1),
      weekDay: activityWeekDay(1),

      activityType: 'LABORATORY',

      cohortIds: [
        ACADEMIC_IDS.group2211,
        ACADEMIC_IDS.semigroup2211A,
      ],

      startHour: 10,
      endHour: 12,

      weekParity: 'BOTH',

      capacity: 20,
      reservedSpots: 0,
      busySpots: 20,
      freeSpots: 0,
    },

    {
      _id: ACTIVITY_IDS.programmingLabOption1,
      roomId: CAMPUS_IDS.roomP04,
      subjectId: ACADEMIC_IDS.subjectProgramming,

      date: activityDate(2),
      weekDay: activityWeekDay(2),

      activityType: 'LABORATORY',

      cohortIds: [
        ACADEMIC_IDS.group2211,
        ACADEMIC_IDS.semigroup2211A,
      ],

      startHour: 10,
      endHour: 12,

      weekParity: 'BOTH',

      capacity: 20,
      reservedSpots: 2,
      busySpots: 6,
      freeSpots: 12,
    },

    {
      _id: ACTIVITY_IDS.programmingLabOption2,
      roomId: CAMPUS_IDS.room101,
      subjectId: ACADEMIC_IDS.subjectProgramming,

      date: activityDate(3),
      weekDay: activityWeekDay(3),

      activityType: 'LABORATORY',

      cohortIds: [
        ACADEMIC_IDS.group2211,
        ACADEMIC_IDS.semigroup2211A,
      ],

      startHour: 14,
      endHour: 16,

      weekParity: 'BOTH',

      capacity: 20,
      reservedSpots: 1,
      busySpots: 7,
      freeSpots: 12,
    },

    {
      _id: ACTIVITY_IDS.databasesCourse,
      roomId: CAMPUS_IDS.roomP03,
      subjectId: ACADEMIC_IDS.subjectDatabases,

      date: activityDate(1),
      weekDay: activityWeekDay(1),

      activityType: 'COURSE',

      cohortIds: [
        ACADEMIC_IDS.group2211,
      ],

      startHour: 8,
      endHour: 10,

      weekParity: 'BOTH',

      capacity: 60,
      reservedSpots: 3,
      busySpots: 25,
      freeSpots: 32,
    },
  ],
} as const;
