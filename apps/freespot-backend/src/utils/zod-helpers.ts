
import { z } from "zod";

export const strictObj = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

/**
 * Refines a Zod object patch to require at least one defined field,
 * while preserving the schema's input/output types.
 */
export function nonEmptyDefinedPatch<TShape extends z.ZodRawShape, TObj extends z.ZodObject<TShape>>(schema: TObj): z.ZodEffects<TObj, z.output<TObj>, z.input<TObj>> {
  return schema.refine((obj: z.output<TObj>) => Object.values(obj as Record<string, unknown>).some((v) => v !== undefined),
    { message: "Provide at least one defined field to update" }
  );
}
