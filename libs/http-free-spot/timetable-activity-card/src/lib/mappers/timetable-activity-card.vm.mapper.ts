import { TimetableActivityCardVM } from '@frontend/freespot/schedule/ui';
import { TimetableActivityCardDTO } from '@free-spot/api-client';
import { dtoToWeekDay, dtoToWeekParity, dtoToActivityType } from '@http-free-spot/timetable-activity';


export function toTimetableActivityCardVM(timetableActivity: TimetableActivityCardDTO): TimetableActivityCardVM {
  return {
    id: timetableActivity.id,
    weekDay: dtoToWeekDay(timetableActivity.weekDay),
    startHour: timetableActivity.startHour,
    endHour: timetableActivity.endHour,
    weekParity: dtoToWeekParity(timetableActivity.weekParity),
    activityType: dtoToActivityType(timetableActivity.activityType),
    roomName: timetableActivity.roomName,
    subjectItemShortName: timetableActivity.subjectItemShortName,
  }
}

