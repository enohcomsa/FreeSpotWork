import { z } from "zod";
import { Degree, ObjectIdStr } from "./common.zod";

export const ProgramIdParam = z.object({
  id: ObjectIdStr,
});

export const ProgramCreate = z.object({
  facultyId: ObjectIdStr,
  name: z.string().min(1),
  degree: Degree,
  active: z.boolean(),
});

export const ProgramUpdate = z
  .object({
    name: z.string().min(1).optional(),
    degree: Degree.optional(),
    active: z.boolean().optional(),
  })
  .refine(v => Object.keys(v).length > 0, {
    message: "Provide at least one field to update",
  });

export const ProgramResponse = z.object({
  id: ObjectIdStr,
  facultyId: ObjectIdStr,
  name: z.string(),
  degree: Degree,
  active: z.boolean(),
});

export type ProgramCreateInput = z.infer<typeof ProgramCreate>;
export type ProgramUpdateInput = z.infer<typeof ProgramUpdate>;
export type ProgramIdParamInput = z.infer<typeof ProgramIdParam>;
export type ProgramResponseDto = z.infer<typeof ProgramResponse>;
