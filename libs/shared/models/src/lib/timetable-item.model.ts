import { WeekDay } from '@free-spot/enums';
import { TimetableActivityItemLegacy } from './timetable-activity-item.model';

/**
 * @deprecated Firebase-era nested model;
 * used only for backward compatibility with legacy timetable format.
 * Remove once all timetable data is migrated.
 */
export interface TimeTableItemLecagy {
  activities: TimetableActivityItemLegacy[];
  weekDay: WeekDay;
  date: Date;
}
