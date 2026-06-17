export interface EventsCatalogBooking {
  activityId: string | null;
}

export interface EventsCatalogBuilding {
  id: string;
  name: string;
  address: string;
}

export interface EventsCatalogEvent {
  id: string;
  name: string;
  date: string;
  buildingId: string;
  roomId: string;
  reservedSpots: number;
}

export interface EventsCatalogRoom {
  id: string;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
}
