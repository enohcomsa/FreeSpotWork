import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const ObjectIdStr = z.string().regex(/^[0-9a-fA-F]{24}$/, "Expected a 24-char hex ObjectId string").openapi("ObjectIdStr");
export const ISODateStr = z.string().datetime({ offset: true }).openapi("ISODateStr");

export const BookingStatus = z.enum(["CONFIRMED", "WAITLISTED", "CANCELLED"]).openapi("BookingStatus");
export const SourceType = z.enum(["ROOM_TIMETABLE", "COHORT_TIMETABLE", "EVENT"]).openapi("SourceType");
export const CohortType = z.enum(["GROUP", "SEMIGROUP"]).openapi("CohortType");
export const Degree = z.enum(["lic", "master", "doct"]).openapi("Degree");
export const WeekDay = z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]).openapi("WeekDay");
export const ActivityType = z.enum(["LABORATORY", "COURSE", "PROJECT", "SEMINAR", "SPECIAL_EVENT"]).openapi("ActivityType");
export const WeekParity = z.enum(["BOTH", "EVEN", "ODD"]).openapi("WeekParity");
export const UserRole = z.enum(["ADMIN", "MEMBER"]).openapi("UserRole");
export const PreferredLanguage = z.enum(["en", "ro"]).openapi("PreferredLanguage");
export const PreferredTheme = z.enum(["DARK", "LIGHT"]).openapi("PreferredTheme");

export const SubjectIdArray = z.array(ObjectIdStr).superRefine((arr, ctx) => {
  if (new Set(arr).size !== arr.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "subjectList must contain unique ids" });
}).openapi("SubjectIdArray");

export const CohortIdArray = z.array(ObjectIdStr).superRefine((arr, ctx) => {
  if (new Set(arr).size !== arr.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "cohortIds must contain unique ids" });
}).openapi("CohortIdArray");

export const Source = z.object({ type: SourceType, id: ObjectIdStr }).strict().openapi("Source");

export type ObjectIdStrT = z.infer<typeof ObjectIdStr>;
export type ISODateStrT = z.infer<typeof ISODateStr>;
export type BookingStatusT = z.infer<typeof BookingStatus>;
export type SourceTypeT = z.infer<typeof SourceType>;
export type SourceT = z.infer<typeof Source>;
export type CohortTypeT = z.infer<typeof CohortType>;
export type DegreeT = z.infer<typeof Degree>;
export type SubjectIdArrayT = z.infer<typeof SubjectIdArray>;
export type CohortIdArrayT = z.infer<typeof CohortIdArray>;
export type WeekDayT = z.infer<typeof WeekDay>;
export type ActivityTypeT = z.infer<typeof ActivityType>;
export type WeekParityT = z.infer<typeof WeekParity>;
export type UserRoleT = z.infer<typeof UserRole>;
export type PreferredLanguageT = z.infer<typeof PreferredLanguage>;
export type PreferredThemeT = z.infer<typeof PreferredTheme>;
