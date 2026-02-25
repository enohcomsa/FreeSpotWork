export type CreateFacultyCmd = {
  name: string;
  shortName: string;
  subjectList: string[];
};

export type UpdateFacultyCmd = Partial<CreateFacultyCmd>;
