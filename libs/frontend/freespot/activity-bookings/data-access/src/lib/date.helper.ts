import { ActivityBookingActivity } from "@free-spot/activity-bookings/domain";

export function getActivityStartDate(activity: ActivityBookingActivity): Date {
  const date = new Date(activity.date);
  date.setHours(activity.startHour, 0, 0, 0);
  return date;
}

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
