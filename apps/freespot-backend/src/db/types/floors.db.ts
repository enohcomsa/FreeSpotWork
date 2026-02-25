import { ObjectId } from "mongodb";

export type FloorDbBase = {
  buildingId: ObjectId;
  name: string;
};

export type FloorDbDoc    = FloorDbBase & { _id: ObjectId };
export type FloorDbRecord = FloorDbBase;
