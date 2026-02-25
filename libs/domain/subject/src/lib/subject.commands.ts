export type CreateSubjectItemCmd = {
  name: string;
  shortName: string;
};

export type UpdateSubjectItemCmd = Partial<CreateSubjectItemCmd>;
