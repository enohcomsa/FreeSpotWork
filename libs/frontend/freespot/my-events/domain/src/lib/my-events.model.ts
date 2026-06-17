import { ActivityType } from '@free-spot/shared/domain';
export interface MyEventsBooking {
  id: string;
  activityId: string | null;
  activityType: ActivityType;
}

export interface MyEventsEvent {
  id: string;
  name: string;
  date: string | null;
  startHour: number;
  buildingId: string | null;
  roomId: string | null;
}

export interface MyEventsBuilding {
  id: string;
  name: string;
}

export interface MyEventsFloor {
  id: string;
  name: string;
}

export interface MyEventsRoom {
  id: string;
  name: string;
  floorId: string | null;
}
