import { z } from "zod";
import { ObjectIdStr } from "./common.zod";

export const FacultyIdParam = z.object({
  id: ObjectIdStr,
});

export const FacultyCreate = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
});

export const FacultyUpdate = z
  .object({
    name: z.string().min(1).optional(),
    shortName: z.string().min(1).optional(),
  })
  .refine(v => Object.keys(v).length > 0, {
    message: "Provide at least one field to update",
  });

export const FacultyResponse = z.object({
  id: ObjectIdStr,
  name: z.string(),
  shortName: z.string(),
});

export type FacultyCreateInput = z.infer<typeof FacultyCreate>;
export type FacultyUpdateInput = z.infer<typeof FacultyUpdate>;
export type FacultyIdParamInput = z.infer<typeof FacultyIdParam>;
export type FacultyResponseDto = z.infer<typeof FacultyResponse>;
