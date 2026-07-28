/* eslint-disable @nx/enforce-module-boundaries */
import type { WeekDayT } from '../../apps/freespot-backend/src/schemas/common.zod';

export function activityDate(daysFromNow: number): string {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);

  return date.toISOString();
}

export function activityWeekDay(daysFromNow: number): WeekDayT {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);

  const weekDays: WeekDayT[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  return weekDays[date.getDay()];
}

export function activityDateTime(
  daysFromNow: number,
  hour: number,
): Date {
  const date = new Date();

  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);

  return date;
}
