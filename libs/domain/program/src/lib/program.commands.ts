import { DegreeType } from "./degree-type.enum";

export type CreateProgramCmd = {
  facultyId: string,
  name: string,
  degree: DegreeType,
  active: boolean,
};

export type UpdateProgramCmd = Partial<CreateProgramCmd>;
