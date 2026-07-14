import {
  listTimetableActivitiesBeforeDate,
  updateTimetableActivityDate,
} from "../../repos/timetable-activities.repo";
import {
  getNextActivityDate,
  getWeekStart,
} from "./timetable-activity-rollover-policy.service";

export async function executeTimetableActivityRollover(rolloverAt: Date): Promise<void> {
  const targetWeekStart = getWeekStart(rolloverAt);
  targetWeekStart.setDate(targetWeekStart.getDate() + 7);

  const outdatedActivities = await listTimetableActivitiesBeforeDate(targetWeekStart);

  for (const activity of outdatedActivities) {
    const nextDate = getNextActivityDate(
      new Date(activity.date),
      activity.weekDay,
      activity.weekParity,
      targetWeekStart,
    );

    await updateTimetableActivityDate(activity._id.toHexString(), nextDate);
  }
}
