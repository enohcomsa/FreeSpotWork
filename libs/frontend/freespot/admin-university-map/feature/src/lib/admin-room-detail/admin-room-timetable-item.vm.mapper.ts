import {
  type AdminUniversityMapSubject,
  type AdminUniversityMapTimetableActivity,
  type CreateAdminUniversityMapTimetableActivityCmd,
} from '@free-spot/admin-university-map/domain';
import {
  type AdminRoomTimetableActivityVm,
  type AdminRoomTimetableItemVm,
  type AdminRoomTimetableSubjectVm,
  type CreateAdminRoomTimetableActivityVm,
} from '@free-spot/admin-university-map/ui';
import { type WeekDay } from '@free-spot/shared/domain';

export function toAdminRoomTimetableItemVm(params: {
  roomId: string;
  roomName: string;
  roomCapacity: number;
  day: WeekDay;
  subjects: AdminUniversityMapSubject[];
  activities: AdminUniversityMapTimetableActivity[];
}): AdminRoomTimetableItemVm {
  return {
    roomId: params.roomId,
    roomName: params.roomName,
    roomCapacity: params.roomCapacity,
    day: params.day,
    subjects: params.subjects.map(toAdminRoomTimetableSubjectVm),
    activities: params.activities.map(toAdminRoomTimetableActivityVm),
  };
}

export function createAdminRoomTimetableActivityVmToCmd(
  vm: CreateAdminRoomTimetableActivityVm,
  roomId: string,
): CreateAdminUniversityMapTimetableActivityCmd {
  return {
    roomId,
    subjectId: vm.subjectId,
    date: new Date().toISOString(),
    weekDay: vm.weekDay,
    activityType: vm.activityType,
    cohortIds: [],
    startHour: vm.startHour,
    endHour: vm.endHour,
    weekParity: vm.weekParity,
    capacity: vm.capacity,
    reservedSpots: 0,
    busySpots: 0,
    freeSpots: vm.capacity,
  };
}

function toAdminRoomTimetableSubjectVm(subject: AdminUniversityMapSubject): AdminRoomTimetableSubjectVm {
  return {
    id: subject.id,
    shortName: subject.shortName,
  };
}

function toAdminRoomTimetableActivityVm(activity: AdminUniversityMapTimetableActivity): AdminRoomTimetableActivityVm {
  return {
    id: activity.id,
    subjectId: activity.subjectId,
    startHour: activity.startHour,
    endHour: activity.endHour,
    weekParity: activity.weekParity,
    activityType: activity.activityType,
  };
}
