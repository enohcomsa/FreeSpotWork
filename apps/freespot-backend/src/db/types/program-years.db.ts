import { ObjectId } from "mongodb";

export type ProgramYearDbBase = {
  programId: ObjectId;
  yearNumber: number;
  label: string;
};

export type ProgramYearDbDoc = ProgramYearDbBase & { _id: ObjectId };
export type ProgramYearDbRecord = ProgramYearDbBase;
