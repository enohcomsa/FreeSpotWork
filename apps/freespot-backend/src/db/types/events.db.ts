import { ObjectId } from "mongodb";

export type EventTypeDTO = "SPECIAL";

export type EventDbBase = {
  type: EventTypeDTO;
  name: string;
  date: Date;
  startHour: number;
  buildingId: ObjectId;
  roomId: ObjectId;
  reservedSpots: number;
};

export type EventDbDoc = EventDbBase & { _id: ObjectId };
export type EventDbRecord = EventDbBase;
