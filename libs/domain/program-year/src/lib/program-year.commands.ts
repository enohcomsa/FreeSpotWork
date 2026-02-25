
export type CreateProgramYearCmd = {
  programId: string;
  yearNumber: number;
  label: string;
};

export type UpdateProgramYearCmd = Partial<CreateProgramYearCmd>;
