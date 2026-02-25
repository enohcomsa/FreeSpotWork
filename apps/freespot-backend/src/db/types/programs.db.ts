import { ObjectId } from "mongodb";
import type { DegreeT } from "../../schemas/common.zod";

export type ProgramDbBase = {
  facultyId: ObjectId;
  name: string;
  degree: DegreeT;
  active: boolean;
};

export type ProgramDbDoc = ProgramDbBase & { _id: ObjectId };
export type ProgramDbRecord = ProgramDbBase;
