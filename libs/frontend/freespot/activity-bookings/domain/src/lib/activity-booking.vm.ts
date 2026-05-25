import { type ActivityBookingActivityType } from './activity-booking.model';

export type ActivityBookingCardVm = {
  id: string;
  activityType: ActivityBookingActivityType;
  subjectName: string;
  buildingName: string;
  floorName: string;
  roomName: string;
  date: string;
  startHour: number;
  endHour: number;
};
