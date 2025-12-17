import { ActivityTypeDTO, TimetableActivityCardDTO, WeekDayDTO, WeekParityDTO } from '@free-spot/api-client';
import { TimetableActivityCardVM } from './timetable-activity-card.vm';
import { ActivityType, WeekDay, WeekParity } from '@free-spot/enums';

export function toTimetableActivityCardVM(timetableActivity: TimetableActivityCardDTO): TimetableActivityCardVM {
  return {
    id: timetableActivity.id,
    weekDay: toWeekDay(timetableActivity.weekDay),
    startHour: timetableActivity.startHour,
    endHour: timetableActivity.endHour,
    weekParity: toWeekParity(timetableActivity.weekParity),
    activityType: toActivityType(timetableActivity.activityType),
    roomName: timetableActivity.roomName,
    subjectItemShortName: timetableActivity.subjectItemShortName,
  }
}


const toWeekDay = (weekDayDto: WeekDayDTO): WeekDay => WeekDay[weekDayDto as keyof typeof WeekDayDTO];
const toActivityType = (activityTypeDto: ActivityTypeDTO): ActivityType => ActivityType[activityTypeDto as keyof typeof ActivityType];
const toWeekParity = (weekParityDto: WeekParityDTO): WeekParity => WeekParity[weekParityDto as keyof typeof WeekParity];
