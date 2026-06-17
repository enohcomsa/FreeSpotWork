import { type AcademicScheduleRoom, type AcademicScheduleSubject, type TimetableActivity } from '@free-spot/academic-schedule/domain';
import { TimetableActivityCardVM } from './timetable-activity.vm';

export function toTimetableActivityCardVM(
  activity: TimetableActivity,
  rooms: AcademicScheduleRoom[],
  subjects: AcademicScheduleSubject[],
): TimetableActivityCardVM {
  const room = rooms.find((item) => item.id === activity.roomId);
  const subject = subjects.find((item) => item.id === activity.subjectId);

  return {
    id: activity.id,
    weekDay: activity.weekDay,
    startHour: activity.startHour,
    endHour: activity.endHour,
    weekParity: activity.weekParity,
    activityType: activity.activityType,
    roomName: room?.name ?? '',
    subjectItemShortName: subject?.shortName ?? subject?.name ?? '',
  };
}
