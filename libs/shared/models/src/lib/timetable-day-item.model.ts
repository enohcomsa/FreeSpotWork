import { TimetableActivityItem } from './timetable-activity-item.model';

export interface TimetableDayItem {
  hourInterval: string;
  startHour: number;
  evenWeekActivity?: TimetableActivityItem;
  oddWeekActivity?: TimetableActivityItem;
  bothWeekActivity?: TimetableActivityItem;
}
