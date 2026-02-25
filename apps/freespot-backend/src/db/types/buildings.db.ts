import { ObjectId } from "mongodb";

export type BuildingDbBase = {
  name: string;
  address: string;
};

export type BuildingDbDoc = BuildingDbBase & { _id: ObjectId };
export type BuildingDbRecord = BuildingDbBase;
