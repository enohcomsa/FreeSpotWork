export const BOOKING_STATUSES = [
  "CONFIRMED",
  "WAITLISTED",
  "CANCELLED",
] as const;

export const SOURCE_TYPES = [
  "ROOM_TIMETABLE",
  "COHORT_TIMETABLE",
  "EVENT",
] as const;

export const COHORT_TYPES = [
  "GROUP",
  "SEMIGROUP",
] as const;

export const DEGREES = [
  "lic",
  "master",
  "doct",
] as const;

export const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const ACTIVITY_TYPES = [
  "LABORATORY",
  "COURSE",
  "PROJECT",
  "SEMINAR",
  "SPECIAL_EVENT",
] as const;

export const WEEK_PARITIES = [
  "BOTH",
  "EVEN",
  "ODD",
] as const;

export const USER_ROLES = [
  "ADMIN",
  "MEMBER",
] as const;

export const PREFERRED_LANGUAGES = [
  "en",
  "ro",
] as const;

export const PREFERRED_THEMES = [
  "DARK",
  "LIGHT",
] as const;

export const TIMETABLE_ACTIVITY_ROLLOVER_JOB_STATUSES = [
  "IDLE",
  "RUNNING",
  "FAILED",
] as const;
