export interface AdminUniversityMapFloorCard {
  name: string;
  total: number;
  unavailable: number;
}

export interface AdminUniversityMapBuildingCard {
  id: string;
  name: string;
  address: string;
  floors: AdminUniversityMapFloorCard[];
}

export interface AdminUniversityMapBuilding {
  id: string;
  name: string;
  address: string;
}

export interface CreateAdminUniversityMapBuildingCmd {
  name: string;
  address: string;
}

export interface UpdateAdminUniversityMapBuildingCmd {
  name?: string;
  address?: string;
}

export interface AdminUniversityMapFloor {
  id: string;
  buildingId: string;
  name: string;
}

export interface AdminUniversityMapFloorVM {
  id: string;
  name: string;
  roomsCount: number;
}

export interface CreateAdminUniversityMapFloorCmd {
  buildingId: string;
  name: string;
}

export interface UpdateAdminUniversityMapFloorCmd {
  buildingId?: string;
  name?: string;
}

export interface AdminUniversityMapRoom {
  id: string;
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}

export interface AdminUniversityMapRoomVM {
  id: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
}

export interface CreateAdminUniversityMapRoomCmd {
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}

export interface UpdateAdminUniversityMapRoomCmd {
  buildingId?: string;
  floorId?: string;
  name?: string;
  totalSpotsNumber?: number;
  unavailableSpots?: number;
  subjectList?: string[];
}

export enum AdminUniversityMapActivityType {
  Laboratory = 'LABORATORY',
  Course = 'COURSE',
  Project = 'PROJECT',
  Seminar = 'SEMINAR',
  SpecialEvent = 'SPECIAL_EVENT',
}

export enum AdminUniversityMapWeekDay {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
}

export enum AdminUniversityMapWeekParity {
  Both = 'BOTH',
  Even = 'EVEN',
  Odd = 'ODD',
}

export interface AdminUniversityMapSubject {
  id: string;
  name: string;
  shortName: string;
}

export interface AdminUniversityMapTimetableActivity {
  id: string;
  roomId: string;
  subjectId: string;
  weekDay: AdminUniversityMapWeekDay;
  startHour: number;
  endHour: number;
  weekParity: AdminUniversityMapWeekParity;
  activityType: AdminUniversityMapActivityType;
}

export interface CreateAdminUniversityMapTimetableActivityCmd {
  roomId: string;
  subjectId: string;
  date: string;
  weekDay: AdminUniversityMapWeekDay;
  activityType: AdminUniversityMapActivityType;
  cohortIds: string[];
  startHour: number;
  endHour: number;
  weekParity: AdminUniversityMapWeekParity;
  capacity: number;
  reservedSpots: number;
  busySpots: number;
  freeSpots: number;
}
