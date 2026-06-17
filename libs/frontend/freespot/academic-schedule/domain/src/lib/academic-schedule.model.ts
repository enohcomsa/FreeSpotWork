export interface AcademicScheduleSubject {
  id: string;
  name: string;
  shortName?: string;
}

export interface AcademicScheduleRoom {
  id: string;
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
}
