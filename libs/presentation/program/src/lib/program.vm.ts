import { DegreeDTO } from '@free-spot/api-client';

export interface ProgramVM {
  id: string,
  facultyId: string,
  name: string,
  degree: DegreeDTO,
  active: boolean,
};
