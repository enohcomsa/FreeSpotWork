export interface Room {
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
  id: string;
}
