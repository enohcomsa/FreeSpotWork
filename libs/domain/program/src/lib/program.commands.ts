import { DegreeDTO } from '@free-spot/api-client';

export type CreateProgramCmd = {
  facultyId: string,
  name: string,
  degree: DegreeDTO,
  active: boolean,
};

export type UpdateProgramCmd = Partial<CreateProgramCmd>;
