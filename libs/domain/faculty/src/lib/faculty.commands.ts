export type CreateFacultyCmd = {
  name: string;
  shortName:string;
};

export type UpdateFacultyCmd = Partial<CreateFacultyCmd>;
