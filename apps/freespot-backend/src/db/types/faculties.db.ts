import { ObjectId } from "mongodb";

export type FacultyDbBase = {
  name: string;
  shortName: string;
};

export type FacultyDbDoc = FacultyDbBase & { _id: ObjectId };
export type FacultyDbRecord = FacultyDbBase;
