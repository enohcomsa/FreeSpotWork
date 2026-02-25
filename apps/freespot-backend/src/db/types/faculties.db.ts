import { ObjectId } from "mongodb";

export type FacultyDbBase = {
  name: string;
  shortName: string;
  subjectList: ObjectId[];
};

export type FacultyDbDoc = FacultyDbBase & { _id: ObjectId };
export type FacultyDbRecord = FacultyDbBase;
