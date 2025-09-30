import { z } from "zod";

export const ObjectIdStr = z.string().regex(/^[0-9a-fA-F]{24}$/, "Expected a 24-char hex ObjectId string");
export const ISODateStr = z.string().datetime({ offset: true });
export const BookingStatus = z.enum(["CONFIRMED", "WAITLISTED", "CANCELLED"]);
export const SourceType = z.enum(["ROOM_TIMETABLE", "COHORT_TIMETABLE", "EVENT"]);
export const Source = z.object({ type: SourceType, id: ObjectIdStr, }).strict();
export const CohortType = z.enum(["GROUP", "SEMIGROUP"]);
export const Degree = z.enum(["lic", "master", "doct"]);
export const SubjectIdArray = z.array(ObjectIdStr).superRefine((arr, ctx) => {
  const set = new Set(arr);
  if (set.size !== arr.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "subjectList must contain unique ids" });
  }
});
export const WeekDay = z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",]);
export const ActivityType = z.enum(["LABORATORY", "COURSE", "PROJECT", "SEMINAR", "SPECIAL_EVENT",]);
export const WeekParity = z.enum(["BOTH", "EVEN", "ODD"]);
export const CohortIdArray = z.array(ObjectIdStr).superRefine((arr, ctx) => {
  const set = new Set(arr);
  if (set.size !== arr.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "cohortIds must contain unique ids" });
  }
});
export const UserRole = z.enum(["ADMIN", "MEMBER"]);
export const PreferredLanguage = z.enum(["en", "ro"]);
export const PreferredTheme = z.enum(["DARK", "LIGHT"]);


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
