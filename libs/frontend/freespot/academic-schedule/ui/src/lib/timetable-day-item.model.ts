import { TimetableActivityCardVM } from './timetable-activity-card.vm';

export interface TimetableDayItem {
  hourInterval: string;
  startHour: number;
  evenWeekActivity?: TimetableActivityCardVM;
  oddWeekActivity?: TimetableActivityCardVM;
  bothWeekActivity?: TimetableActivityCardVM;
}
