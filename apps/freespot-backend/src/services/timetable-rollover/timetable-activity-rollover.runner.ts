import { runDueTimetableActivityRollover } from "./timetable-activity-rollover-orchestrator.service";
import { timetableActivityRolloverConfig } from "./timetable-activity-rollover.config";

export async function runTimetableRolloverOnStartup(): Promise<void> {
  await runDueTimetableActivityRollover();
}

export function startTimetableRolloverScheduler(): NodeJS.Timeout {
  return setInterval(() => {
    void runDueTimetableActivityRollover().catch((error) => {
      console.error("Timetable rollover failed", error);
    });
  }, timetableActivityRolloverConfig.schedulerCheckIntervalMs);
};