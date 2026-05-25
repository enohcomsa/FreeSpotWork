export interface ReschedulableBookingVm {
  id: string;
  label: string;
}

export interface RescheduleOptionCardVm {
  id: string;
  subjectName: string;
  buildingName: string;
  floorName: string;
  roomName: string;
  date: string;
  startHour: number;
  endHour: number;
  freeSpots: number;
}
