export const referenceCollections = [
  'buildings',
  'floors',
  'rooms',
  'faculties',
  'programs',
  'program_years',
  'cohorts',
  'subjects',
  'events',
] as const;

export type ReferenceCollection = (typeof referenceCollections)[number];
