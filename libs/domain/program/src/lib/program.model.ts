import { DegreeType } from "./degree-type.enum";

export interface Program {
  id: string,
  facultyId: string,
  name: string,
  degree: DegreeType,
  active: boolean,
};
