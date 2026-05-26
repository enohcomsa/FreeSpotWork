export type AdminEventType = 'SPECIAL';

export interface AdminSpecialEvent {
  id: string;
  name: string;
  date: string;
  startHour: number;
  buildingId: string;
  roomId: string;
  reservedSpots: number;
  type?: AdminEventType;
}

export interface CreateAdminSpecialEventCmd {
  name: string;
  date: string | null;
  startHour: number;
  buildingId: string;
  roomId: string;
  reservedSpots: number;
  type?: AdminEventType;
}

export interface UpdateAdminSpecialEventCmd {
  name?: string;
  date?: string | null;
  startHour?: number;
  buildingId?: string;
  roomId?: string;
  reservedSpots?: number;
  type?: AdminEventType;
}

export interface AdminEventsBuilding {
  id: string;
  name: string;
  address: string;
}

export interface AdminEventsRoom {
  id: string;
  name: string;
  buildingId: string;
  floorId: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}
