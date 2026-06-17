import { type ActivityType, type WeekDay, type WeekParity } from '@free-spot/shared/domain';

export interface AdminRoomTimetableSubjectVm {
  id: string;
  shortName: string;
}

export interface AdminRoomTimetableActivityVm {
  id: string;
  subjectId: string;
  startHour: number;
  endHour: number;
  weekParity: WeekParity;
  activityType: ActivityType;
}

export interface AdminRoomTimetableItemVm {
  roomId: string;
  roomName: string;
  roomCapacity: number;
  day: WeekDay;
  subjects: AdminRoomTimetableSubjectVm[];
  activities: AdminRoomTimetableActivityVm[];
}

export interface CreateAdminRoomTimetableActivityVm {
  subjectId: string;
  startHour: number;
  endHour: number;
  weekDay: WeekDay;
  activityType: ActivityType;
  weekParity: WeekParity;
  capacity: number;
}
