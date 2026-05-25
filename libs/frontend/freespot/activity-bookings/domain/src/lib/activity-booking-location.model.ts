export type ActivityBookingSubject = {
  id: string;
  name: string;
  shortName?: string;
};

export type ActivityBookingRoom = {
  id: string;
  buildingId: string;
  floorId: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: string[];
};

export type ActivityBookingBuilding = {
  id: string;
  name: string;
  address: string;
};

export type ActivityBookingFloor = {
  id: string;
  buildingId: string;
  name: string;
};
