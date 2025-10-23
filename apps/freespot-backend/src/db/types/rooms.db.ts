import { ObjectId } from "mongodb";

export type RoomDbBase = {
  buildingId: ObjectId;
  floorId: ObjectId;
  name: string;
  totalSpotsNumber: number;
  unavailableSpots: number;
  subjectList: ObjectId[];
};

export type RoomDbDoc = RoomDbBase & { _id: ObjectId };
export type RoomDbRecord = RoomDbBase;
