import { ObjectId } from "mongodb";

export type SubjectDbBase = {
  name: string;
  shortName: string;
};

export type SubjectDbDoc = SubjectDbBase & { _id: ObjectId };
export type SubjectDbRecord = SubjectDbBase;
