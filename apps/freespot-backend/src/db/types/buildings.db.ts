import { ObjectId } from "mongodb";

export type BuildingDbBase = {
  name: string;
  address: string;
  specialEvent: boolean;
};

export type BuildingDbDoc = BuildingDbBase & { _id: ObjectId };
export type BuildingDbRecord = BuildingDbBase;
