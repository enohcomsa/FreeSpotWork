import { ActivityType } from '@free-spot/shared/domain';

export type ActivityBookingCardVm = {
  id: string;
  activityType: ActivityType;
  subjectName: string;
  buildingName: string;
  floorName: string;
  roomName: string;
  date: string;
  startHour: number;
  endHour: number;
};
