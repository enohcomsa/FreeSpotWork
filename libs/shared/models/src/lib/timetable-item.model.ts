import { WeekDay } from '@free-spot/enums';
import { TimetableActivityItem } from './timetable-activity-item.model';

export interface TimeTableItem {
  activities: TimetableActivityItem[];
  weekDay: WeekDay;
}
