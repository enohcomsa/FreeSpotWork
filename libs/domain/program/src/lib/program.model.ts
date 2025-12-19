import { DegreeDTO } from '@free-spot/api-client';

export interface Program {
  id: string,
  facultyId: string,
  name: string,
  degree: DegreeDTO,
  active: boolean,
};
