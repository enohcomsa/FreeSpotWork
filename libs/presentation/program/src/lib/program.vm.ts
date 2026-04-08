import { DegreeType } from '@free-spot-domain/program';

export interface ProgramVM {
  id: string,
  facultyId: string,
  name: string,
  degree: DegreeType,
  active: boolean,
};
