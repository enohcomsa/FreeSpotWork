import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

import {
  ACTIVITY_TYPES,
  BOOKING_STATUSES,
  COHORT_TYPES,
  DEGREES,
  PREFERRED_LANGUAGES,
  PREFERRED_THEMES,
  SOURCE_TYPES,
  USER_ROLES,
  WEEK_DAYS,
  WEEK_PARITIES,
  TIMETABLE_ACTIVITY_ROLLOVER_JOB_STATUSES
} from "./common.constants";

extendZodWithOpenApi(z);

export const ObjectIdStr = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Expected a 24-char hex ObjectId string")
  .openapi("ObjectIdStr");

export const ISODateStr = z
  .string()
  .datetime({ offset: true })
  .openapi("ISODateStr");

export const BookingStatus = z
  .enum(BOOKING_STATUSES)
  .openapi("BookingStatus");

export const SourceType = z
  .enum(SOURCE_TYPES)
  .openapi("SourceType");

export const CohortType = z
  .enum(COHORT_TYPES)
  .openapi("CohortType");

export const Degree = z
  .enum(DEGREES)
  .openapi("Degree");

export const WeekDay = z
  .enum(WEEK_DAYS)
  .openapi("WeekDay");

export const ActivityType = z
  .enum(ACTIVITY_TYPES)
  .openapi("ActivityType");

export const WeekParity = z
  .enum(WEEK_PARITIES)
  .openapi("WeekParity");

export const UserRole = z
  .enum(USER_ROLES)
  .openapi("UserRole");

export const PreferredLanguage = z
  .enum(PREFERRED_LANGUAGES)
  .openapi("PreferredLanguage");

export const PreferredTheme = z
  .enum(PREFERRED_THEMES)
  .openapi("PreferredTheme");

export const RolloverJobStatus = z.enum(TIMETABLE_ACTIVITY_ROLLOVER_JOB_STATUSES);

export const SubjectIdArray = z
  .array(ObjectIdStr)
  .superRefine((arr, ctx) => {
    if (new Set(arr).size !== arr.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "subjectList must contain unique ids",
      });
    }
  })
  .openapi("SubjectIdArray");

export const Source = z
  .object({
    type: SourceType,
    id: ObjectIdStr,
  })
  .strict()
  .openapi("Source");


export type ObjectIdStrT = z.infer<typeof ObjectIdStr>;
export type ISODateStrT = z.infer<typeof ISODateStr>;

export type BookingStatusT = z.infer<typeof BookingStatus>;
export type SourceTypeT = z.infer<typeof SourceType>;
export type SourceT = z.infer<typeof Source>;

export type CohortTypeT = z.infer<typeof CohortType>;
export type DegreeT = z.infer<typeof Degree>;
export type SubjectIdArrayT = z.infer<typeof SubjectIdArray>;

export type WeekDayT = z.infer<typeof WeekDay>;
export type ActivityTypeT = z.infer<typeof ActivityType>;
export type WeekParityT = z.infer<typeof WeekParity>;

export type UserRoleT = z.infer<typeof UserRole>;
export type PreferredLanguageT = z.infer<typeof PreferredLanguage>;
export type PreferredThemeT = z.infer<typeof PreferredTheme>;


export type UserAuthLocalT = {
  hash: string; // argon2 PHC string
};

export type UserAuthT = {
  local?: UserAuthLocalT;
};

export type UserSecurityT = {
  tokenVersion: number;
};
