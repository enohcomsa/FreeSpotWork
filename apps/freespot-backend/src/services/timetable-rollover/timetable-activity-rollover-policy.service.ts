import type { WeekDayT, WeekParityT } from "../../schemas/common.zod";
import {
  timetableActivityRolloverConfig,
  WEEK_DAY_INDEX,
} from "./timetable-activity-rollover.config";

export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + diff);

  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getActivityDateForWeek(
  weekStart: Date,
  weekDay: WeekDayT,
): Date {
  return addDays(weekStart, WEEK_DAY_INDEX[weekDay]);
}

export function getWeekParity(
  weekStart: Date,
  config = timetableActivityRolloverConfig,
): Exclude<WeekParityT, "BOTH"> {
  const anchor = new Date(`${config.anchorWeekStartDate}T00:00:00.000Z`);
  const diffMs = weekStart.getTime() - anchor.getTime();
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  const isSameParity = Math.abs(diffWeeks) % 2 === 0;

  if (isSameParity) {
    return config.anchorWeekParity;
  }

  return config.anchorWeekParity === "ODD" ? "EVEN" : "ODD";
}

export function matchesWeekParity(
  activityParity: WeekParityT,
  weekStart: Date,
  config = timetableActivityRolloverConfig,
): boolean {
  if (activityParity === "BOTH") {
    return true;
  }

  return activityParity === getWeekParity(weekStart, config);
}

export function getNextActivityDate(
  currentDate: Date,
  weekDay: WeekDayT,
  weekParity: WeekParityT,
  targetWeekStart: Date,
  config = timetableActivityRolloverConfig,
): Date {
  let candidateWeekStart = targetWeekStart;

  while (true) {
    const candidateDate = getActivityDateForWeek(candidateWeekStart, weekDay);

    if (
      candidateDate > currentDate &&
      matchesWeekParity(weekParity, candidateWeekStart, config)
    ) {
      return candidateDate;
    }

    candidateWeekStart = addDays(candidateWeekStart, 7);
  }
}

export function getLatestDueRolloverAt(now: Date, config = timetableActivityRolloverConfig): Date | null {
  const currentWeekStart = getWeekStart(now);
  const currentWeekRolloverAt = addDays(currentWeekStart, 5);

  currentWeekRolloverAt.setHours(
    config.rolloverHour,
    config.rolloverMinute,
    0,
    0,
  );

  if (now >= currentWeekRolloverAt) {
    return currentWeekRolloverAt;
  }

  const previousWeekStart = addDays(currentWeekStart, -7);
  const previousWeekRolloverAt = addDays(previousWeekStart, 5);

  previousWeekRolloverAt.setHours(
    config.rolloverHour,
    config.rolloverMinute,
    0,
    0,
  );

  return previousWeekRolloverAt;
}
