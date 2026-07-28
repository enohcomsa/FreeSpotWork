import { ObjectId } from 'mongodb';

export const ACADEMIC_IDS = {
  faculty: new ObjectId('000000000000000000000001'),

  subjectProgramming: new ObjectId('000000000000000000000011'),
  subjectDatabases: new ObjectId('000000000000000000000012'),
  subjectNetworks: new ObjectId('000000000000000000000013'),

  program: new ObjectId('000000000000000000000101'),

  year1: new ObjectId('000000000000000000000201'),
  year2: new ObjectId('000000000000000000000202'),

  group2211: new ObjectId('000000000000000000000301'),
  group2212: new ObjectId('000000000000000000000302'),

  semigroup2211A: new ObjectId('000000000000000000000401'),
  semigroup2211B: new ObjectId('000000000000000000000402'),
};

export const ACADEMIC_DATA = {
  faculty: {
    _id: ACADEMIC_IDS.faculty,
    name: 'Faculty of Electronics, Telecommunications and Information Technology',
    shortName: 'ETTI',
    subjectList: [
      ACADEMIC_IDS.subjectProgramming,
      ACADEMIC_IDS.subjectDatabases,
      ACADEMIC_IDS.subjectNetworks,
    ],
  },

  subjects: [
    {
      _id: ACADEMIC_IDS.subjectProgramming,
      name: 'Programming',
      shortName: 'PRG',
    },
    {
      _id: ACADEMIC_IDS.subjectDatabases,
      name: 'Databases',
      shortName: 'DB',
    },
    {
      _id: ACADEMIC_IDS.subjectNetworks,
      name: 'Computer Networks',
      shortName: 'NET',
    },
  ],

  programs: [
    {
      _id: ACADEMIC_IDS.program,
      facultyId: ACADEMIC_IDS.faculty,
      name: 'Software Engineering',
      degree: 'lic',
      active: true,
    },
  ],

  programYears: [
    {
      _id: ACADEMIC_IDS.year1,
      programId: ACADEMIC_IDS.program,
      yearNumber: 1,
      label: '1',
    },
    {
      _id: ACADEMIC_IDS.year2,
      programId: ACADEMIC_IDS.program,
      yearNumber: 2,
      label: '2',
    },
  ],

  cohorts: [
    {
      _id: ACADEMIC_IDS.group2211,
      type: 'GROUP',
      name: '2211',
      programYearId: ACADEMIC_IDS.year1,
      parentGroupId: null,
    },
    {
      _id: ACADEMIC_IDS.group2212,
      type: 'GROUP',
      name: '2212',
      programYearId: ACADEMIC_IDS.year1,
      parentGroupId: null,
    },
    {
      _id: ACADEMIC_IDS.semigroup2211A,
      type: 'SEMIGROUP',
      name: '2211A',
      programYearId: ACADEMIC_IDS.year1,
      parentGroupId: ACADEMIC_IDS.group2211,
    },
    {
      _id: ACADEMIC_IDS.semigroup2211B,
      type: 'SEMIGROUP',
      name: '2211B',
      programYearId: ACADEMIC_IDS.year1,
      parentGroupId: ACADEMIC_IDS.group2211,
    },
  ],
} as const;
