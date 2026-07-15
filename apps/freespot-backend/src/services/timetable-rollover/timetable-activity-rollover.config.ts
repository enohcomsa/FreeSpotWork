import type { WeekDayT, WeekParityT } from "../../schemas/common.zod";

export type TimetableActivityRolloverConfig = {
  timezone: string;
  academicWeekStartsOn: "MONDAY";
  rolloverDay: "SATURDAY";
  rolloverHour: number;
  rolloverMinute: number;
  anchorWeekStartDate: string;
  anchorWeekParity: Exclude<WeekParityT, "BOTH">;
  schedulerCheckIntervalMs: number;
};

export const timetableActivityRolloverConfig: TimetableActivityRolloverConfig = {
  timezone: "Europe/Bucharest",
  academicWeekStartsOn: "MONDAY",
  rolloverDay: "SATURDAY",
  rolloverHour: 0,
  rolloverMinute: 0,
  anchorWeekStartDate: "2026-07-13",
  anchorWeekParity: "ODD",
  schedulerCheckIntervalMs: 6 * 60 * 60 * 1000,

};

export const WEEK_DAY_INDEX: Record<WeekDayT, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};
