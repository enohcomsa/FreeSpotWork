import { ObjectId } from "mongodb";

export type FloorDbBase = {
  buildingId: ObjectId;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
};

export type FloorDbDoc    = FloorDbBase & { _id: ObjectId };
export type FloorDbRecord = FloorDbBase;
