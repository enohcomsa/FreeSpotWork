import { z } from "zod";
import { CohortType, ObjectIdStr } from "./common.zod";

export const CohortIdParam = z.object({
  id: ObjectIdStr,
});

export const CohortCreate = z.object({
  type: CohortType,
  programYearId: ObjectIdStr,
  name: z.string().min(1),
  parentGroupId: ObjectIdStr.nullable().optional(),
});

export const CohortUpdate = z
  .object({
    type: CohortType.optional(),
    name: z.string().min(1).optional(),
    parentGroupId: ObjectIdStr.nullable().optional(),
  })
  .refine(v => Object.keys(v).length > 0, {
    message: "Provide at least one field to update",
  });


export const CohortResponse = z.object({
  id: ObjectIdStr,
  type: CohortType,
  programYearId: ObjectIdStr,
  name: z.string(),
  parentGroupId: ObjectIdStr.nullable().optional(),
});

export type CohortCreateInput = z.infer<typeof CohortCreate>;
export type CohortUpdateInput = z.infer<typeof CohortUpdate>;
export type CohortIdParamInput = z.infer<typeof CohortIdParam>;
export type CohortResponseDto = z.infer<typeof CohortResponse>;
