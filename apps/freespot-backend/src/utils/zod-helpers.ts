
import { z } from "zod";

export const strictObj = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const nonEmptyPatch = <T extends z.AnyZodObject>(schema: T) =>
  schema.refine((obj: z.infer<T>) => Object.keys(obj).length > 0, {
    message: "Provide at least one field to update",
  });
